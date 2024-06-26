<?php

namespace App\Http\Controllers;

use App\Enums\DeckVisibility;
use App\Http\Controllers\FlashcardController;
use App\Http\Requests\StoreDeckRequest;
use App\Http\Requests\UpdateDeckRequest;
use App\Http\Resources\DeckCollection;
use App\Http\Resources\DeckResource;
use App\Models\Deck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeckController
{
    /**
     * Display a listing of the resource by page.
     */
    public function getDecksByPage(Request $request)
    {
        try {
            $numberPerPage = 10;
            $myDecks = $request->has("myDecks");
            $decks = Deck::with("flashcards");

            if ($myDecks) {
                $user = Auth::guard('sanctum')->user();
                if (!$user) {
                    return response()->json(["message" => "Unauthorized"], 401);
                }

                $decks = $decks->where("user_id", $user->id);
            } else {
                $decks = $decks->where("visibility", DeckVisibility::PUBLIC ->value);
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
            $deck = Deck::with("flashcards")->find($id);
            if (!$deck) {
                return response()->json(["message" => "Deck not found"], 404);
            }

            $user = Auth::guard('sanctum')->user();

            if ($deck->visibility == "Private") {
                if (!$user) {
                    return response()->json(["message" => $user->id], 401);
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
                "visibility" => $request->visibility ? $request->visibility : DeckVisibility::PUBLIC ->value,
                "likes" => 0,
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
                "name" => $request->name ? $request->name : $deck->name,
                "visibility" => $request->visibility ? $request->visibility : $deck->visibility,
                "likes" => $request->likes ? $request->likes : $deck->likes,
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
