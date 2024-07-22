<?php

namespace App\Http\Controllers;

use App\Http\Controllers\StatsController;
use App\Http\Requests\StoreUserQuizResultRequest;
use App\Http\Resources\UserQuizResource;
use App\Models\Quiz;
use App\Models\UserQuiz;
use App\Models\UserQuizResults;
use Illuminate\Http\Request;
use Throwable;

class UserQuizResultsController
{
    public function index(Request $request)
    {
        $userQuizzes = UserQuiz::with('results', 'quiz', 'quiz.tag')->where('user_id', $request->user()->id)->get();

        return response()->json(UserQuizResource::collection($userQuizzes), 200);
    }

    public function show(Request $request, int $id)
    {
        $userQuiz = UserQuiz::with('results')->where('quiz_id', $id)->where('user_id', $request->user()->id)->first();

        if (!$userQuiz) {
            return response()->json([
                'error' => 'User quiz not found'
            ], 404);
        }

        return response()->json(new UserQuizResource($userQuiz));
    }

    public function store(StoreUserQuizResultRequest $request, StatsController $statsController)
    {
        if (!Quiz::find($request['quiz_id'])) {
            return response()->json([
                'error' => 'Quiz not found',
            ], 404);
        }

        $userQuiz = UserQuiz::firstOrCreate(
            [
                'quiz_id' => $request['quiz_id'],
                'user_id' => $request->user()->id,
            ],
            [
                'is_liked' => false,
                'next_repetition' => null,
            ]
        );

        $userQuizResults = UserQuizResults::where('user_quiz_id', $userQuiz->id)->latest()->get();
        try {
            [$repetition, $easinessFactor, $interval] = count($userQuizResults) > 0
                ? $statsController->sm2($request['grade'], $request['max_grade'], $userQuizResults[0]['repetition'], $userQuizResults[0]['easiness_factor'], $userQuizResults[0]['interval'])
                : $statsController->sm2($request['grade'], $request['max_grade']);
        } catch (Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }

        UserQuizResults::create([
            'user_quiz_id' => $userQuiz->id,
            'grade' => $request['grade'],
            'max_grade' => $request['max_grade'],
            'repetition' => $repetition,
            'easiness_factor' => $easinessFactor,
            'interval' => $interval,
        ]);

        $userQuiz->update([
            'next_repetition' => now()->addDays($interval),
        ]);

        return response()->json([
            'message' => 'Quiz result created successfully',
        ], 201);
    }

}
