<?php

namespace App\Http\Controllers;

use App\Http\Controllers\FlashcardController;
use App\Http\Requests\StoreDeckRequest;
use App\Http\Requests\UpdateDeckRequest;
use App\Http\Resources\DeckCollection;
use App\Http\Resources\DeckResource;
use App\Models\Deck;
use App\Models\Organization;
use App\Models\OrganizationDeck;
use App\Models\Tag;
use App\Models\User;
use App\Models\UserDeck;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class DeckController extends Controller
{
    /**
     * Display a listing of the resource by page.
     */
    public function getDecksByPage(Request $request)
    {
        try {
            $numberPerPage = 9;
            $myDecks = $request->has("myDecks");
            $isSearch = $request->has("search");
            $decks = Deck::with("tag", "user", "flashcards");

            $user = Auth::guard("sanctum")->user();

            if ($myDecks) {
                if (!$user) {
                    return response()->json(["message" => "Unauthorized"], 401);
                }

                $decks = $decks->where(function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->orWhereIn('id', $user->likedDecks()->pluck('decks.id'));
                });
            } else {
                $decks = $decks->where("is_public", true);
            }

            if ($isSearch) {
                $search = $request->input("search");
                $searchTerm = "%{$search}%";

                $decks = $decks->where("name", "ILIKE", $searchTerm);

                $tag_ids = Tag::where("name", "ILIKE", $searchTerm)->pluck("id");

                $user_ids = User::where("name", "ILIKE", $searchTerm)->pluck("id");

                $decks = $decks->orWhereIn("tag_id", $tag_ids)->orWhereIn("user_id", $user_ids);
            }

            $decks = $decks->paginate($numberPerPage);

            foreach ($decks as $deck) {
                if (!$user) {
                    $deck->setAttribute("is_liked", false);
                } else {
                    $userDeck = UserDeck::where(["user_id" => $user->id, "deck_id" => $deck->id])->first();
                    $deck->setAttribute("is_liked", $userDeck ? $userDeck->is_liked : false);
                }
            }

            return response()->json(new DeckCollection($decks), 200);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Display one item of the resource.
     */
    public function getDeckById(int $id, Request $request)
    {
        try {
            $deck = Deck::with("tag", "user", "flashcards")->find($id);
            if (!$deck) {
                return response()->json(["message" => "Deck not found"], 404);
            }

            $user = Auth::guard("sanctum")->user();

            if ($deck->is_public == false) {
                if (!$user) {
                    return response()->json(["message" => "Unauthorized"], 401);
                }

                if ($user->id != $deck->user_id) {
                    return response()->json(["message" => "Forbidden"], 403);
                }
            }

            if (!$user) {
                $deck->setAttribute("is_liked", false);
            } else {
                $userDeck = UserDeck::where(["user_id" => $user->id, "deck_id" => $deck->id])->first();
                $deck->setAttribute("is_liked", $userDeck ? $userDeck->is_liked : false);
            }

            $response = [
                'id' => $deck['id'],
                'type' => $deck['type'],
                'name' => $deck['name'],
                'is_public' => $deck['is_public'],
                'likes' => $deck['likes'],
                'tag' => $deck['tag']['name'],
                'owner' => $deck['user']['name'],
                'is_liked' => $deck->getAttribute('is_liked'),
                'flashcards' => $deck['flashcards']
            ];
            $ownedOrganizations = Organization::where('owner_id', $user->id)->get('id');

            if (count($ownedOrganizations) > 0) {
                $relatedOrganizations = [];
                foreach ($ownedOrganizations as $organization) {
                    $relatedDeck = OrganizationDeck::where('deck_id', $deck['id'])->where('organization_id', $organization['id'])->first();
                    if ($relatedDeck) {
                        array_push($relatedOrganizations, $organization['id']);
                    }
                }

                $response['organizations'] = $relatedOrganizations;
            }

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createDeck(StoreDeckRequest $request, FlashcardController $flashcardController)
    {
        try {
            $user = $request->user();

            $deck = Deck::create([
                "name" => $request->name,
                "is_public" => $request->has("is_public") ? $request->is_public : false,
                "type" => "Deck",
                "likes" => 0,
                "tag_id" => $request->tag_id,
                "user_id" => $user->id,
            ]);

            if (isset($request['organizations'])) {
                foreach ($request['organizations'] as $organization) {
                    if (!Organization::where('id', $organization)->where('owner_id', $request->user()->id)->first()) {
                        return response()->json([
                            'error' => 'Organization not found'
                        ], 404);
                    }

                    OrganizationDeck::create([
                        'deck_id' => $deck['id'],
                        'organization_id' => $organization,
                    ]);
                }
            }

            foreach ($request->flashcards as $flashcard) {
                $flashcardController->createFlashcard($flashcard, $deck->id);
            }

            return response()->json(["message" => "Deck created successfully"], 201);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateDeckById(UpdateDeckRequest $request, int $id, FlashcardController $flashcardController)
    {
        try {
            $deck = Deck::find($id);
            if (!$deck) {
                return response()->json(["message" => "Deck not found"], 404);
            }

            $user = $request->user();
            if ($deck->user_id != $user->id) {
                return response()->json(["message" => "Forbidden"], 403);
            }

            $deck->update([
                "name" => $request->has("name") ? $request->name : $deck->name,
                "is_public" => $request->has("is_public") ? $request->is_public : $deck->is_public,
                "likes" => $request->has("likes") ? $request->likes : $deck->likes,
                "tag_id" => $request->has("tag_id") ? $request->tag_id : $deck->tag_id,
            ]);

            if (!$flashcardController->deleteFlashcardsByDeck($deck->id)) {
                return response()->json(["error" => "Error during flashcards replacement"], 400);
            }

            foreach ($request->flashcards as $flashcard) {
                $flashcardController->createFlashcard($flashcard, $deck->id);
            }


            if (isset($request['organizations'])) {
                $organizationDecks = OrganizationDeck::where('deck_id', $id)->pluck('organization_id')->toArray();
                $orgToAdd = array_diff($request['organizations'], $organizationDecks);
                $orgToRemove = array_diff($organizationDecks, $request['organizations']);

                foreach ($orgToAdd as $organization) {
                    if (!Organization::where('id', $organization)->where('owner_id', $request->user()->id)->first()) {
                        return response()->json([
                            'error' => 'Organization not found'
                        ], 404);
                    }

                    OrganizationDeck::create([
                        'deck_id' => $deck['id'],
                        'organization_id' => $organization,
                    ]);
                }

                foreach ($orgToRemove as $organization) {
                    $orgDeckId = OrganizationDeck::where('organization_id', $organization)->where('deck_id', $id)->pluck('id')->first();
                    OrganizationDeck::destroy($orgDeckId);
                }
            }

            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function deleteDeckById(int $id, Request $request)
    {
        try {
            $deck = Deck::find($id);
            if (!$deck) {
                return response()->json(["message" => "Deck not found"], 404);
            }

            $user = $request->user();
            if ($deck->user_id != $user->id) {
                return response()->json(["message" => "Forbidden"], 403);
            }

            $deck->delete();
            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }
}
