<?php

namespace App\Http\Controllers;

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
            return response()->json(new DeckCollection(Deck::all()->with("flashcards")), 200);
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
            $deck = Deck::find($id);
            return response()->json(new DeckResource($deck), 200);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createDeck(StoreDeckRequest $request)
    {
        try {
            Deck::create($request->validated());
            return response()->json(["message" => "Deck created successfully"], 201);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateDeckById(UpdateDeckRequest $request, int $id)
    {
        try {
            $deck = Deck::find($id);
            if (!$deck) {
                return response()->json(["message" => "Deck not found"], 404);
            }

            $deck->update($request->all());
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
