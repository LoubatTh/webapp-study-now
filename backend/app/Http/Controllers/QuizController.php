<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Qcm;
use App\Models\Quiz;
use Illuminate\Routing\Controller;

class QuizController extends Controller
{

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string',
            'qcms' => 'required|array',
            'qcms.*.question' => 'required|string',
            'qcms.*.answers' => 'required|array|size:4',
            'qcms.*.answers.*.response' => 'required|string',
            'qcms.*.answers.*.isValid' => 'required|boolean',
        ]);

        $quiz = Quiz::create([
            'name' => $data['name'],
            'owner' => $user->id,
            'visibility' => 'public',
            'likes' => 0
        ]);

        foreach($data['qcms'] as $qcmData) {
            $qcm = $quiz->qcms()->create([
                'question' => $qcmData['question'],
                'answers' => $qcmData['answers']
            ]);
        }

        return response()->json($quiz);
    }


    public function destroy(Request $request, string $id): JsonResponse
    {

        $quiz = Quiz::find($id);

        if (!$quiz) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        Quiz::destroy($id);
        return response()->json(null, 204);
    }


    public function show(Request $request, string $id): JsonResponse
    {
        $quiz = Quiz::with('qcms')->find($id);

        if (!$quiz) {
            return response()->json(['error' => 'Resource not found'], 404);

        }

        return response()->json($quiz);
    }


    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string',
            'qcms' => 'required|array',
            'qcms.*.question' => 'required|string',
            'qcms.*.answers' => 'required|array|size:4',
            'qcms.*.answers.*.response' => 'required|string',
            'qcms.*.answers.*.isValid' => 'required|boolean',
        ]);

        $quiz = Quiz::find($id);

        if (!$quiz) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        $quiz->name = $data["name"];
        $quiz->save();


        $quiz->qcms()->delete();

        foreach ($data["qcms"] as $qcmData) {
            $qcm = $quiz->qcms()->create([
                'question' => $qcmData['question'],
                'answers' => $qcmData['answers']
            ]);      
        }

        return response()->json($quiz->load("qcms"), 200);
    }

    public function myQuizzes(Request $request): JsonResponse
    {

        $user = $request->user();
        $quizzes = Quiz::where("owner", $user->id)->get();

        if (!$quizzes) {
            return response()->json(['message' => "You haven't yet created any quiz"]);
        }

        return response()->json($quizzes, 201);
    }
}
