<?php

namespace App\Http\Controllers;


use App\Models\Organization;
use App\Models\OrganizationQuiz;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Quiz;
use App\Models\Tag;
use App\Models\User;
use App\Models\UserQuiz;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\QuizResource;
use App\Http\Resources\QuizCollection;

class QuizController extends Controller
{

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string',
            'is_public' => 'boolean',
            'tag_id' => 'required|integer',
            'organizations' => 'array',
            'qcms' => 'required|array',
            'qcms.*.question' => 'required|string',
            'qcms.*.answers' => 'required|array|size:4',
            'qcms.*.answers.*.answer' => 'required|string',
            'qcms.*.answers.*.isValid' => 'required|boolean',
        ]);

        $quiz = Quiz::create([
            'name' => $data['name'],
            'user_id' => $user->id,
            'type' => 'Quiz',
            'is_public' => $request->has("is_public") ? $request->is_public : false,
            'likes' => 0,
            'tag_id' => $request->tag_id
        ]);

        if (isset($data['organizations'])) {
            foreach ($data['organizations'] as $organization) {
                if (!Organization::where('id', $organization)->where('owner_id', $request->user()->id)->first()) {
                    return response()->json([
                        'error' => 'Organization not found'
                    ], 404);
                }

                OrganizationQuiz::create([
                    'quiz_id' => $quiz['id'],
                    'organization_id' => $organization,
                ]);
            }
        }

        foreach ($data['qcms'] as $qcmData) {
            $quiz->qcms()->create([
                'question' => $qcmData['question'],
                'answers' => $qcmData['answers']
            ]);
        }

        return response()->json($quiz, 201);
    }


    public function destroy(Request $request, string $id): JsonResponse
    {

        $user = $request->user();

        $quiz = Quiz::find($id);

        if (!$quiz) {
            return response()->json(['message' => 'Quiz not found'], 404);
        }

        if ($quiz->user_id != $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }


        Quiz::destroy($id);
        return response()->json(null, 204);
    }


    public function show(Request $request, int $id): JsonResponse
    {
        $user = Auth::guard("sanctum")->user();
        $user ? $user = User::find($user->id) : null;

        $quiz = Quiz::with('qcms', 'user')->find($id);


        if (!$quiz) {
            return response()->json(['message' => 'Quizz not found'], 404);

        }

        if ($quiz->is_public == false) {
            if (!$user) {
                return response()->json(["message" => "Unauthorized"], 401);
            }

            $organizations = Organization::where('owner_id', $user->id)
                ->pluck('id')
                ->merge($user->organizations->pluck('id'))
                ->unique();

            if ($organizations->count() > 0) {
                if ($user->id != $quiz->user_id && !OrganizationQuiz::wherein('organization_id', $organizations)->where('quiz_id', $id)->exists()) {
                    return response()->json(['message' => 'Forbidden'], 403);
                }
            } else if ($user->id != $quiz->user_id) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        $response = [
            'id' => $quiz['id'],
            'type' => $quiz['type'],
            'name' => $quiz['name'],
            'is_public' => $quiz['is_public'],
            'likes' => $quiz['likes'],
            'tag' => $quiz['tag']['name'],
            'owner' => $quiz['user']['name'],
            'owner_avatar' => env('AWS_URL') . $quiz['user']['avatar'],
            'is_liked' => $quiz->getAttribute('is_liked'),
            'qcms' => $quiz['qcms']
        ];

        if (!$user) {
            $quiz->setAttribute("is_liked", false);
        } else {
            $userQuiz = UserQuiz::where(["user_id" => $user->id, "quiz_id" => $quiz->id])->first();
            $quiz->setAttribute("is_liked", $userQuiz ? $userQuiz->is_liked : false);
            $ownedOrganizations = Organization::where('owner_id', $user->id)->get('id');

            if (count($ownedOrganizations) > 0) {
                $relatedOrganizations = [];
                foreach ($ownedOrganizations as $organization) {
                    $relatedQuiz = OrganizationQuiz::where('quiz_id', $quiz['id'])->where('organization_id', $organization['id'])->first();
                    if ($relatedQuiz) {
                        array_push($relatedOrganizations, $organization['id']);
                    }
                }

                $response['organizations'] = $relatedOrganizations;
            }
        }

        return response()->json($response, 200);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => 'required|string',
            'is_public' => 'boolean',
            'organizations' => 'array',
            'organizations.*' => 'integer',
            'tag_id' => 'integer',
            'qcms' => 'required|array',
            'qcms.*.question' => 'required|string',
            'qcms.*.answers' => 'required|array|size:4',
            'qcms.*.answers.*.answer' => 'required|string',
            'qcms.*.answers.*.isValid' => 'required|boolean',
        ]);
        $quiz = Quiz::find($id);

        if (!$quiz) {
            return response()->json(['message' => 'Quiz not found'], 404);
        }

        if ($quiz->user_id != $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $quiz->name = $data["name"];
        $quiz->is_public = $data['is_public'] ? $data['is_public'] : false;
        $quiz->tag_id = $request->has("tag_id") ? $request->tag_id : $quiz->tag_id;
        $quiz->save();

        $quiz->qcms()->delete();

        foreach ($data["qcms"] as $qcmData) {
            $quiz->qcms()->create([
                'question' => $qcmData['question'],
                'answers' => $qcmData['answers']
            ]);
        }

        if (isset($data['organizations'])) {
            $organizationQuizzes = OrganizationQuiz::where('quiz_id', $id)->pluck('organization_id')->toArray();
            $orgToAdd = array_diff($data['organizations'], $organizationQuizzes);
            $orgToRemove = array_diff($organizationQuizzes, $data['organizations']);

            foreach ($orgToAdd as $organization) {
                if (!Organization::where('id', $organization)->where('owner_id', $request->user()->id)->first()) {
                    return response()->json([
                        'error' => 'Organization not found'
                    ], 404);
                }

                OrganizationQuiz::create([
                    'quiz_id' => $quiz['id'],
                    'organization_id' => $organization,
                ]);
            }

            foreach ($orgToRemove as $organization) {
                $orgQuizId = OrganizationQuiz::where('organization_id', $organization)->where('quiz_id', $id)->pluck('id')->first();
                OrganizationQuiz::destroy($orgQuizId);
            }
        }

        return response()->json($quiz->load("qcms"), 200);
    }

    public function index(Request $request): JsonResponse
    {
        $numberPerPage = 9;
        $isSearch = $request->has("search");
        $quizzes = Quiz::with("tag", "user", "qcms");

        $user = Auth::guard('sanctum')->user();

        if ($request->has("myQuizzes")) {
            if (!$user) {
                return response()->json(["message" => "Unauthorized"], 401);
            }

            $quizzes = $quizzes->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhereIn('id', $user->likedQuizzes()->pluck('quizzes.id'));
            });
            if (!$quizzes) {
                return response()->json(['message' => "You haven't created any quiz yet"], 200);
            }
        } else {
            $quizzes = $quizzes->where("is_public", true);
        }

        if ($isSearch) {
            $search = $request->input("search");
            $searchTerm = "%{$search}%";

            $quizzes = $quizzes->where('name', 'ILIKE', $searchTerm);

            $tag_ids = Tag::where('name', 'ILIKE', $searchTerm)->pluck('id');

            $user_ids = User::where('name', 'ILIKE', $searchTerm)->pluck('id');

            $quizzes = $quizzes->orWhereIn("tag_id", $tag_ids)->orWhereIn("user_id", $user_ids);
        }

        $quizzes = $quizzes->paginate($numberPerPage);

        foreach ($quizzes as $quiz) {
            if (!$user) {
                $quiz->setAttribute("is_liked", false);
            } else {
                $userQuiz = UserQuiz::where(["user_id" => $user->id, "quiz_id" => $quiz->id])->first();
                $quiz->setAttribute("is_liked", $userQuiz ? $userQuiz->is_liked : false);
            }
        }

        return response()->json(new QuizCollection($quizzes), 200);
    }
}