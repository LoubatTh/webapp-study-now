<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserDecksRequest;
use App\Http\Requests\UpdateLikesDeckRequest;
use App\Models\Deck;
use App\Models\UserDeck;

class UserDeckController
{
    public function likeOrDislikeDeckById(UpdateLikesDeckRequest $request, int $id)
    {
        try {
            $user = $request->user();

            $deck = Deck::find($id);
            if (!$deck) {
                return response()->json(["message" => "Deck not found"], 404);
            }

            $userDeck = UserDeck::where("deck_id", $id)->where("user_id", $user->id);
            if (!$userDeck) {
                $userDeck = UserDeck::create([
                    "user_id" => $user->id,
                    "deck_id" => $deck->id,
                    "easinessFactor" => 2.5,
                    "repetition" => 0,
                    "interval" => 0,
                    "date" => date_create("now"),
                    "userGrade" => null,
                    "prevUserGrade" => null,
                    "isLiked" => false,
                ]);
            }

            $userDeck->update([
                "isLiked" => !$userDeck->isLiked,
            ]);

            $deck->update([
                "likes" => $userDeck->isLiked ?
                    $deck->likes + 1 :
                    $deck->likes > 0 ?
                    $deck->likes - 1 :
                    0,
            ]);

            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserDecksRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UserDeck $userDecks)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserDeck $userDecks)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserDeck $userDecks)
    {
        //
    }
}
