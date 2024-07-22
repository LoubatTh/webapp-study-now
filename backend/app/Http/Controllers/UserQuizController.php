<?php

namespace App\Http\Controllers;

use App\Http\Controllers\StatsController;
use App\Http\Requests\LikeRequest;
use App\Http\Requests\SaveGradeRequest;
use App\Models\Quiz;
use App\Models\UserQuiz;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\QuizCollection;

class UserQuizController extends Controller
{
    public function likeOrDislikeQuizById(LikeRequest $request, int $id)
    {
        try {
            $user = $request->user();

            $quiz = Quiz::find($id);
            if (!$quiz) {
                return response()->json(["message" => "Quiz not found"], 404);
            }

            $userQuiz = UserQuiz::firstOrCreate(
                ["quiz_id" => $id, "user_id" => $user->id],
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

            if ($request->isLiked == $userQuiz->is_liked) {
                return response()->noContent();
            }

            $quiz->update([
                "likes" => $userQuiz->is_liked ?
                    $quiz->likes + 1 :
                    ($quiz->likes > 0 ?
                        $quiz->likes - 1 :
                        0),
            ]);

            $userQuiz->update([
                "is_liked" => !$userQuiz->is_liked,
            ]);

            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }


    public function getLikedQuizzes(Request $request): JsonResponse
    {
        $user = $request->user();

        $likedQuizzes = $user->likedQuizzes;

        if ($likedQuizzes->isEmpty()) {
            return response()->json(['message' => "You haven't liked any quiz yet"], 200);
        }

        return response()->json(new QuizCollection($likedQuizzes), 200);
    }
}
