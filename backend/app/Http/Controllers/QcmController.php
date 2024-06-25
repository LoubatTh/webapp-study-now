<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Qcm;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class QcmController extends Controller
{
    public function store(Request $request, string $id): JsonResponse
    {

        $quiz = Quiz::find($id);

        $request->validate([
            'question' => 'required|string',
            'answers' => 'required|array|size:4',
            'answers.*.response' => 'required|string',
            'answers.*.isValid' => 'required|boolean',
        ]);

        $qcm = $quiz->qcms()->create([
            'question' => $request->question,
            'answers' => $request->answers,
        ]);

        return response()->json($qcm, 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $qcm = Qcm::findOrFail($id);

        return response()->json($qcm);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'question' => 'sometimes|required|string',
            'answers' => 'sometimes|required|array|size:4',
            'answers.*.response' => 'required|string',
            'answers.*.isValid' => 'required|boolean',
        ]);

        $qcm = Qcm::findOrFail($id);

        if ($request->has('question')) {
            $qcm->question = $request->question;
        }

        if ($request->has('answers')) {
            $qcm->answers = $request->answers;
        }

        $qcm->save();

        return response()->json($qcm);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        
        if (Qcm::find($id)) {
  
            Qcm::destroy($id);
            return response()->json(null, 204);

        } else {
            
            return response()->json(['error' => 'Resource not found'], 404);
        }
    }

}