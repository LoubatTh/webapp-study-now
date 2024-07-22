<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrganizationQuizResource;
use App\Models\OrganizationQuiz;
use App\Models\Quiz;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OrganizationQuizController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, int $id)
    {
        $quizzes = OrganizationQuiz::with('quiz', 'quiz.qcms', 'quiz.tag', 'quiz.user')->where('organization_id', $id)->get();

        return response()->json(OrganizationQuizResource::collection($quizzes));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, int $id)
    {
        try {
            $data = json_decode($request->all()['data'], true);
            $quiz = Quiz::find($data['quiz_id']);

            if (!$quiz) {
                return response()->json([
                    'error' => 'Quiz not found'
                ], 404);
            }

            if (OrganizationQuiz::where('quiz_id', $data['quiz_id'])->where('organization_id', $id)->first()) {
                return response()->json([
                    'message' => 'Quiz already in organization'
                ]);
            }

            if (!$quiz['is_public'] && $quiz['user_id'] !== $request->user()['id']) {
                return response()->json([
                    'error' => 'Only owned or public quizzes can be added to the organization',
                ], 403);
            }

            $file = $request->file('file');
            $filePath = null;

            if ($file) {
                if ($file->extension() !== 'pdf') {
                    return response()->json([
                        'error' => 'Only pdf files supported'
                    ], 400);
                }
                $filePath = Storage::disk('s3')->putFile('organizations/quizzes', $file, 'public');
            }

            OrganizationQuiz::create([
                'organization_id' => $id,
                'quiz_id' => $data['quiz_id'],
                'file_path' => $filePath,
            ]);

            if ($filePath) {
                return response()->json([
                    'message' => 'Quiz added to the organization',
                    'file_url' => env('AWS_URL') . $filePath,
                ], 201);
            }

            return response()->json([
                'message' => 'Quiz added to the organization',
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id, int $quizId)
    {
        $organizationQuiz = OrganizationQuiz::with('quiz', 'quiz.qcms', 'quiz.tag', 'quiz.user')
            ->where('organization_id', $id)
            ->where('quiz_id', $quizId)
            ->first();

        if (!$organizationQuiz) {
            return response()->json([
                'error' => 'Not found'
            ], 404);
        }

        return response()->json(new OrganizationQuizResource($organizationQuiz));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id, int $quizId)
    {
        $organizationQuiz = OrganizationQuiz::where('organization_id', $id)->where('quiz_id', $quizId)->first();
        $file = $request->file('file');

        if ($file->extension() !== 'pdf') {
            return response()->json([
                'error' => 'Only pdf files supported'
            ], 400);
        }

        if (!$organizationQuiz) {
            return response()->json([
                'error' => 'Not found',
            ], 404);
        }

        if ($organizationQuiz['file_path']) {
            Storage::disk('s3')->delete($organizationQuiz['file_path']);
        }

        $filePath = Storage::disk('s3')->putFile('organizations/quizzes', $file, 'public');
        $organizationQuiz->update([
            'file_path' => $filePath,
        ]);

        return response()->json([
            'message' => 'File updated',
            'file_path' => $this->urlBuilder($organizationQuiz['file_path']),
        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $id, int $quizId)
    {
        $organizationQuiz = OrganizationQuiz::where('organization_id', $id)->where('quiz_id', $quizId)->first();

        Storage::disk('s3')->delete($organizationQuiz['file_path']);
        $organizationQuiz->delete();

        return response()->noContent();
    }

    public function urlBuilder(string $filename)
    {
        $appUrl = env('APP_DEBUG') ? 'backend' : env('APP_URL');

        return url("http://$appUrl/storage/$filename");
    }
}
