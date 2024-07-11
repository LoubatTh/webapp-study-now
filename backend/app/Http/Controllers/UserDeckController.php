<?php

namespace App\Http\Controllers;

use App\Http\Controllers\StatsController;
use App\Http\Requests\SaveGradeRequest;
use App\Models\Deck;
use App\Models\UserDeck;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;

class UserDeckController extends Controller
{
    public function likeOrDislikeDeckById(Request $request, int $id)
    {
        try {
            $user = $request->user();

            $deck = Deck::find($id);
            if (!$deck) {
                return response()->json(["message" => "Deck not found"], 404);
            }

            $userDeck = UserDeck::firstOrCreate(
                ["deck_id" => $id, "user_id" => $user->id],
                [
                    "easiness_factor" => 2.5,
                    "repetition" => 0,
                    "interval" => 0,
                    "date" => now(),
                    "user_grade" => null,
                    "prev_user_grade" => null,
                    "is_liked" => false,
                ]
            );

            $userDeck->update([
                "is_liked" => !$userDeck->is_liked,
            ]);

            $deck->update([
                "likes" => $userDeck->is_liked ?
                    $deck->likes + 1 :
                    ($deck->likes > 0 ?
                        $deck->likes - 1 :
                        0),
            ]);

            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    public function saveGradeDeckById(SaveGradeRequest $request, int $id, StatsController $statsController)
    {
        try {
            $user = $request->user();

            $deck = Deck::find($id);
            if (!$deck) {
                return response()->json(["message" => "Deck not found"], 404);
            }

            $userDeck = UserDeck::firstOrCreate(
                ["deck_id" => $id, "user_id" => $user->id],
                [
                    "easiness_factor" => 2.5,
                    "repetition" => 0,
                    "interval" => 0,
                    "date" => now(),
                    "user_grade" => null,
                    "prev_user_grade" => null,
                    "is_liked" => false,
                ]
            );

            [$repetition, $easiness, $interval] = $statsController->updateStatsUser($request->grade, $userDeck->repetition, $userDeck->easiness_factor, $userDeck->interval);

            $prev_user_grade = $userDeck->user_grade;

            $userDeck->update([
                "easiness_factor" => $easiness,
                "repetition" => $repetition,
                "interval" => $interval,
                "date" => now(),
                "user_grade" => $request->grade,
                "prev_user_grade" => $prev_user_grade,
            ]);

            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    public function getLikedDecks(Request $request): JsonResponse
    {
        $user = $request->user();

        $likedDecks = UserDeck::where("user_id", $user->id)->where("is_liked", true)->with('deck')->get();

        if ($likedDecks->isEmpty()) {
            return response()->json(['error' => "You haven't liked any deck yet"], 200);
        }

        return response()->json($likedDecks, 200);
    }
}
