<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserDeckResource;
use App\Http\Resources\UserQuizResource;
use App\Models\Tag;
use App\Models\User;
use App\Models\UserDeck;
use App\Models\UserQuiz;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Exceptions\MathException;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        $numberPerPage = 18;
        [$userDecks, $userQuizzes] = null;
        $all = new Collection();

        switch ($request->input('type')) {
            case 'Deck':
                $userDecks = $this->userDecks($request);
                $all = $userDecks;
                break;
            case 'Quiz':
                $userQuizzes = $this->userQuizzes($request);
                $all = $userQuizzes;
                break;
            default:
                $userDecks = $this->userDecks($request);
                $userQuizzes = $this->userQuizzes($request);
                $all = $userDecks->merge($userQuizzes);
                break;
        }

        $all = $all->sortByDesc('created_at');
        $totalItems = $all->count();
        $currentPage = $request->has('page') ? intval($request->input('page')) : 1;
        $prevPage = $currentPage - 1;
        $nextPage = $currentPage + 1;
        $lastPage = ceil($totalItems / $numberPerPage) > 0 ? ceil($totalItems / $numberPerPage) : 1;

        $firstElement = ($currentPage - 1) * $numberPerPage + 1;

        $data = $all->slice($firstElement - 1, $numberPerPage)->values();

        $url = env('APP_URL') . '/api';
        $response = [
            "data" => $data,
            "links" => [
                "first" => "{$url}/stats?page=1",
                "last" => "{$url}/stats?page={$lastPage}",
                "prev" => $currentPage != 1 ? "{$url}/stats?page={$prevPage}" : null,
                "next" => $currentPage < $lastPage ? "{$url}/stats?page={$nextPage}" : null,
            ],
            "meta" => [
                "current_page" => $currentPage,
                "from" => $totalItems == 0 ? null : $firstElement,
                "last_page" => $lastPage,
                "path" => "{$url}/stats",
                "per_page" => $numberPerPage,
                "to" => $totalItems == 0 ? null : ($firstElement + $numberPerPage - 1 > $totalItems ? $totalItems : $firstElement + $numberPerPage - 1),
                "total" => $totalItems,
            ],
        ];

        return response()->json($response);
    }

    public function userDecks(Request $request)
    {
        $userDeck = UserDeck::with('results', 'deck', 'deck.tag', 'deck.user')
            ->whereHas(
                'deck',
                function ($query) use ($request) {
                    $request->has('name') ? $query->where('name', 'ILIKE', "%{$request->input('name')}%") : null;
                    $request->has('isPublic') ? $query->where('is_public', $request->input('isPublic')) : null;

                    if ($request->has('owner')) {
                        $users = User::where('name', 'ILIKE', "%{$request->input('owner')}%")->pluck('id');
                        $users->count() > 0
                            ? $query->where('user_id', $users)
                            : $query->where('user_id', 0);
                    }

                    if ($request->has('tag')) {
                        $tags = Tag::where('name', 'ILIKE', "%{$request->input('tag')}%")->pluck('id');
                        $tags->count() > 0
                            ? $query->where('tag_id', $tags)
                            : $query->where('tag_id', 0);
                    }

                    $query->withCount('flashcards');
                }
            );

        $userDeck->whereNotNull('next_repetition');
        $userDeck->where('user_id', $request->user()->id);
        $request->has('isLiked') ? $userDeck->where('is_liked', $request->input('isLiked')) : null;
        $userDeck->with([
            'deck' => function ($query) {
                $query->withCount('flashcards');
            }
        ]);

        return UserDeckResource::collection($userDeck->get());
    }

    public function userQuizzes(Request $request)
    {
        $userQuiz = UserQuiz::with('results', 'quiz', 'quiz.tag', 'quiz.user')
            ->whereHas(
                'quiz',
                function ($query) use ($request) {
                    $request->has('name') ? $query->where('name', 'ILIKE', "%{$request->input('name')}%") : null;
                    $request->has('isPublic') ? $query->where('is_public', $request->input('isPublic')) : null;

                    if ($request->has('owner')) {
                        $users = User::where('name', 'ILIKE', "%{$request->input('owner')}%")->pluck('id');
                        $users->count() > 0
                            ? $query->where('user_id', $users)
                            : $query->where('user_id', 0);
                    }

                    if ($request->has('tag')) {
                        $tags = Tag::where('name', 'ILIKE', "%{$request->input('tag')}%")->pluck('id');
                        $tags->count() > 0
                            ? $query->where('tag_id', $tags)
                            : $query->where('tag_id', 0);
                    }
                }
            );

        $userQuiz->whereNotNull('next_repetition');
        $userQuiz->where('user_id', $request->user()->id);
        $request->has('isLiked') ? $userQuiz->where('is_liked', $request->input('isLiked')) : null;
        $userQuiz->with([
            'quiz' => function ($query) {
                $query->withCount('qcms');
            }
        ]);

        return UserQuizResource::collection($userQuiz->get());
    }

    /**
     * Algorithm: https://en.wikipedia.org/wiki/SuperMemo#Algorithms
     */
    public function sm2(int $grade, int $maxGrade = 5, int $repetition = 0, float $easiness = 2.5, int $interval = 1)
    {
        throw_if($grade > $maxGrade, new MathException("grade should be smaller or equals to max_grade"));
        $percentGrade = $grade / $maxGrade * 100;

        if ($percentGrade >= 60) {
            switch ($repetition) {
                case 0:
                    $interval = 1;
                    break;
                case 1:
                    $interval = 6;
                    break;
                default:
                    round($interval * $easiness);
                    break;
            }

            $repetition++;
        } else {
            $repetition = 0;
            $interval = 1;
        }

        $easiness += 0.1 - ((100 - $percentGrade) / 20) * (0.08 + ((100 - $percentGrade) / 20) * 0.02);
        if ($easiness < 1.3) {
            $easiness = 1.3;
        }

        if ($easiness > 3.9) {
            $easiness = 3.9;
        }

        return [$repetition, $easiness, $interval];
    }
}