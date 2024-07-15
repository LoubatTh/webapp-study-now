<?php

namespace App\Http\Controllers;

use App\Http\Controllers\FlashcardController;
use App\Http\Requests\StoreDeckRequest;
use App\Http\Requests\UpdateDeckRequest;
use App\Http\Resources\DeckCollection;
use App\Http\Resources\DeckResource;
use App\Models\Deck;
use App\Models\Quiz;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class DeckController extends Controller
{
    /**
     * Display a listing of two resources by page.
     */
    public function getDecksAndQuizzesByPage(Request $request)
    {
        try {
            $numberPerPage = 18;
            $private = $request->has("me");
            $isSearch = $request->has("search");
            $decks = Deck::with("tag", "user", "flashcards");
            $quizzes = Quiz::with("tag", "user", "qcms");

            if ($private) {
                $user = Auth::guard('sanctum')->user();
                if (!$user) {
                    return response()->json(["message" => "Unauthorized"], 401);
                }

                $decks = $decks->where("user_id", $user->id);
                $quizzes = $quizzes->where("user_id", $user->id);
            } else {
                $decks = $decks->where("is_public", true);
                $quizzes = $quizzes->where("is_public", true);
            }

            if ($isSearch) {
                $search = $request->input("search");
                $searchTerm = "%{$search}%";

                $decks = $decks->where('name', 'ILIKE', $searchTerm);
                $quizzes = $quizzes->where('name', 'ILIKE', $searchTerm);

                $tag_ids = Tag::where('name', 'ILIKE', $searchTerm)->pluck('id');

                $user_ids = User::where('name', 'ILIKE', $searchTerm)->pluck('id');

                $decks = $decks->orWhereIn("tag_id", $tag_ids)->orWhereIn("user_id", $user_ids);
                $quizzes = $quizzes->orWhereIn("tag_id", $tag_ids)->orWhereIn("user_id", $user_ids);
            }

            $decks = $decks->get();
            $quizzes = $quizzes->get();

            $all = $decks->merge($quizzes);
            $all = $all->shuffle();

            $totalItems = $all->count();
            $currentPage = $request->has("page") ? intval($request->input("page")) : 1;
            $lastPage = ceil($totalItems / $numberPerPage);

            $firstElement = ($currentPage - 1) * $numberPerPage + 1;

            $dataPaged = $all->slice($firstElement - 1, $numberPerPage)->values();

            $data = $dataPaged->map(function ($item) {
                $mappedItem = [
                    'id' => $item->id,
                    'name' => $item->name,
                    'is_public' => $item->is_public,
                    'likes' => $item->likes,
                    'type' => $item->type,
                    'tag' => $item->tag->name,
                    'owner' => $item->user->name,
                ];

                if ($item->relationLoaded('flashcards')) {
                    $mappedItem['flashcards'] = $item->flashcards->map(function ($flashcard) {
                        return [
                            'id' => $flashcard->id,
                            'question' => $flashcard->question,
                            'answer' => $flashcard->answer,
                        ];
                    });
                }

                if ($item->relationLoaded('qcms')) {
                    $mappedItem['qcms'] = $item->qcms->map(function ($qcm) {
                        return [
                            'id' => $qcm->id,
                            'question' => $qcm->question,
                            'answers' => $qcm->answers,
                        ];
                    });
                }

                return $mappedItem;
            });

            $response = [
                'data' => $data,
                'links' => [
                    'first' => "http://localhost:8000/api/all?page=1",
                    'last' => "http://localhost:8000/api/decks?page=" . $lastPage,
                    'prev' => $currentPage != 1 ? "http://localhost:8000/api/decks?page=" . $currentPage - 1 : null,
                    'next' => $currentPage < $lastPage ? "http://localhost:8000/api/decks?page=" . $currentPage + 1 : null,
                ],
                'meta' => [
                    'current_page' => $currentPage,
                    'from' => $firstElement,
                    'last_page' => $lastPage,
                    'path' => "http://localhost:8000/api/all",
                    'per_page' => $numberPerPage,
                    'to' => $firstElement + $numberPerPage - 1 > $totalItems ? $totalItems : $firstElement + $numberPerPage - 1,
                    'total' => $totalItems,
                ],
            ];

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

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

            if ($myDecks) {
                $user = Auth::guard('sanctum')->user();
                if (!$user) {
                    return response()->json(["message" => "Unauthorized"], 401);
                }

                $decks = $decks->where("user_id", $user->id);
            } else {
                $decks = $decks->where("is_public", true);
            }

            if ($isSearch) {
                $search = $request->input("search");
                $searchTerm = "%{$search}%";

                $decks = $decks->where('name', 'ILIKE', $searchTerm);

                $tag_ids = Tag::where('name', 'ILIKE', $searchTerm)->pluck('id');

                $user_ids = User::where('name', 'ILIKE', $searchTerm)->pluck('id');

                $decks = $decks->orWhereIn("tag_id", $tag_ids)->orWhereIn("user_id", $user_ids);
            }

            return response()->json(new DeckCollection($decks->paginate($numberPerPage)), 200);
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

            $user = Auth::guard('sanctum')->user();

            if ($deck->is_public == false) {
                if (!$user) {
                    return response()->json(["message" => "Unauthorized"], 401);
                }

                if ($user->id != $deck->user_id) {
                    return response()->json(["message" => "Forbidden"], 403);
                }
            }

            return response()->json(new DeckResource($deck), 200);
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
