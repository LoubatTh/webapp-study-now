<?php

namespace App\Http\Controllers;

use App\Models\Deck;
use App\Models\Quiz;
use App\Models\Tag;
use App\Models\User;
use App\Models\UserDeck;
use App\Models\UserQuiz;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class AllItemsController extends Controller
{
    /**
     * Display a listing of two resources by page.
     */
    public function getDecksAndQuizzesByPage(Request $request)
    {
        try {
            $numberPerPage = 18;
            $private = $request->has("me");
            $isSearchName = $request->has("name");
            $isSearchTag = $request->has("tag");
            $isSearchOwner = $request->has("owner");
            $isSearchType = $request->has("type");
            $isSearchPublic = $request->has("isPublic");
            $isSearchLiked = $request->has("isLiked");

            $decks = Deck::with("tag", "user", "flashcards");
            $quizzes = Quiz::with("tag", "user", "qcms");

            $user = Auth::guard("sanctum")->user();

            if ($private) {
                if (!$user) {
                    return response()->json(["message" => "Unauthorized"], 401);
                }

                $decks = $decks->where(function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->orWhereIn('id', $user->likedDecks()->pluck('decks.id'));
                });
                $quizzes = $quizzes->where(function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->orWhereIn('id', $user->likedQuizzes()->pluck('quizzes.id'));
                });
                \Log::info("Test1: ", ["decks", $decks->count()]);
            } else {
                $decks = $decks->where("is_public", true);
                $quizzes = $quizzes->where("is_public", true);
            }

            if ($isSearchName) {
                $search = $request->input("name");
                $searchTerm = "%{$search}%";

                $decks = $decks->where("name", "ILIKE", $searchTerm);
                $quizzes = $quizzes->where("name", "ILIKE", $searchTerm);
            }

            if ($isSearchPublic) {
                $search = $request->input("isPublic");

                $decks = $decks->where("is_public", $search);
                $quizzes = $quizzes->where("is_public", $search);
            }

            if ($isSearchTag) {
                $search = $request->input("tag");
                $searchTerm = "%{$search}%";

                $tags = Tag::where("name", "ILIKE", $searchTerm);
                if ($tags->count() > 0) {
                    $tag_ids = $tags->pluck("id");

                    $decks = $decks->where("tag_id", $tag_ids);
                    $quizzes = $quizzes->where("tag_id", $tag_ids);
                    \Log::info("Test1: ", ["decks", $decks->count()]);
                } else {
                    $decks = $decks->where("tag_id", 0);
                    $quizzes = $quizzes->where("tag_id", 0);
                }
            }

            if ($isSearchOwner) {
                $search = $request->input("owner");
                $searchTerm = "%{$search}%";

                $users = User::where("name", "ILIKE", $searchTerm);
                if ($users->count() > 0) {
                    $user_ids = $users->pluck("id");

                    $decks = $decks->where("user_id", $user_ids);
                    $quizzes = $quizzes->where("user_id", $user_ids);
                } else {
                    $decks = $decks->where("user_id", 0);
                    $quizzes = $quizzes->where("user_id", 0);
                }
            }

            if ($isSearchType) {
                $search = $request->input("type");

                if ($search == "Deck") {
                    $quizzes = $quizzes->where("id", 0);
                } else {
                    $decks = $decks->where("id", 0);
                }
            }

            $decks = $decks->get();
            $quizzes = $quizzes->get();

            foreach ($decks as $deck) {
                if (!$user) {
                    $deck->setAttribute("is_liked", false);
                } else {
                    $userDeck = UserDeck::where(["user_id" => $user->id, "deck_id" => $deck->id])->first();
                    $deck->setAttribute("is_liked", $userDeck ? $userDeck->is_liked : false);
                }
            }

            foreach ($quizzes as $quiz) {
                if (!$user) {
                    $quiz->setAttribute("is_liked", false);
                } else {
                    $userQuiz = UserQuiz::where(["user_id" => $user->id, "quiz_id" => $quiz->id])->first();
                    $quiz->setAttribute("is_liked", $userQuiz ? $userQuiz->is_liked : false);
                }
            }

            if ($isSearchLiked) {
                $search = $request->input("isLiked");

                $decks = $decks->where("is_liked", $search);
                $quizzes = $quizzes->where("is_liked", $search);
            }

            $all = $decks->merge($quizzes);
            $all = $all->shuffle();

            $totalItems = $all->count();
            $currentPage = $request->has("page") ? intval($request->input("page")) : 1;
            $prevPage = $currentPage - 1;
            $nextPage = $currentPage + 1;
            $lastPage = ceil($totalItems / $numberPerPage) > 0 ? ceil($totalItems / $numberPerPage) : 1;

            $firstElement = ($currentPage - 1) * $numberPerPage + 1;

            $dataPaged = $all->slice($firstElement - 1, $numberPerPage)->values();

            $data = $dataPaged->map(function ($item) {
                $mappedItem = [
                    "id" => $item->id,
                    "name" => $item->name,
                    "is_public" => $item->is_public,
                    "likes" => $item->likes,
                    "type" => $item->type,
                    "tag" => $item->tag->name,
                    "owner" => $item->user->name,
                    "is_liked" => $item->getAttribute("is_liked"),
                ];

                if ($item->relationLoaded("flashcards")) {
                    $mappedItem["flashcards"] = $item->flashcards->map(function ($flashcard) {
                        return [
                            "id" => $flashcard->id,
                            "question" => $flashcard->question,
                            "answer" => $flashcard->answer,
                        ];
                    });
                }

                if ($item->relationLoaded("qcms")) {
                    $mappedItem["qcms"] = $item->qcms->map(function ($qcm) {
                        return [
                            "id" => $qcm->id,
                            "question" => $qcm->question,
                            "answers" => $qcm->answers,
                        ];
                    });
                }

                return $mappedItem;
            });

            $response = [
                "data" => $data,
                "links" => [
                    "first" => "http://localhost:8000/api/all?page=1",
                    "last" => "http://localhost:8000/api/all?page={$lastPage}",
                    "prev" => $currentPage != 1 ? "http://localhost:8000/api/all?page={$prevPage}" : null,
                    "next" => $currentPage < $lastPage ? "http://localhost:8000/api/all?page={$nextPage}" : null,
                ],
                "meta" => [
                    "current_page" => $currentPage,
                    "from" => $totalItems == 0 ? null : $firstElement,
                    "last_page" => $lastPage,
                    "path" => "http://localhost:8000/api/all",
                    "per_page" => $numberPerPage,
                    "to" => $totalItems == 0 ? null : ($firstElement + $numberPerPage - 1 > $totalItems ? $totalItems : $firstElement + $numberPerPage - 1),
                    "total" => $totalItems,
                ],
            ];

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }
}