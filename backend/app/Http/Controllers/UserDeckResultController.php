<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserDeckResultRequest;
use App\Http\Resources\UserDeckResource;
use App\Models\Deck;
use App\Models\UserDeck;
use App\Models\UserDeckResults;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class UserDeckResultController extends Controller
{
    public function index(Request $request)
    {
        $userDecks = UserDeck::with('results', 'deck', 'deck.tag')->where('user_id', $request->user()->id)->get();

        return response()->json(UserDeckResource::collection($userDecks), 200);
    }

    public function show(Request $request, int $id)
    {
        $userDeck = UserDeck::with('results')->where('deck_id', $id)->where('user_id', $request->user()->id)->first();

        if (!$userDeck) {
            return response()->json([
                'error' => 'User deck not found'
            ], 404);
        }

        return response()->json(new UserDeckResource($userDeck));
    }

    public function store(StoreUserDeckResultRequest $request, StatsController $statsController)
    {
        if (!Deck::find($request['deck_id'])) {
            return response()->json([
                'error' => 'Deck not found',
            ], 404);
        }

        $userDeck = UserDeck::firstOrCreate(
            [
                'deck_id' => $request['deck_id'],
                'user_id' => $request->user()->id,
            ],
            [
                'is_liked' => false,
                'next_repetition' => null,
            ]
        );

        $userDeckResults = UserDeckResults::where('user_deck_id', $userDeck->id)->latest()->get();
        [$repetition, $easinessFactor, $interval] = count($userDeckResults) > 0
            ? $statsController->sm2($request['grade'], 5, $userDeckResults[0]['repetition'], $userDeckResults[0]['easiness_factor'], $userDeckResults[0]['interval'])
            : $statsController->sm2($request['grade'], 5);

        UserDeckResults::create([
            'user_deck_id' => $userDeck->id,
            'grade' => $request['grade'],
            'repetition' => $repetition,
            'easiness_factor' => $easinessFactor,
            'interval' => $interval,
        ]);

        $userDeck->update([
            'next_repetition' => now()->addDays($interval),
        ]);

        return response()->json([
            'message' => 'Deck result created successfully',
        ], 201);
    }
}
