<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserQuizzesRequest;
use App\Http\Requests\UpdateLikesQuizRequest;
use App\Models\Quiz;
use App\Models\UserQuiz;

class UserQuizController
{
    public function likeOrDislikeDeckById(UpdateLikesQuizRequest $request, int $id)
    {
        try {
            $user = $request->user();

            $quiz = Quiz::find($id);
            if (!$quiz) {
                return response()->json(["message" => "Quiz not found"], 404);
            }

            $userQuiz = UserQuiz::where("deck_id", $id)->where("user_id", $user->id);
            if (!$userQuiz) {
                $userQuiz = UserQuiz::create([
                    "user_id" => $user->id,
                    "quiz_id" => $quiz->id,
                    "easinessFactor" => 2.5,
                    "repetition" => 0,
                    "interval" => 0,
                    "date" => date_create("now"),
                    "userGrade" => null,
                    "prevUserGrade" => null,
                    "isLiked" => false,
                ]);
            }

            $userQuiz->update([
                "isLiked" => !$userQuiz->isLiked,
            ]);

            $quiz->update([
                "likes" => $userQuiz->isLiked ?
                    $quiz->likes + 1 :
                    $quiz->likes > 0 ?
                    $quiz->likes - 1 :
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
    public function store(StoreUserQuizzesRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UserQuiz $userQuizzes)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserQuiz $userQuizzes)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserQuiz $userQuizzes)
    {
        //
    }
}
