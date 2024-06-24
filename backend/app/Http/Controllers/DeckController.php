<?php

namespace App\Http\Controllers;

use App\Http\Controllers\FlashcardController;
use App\Http\Requests\StoreDeckRequest;
use App\Http\Requests\UpdateDeckRequest;
use App\Http\Resources\DeckCollection;
use App\Http\Resources\DeckResource;
use App\Models\Deck;

class DeckController
{
    /**
     * Display a listing of the resource.
     */
    public function getDecksByUser()
    {
        try {
            // return new DeckCollection(Deck::where("user_id", auth()->user()->id)->get());
            return response()->json(new DeckCollection(Deck::with("flashcards")->get()), 200);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function getDeckById(int $id)
    {
        try {
            $deck = Deck::with("flashcards")->find($id);
            if (!$deck) {
                return response()->json(["message" => "Deck not found"], 404);
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
            $deck = Deck::create([
                "name" => $request->name,
                "visibility" => $request->visibility ? $request->visibility : "Public",
                "likes" => 0,
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
    public function deleteDeckById(int $id)
    {
        try {
            $deck = Deck::find($id);
            if (!$deck) {
                return response()->json(["message" => "Deck not found"], 404);
            }

            $deck->delete();
            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }
}
