<?php

namespace App\Http\Controllers;

use App\Http\Controllers\StatsController;
use App\Http\Requests\LikeRequest;
use App\Http\Requests\SaveGradeRequest;
use App\Models\Deck;
use App\Models\UserDeck;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\DeckCollection;

class UserDeckController extends Controller
{
    public function likeOrDislikeDeckById(LikeRequest $request, int $id)
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

            if ($request->isLiked == $userDeck->is_liked) {
                return response()->noContent();
            }

            $deck->update([
                "likes" => $request->isLiked ?
                    $deck->likes + 1 :
                    ($deck->likes > 0 ?
                        $deck->likes - 1 :
                        0),
            ]);

            $userDeck->update([
                "is_liked" => $request->isLiked,
            ]);

            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    public function getLikedDecks(Request $request): JsonResponse
    {
        $numberPerPage = 9;

        $user = $request->user();

        $likedDecks = $user->likedDecks()->with("tag", "user", "flashcards", "userDecks")->paginate($numberPerPage);

        if ($likedDecks->isEmpty()) {
            return response()->json(['error' => "You haven't liked any deck yet"], 200);
        }

        return response()->json(new DeckCollection($likedDecks), 200);
    }
}
