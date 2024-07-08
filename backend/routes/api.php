<?php

use App\Enums\TokenAbility;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\QcmController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserDeckController;
use App\Http\Controllers\UserQuizController;
use Illuminate\Support\Facades\Route;



// Qcm routes
Route::get('/qcms/{id}', [QcmController::class, 'show']);
Route::post('/quizzes/{id}/qcms', [QcmController::class, 'store']);
Route::put('/qcms/{id}', [QcmController::class, 'update']);
Route::delete('/qcms/{id}', [QcmController::class, 'destroy']);

// Tag routes
Route::get('tags', [TagController::class, 'getAllTags']);
Route::post('tags', [TagController::class, 'createTag']);
Route::put('tags/{id}', [TagController::class, 'updateTagById']);
Route::delete('tags/{id}', [TagController::class, 'deleteTagById']);

// Auth routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('refresh', [AuthController::class, 'refreshToken'])->middleware(['auth:sanctum', 'abilities:' . TokenAbility::ISSUE_ACCESS_TOKEN->value]);
Route::post('logout', [AuthController::class, 'logout'])->middleware(['auth:sanctum', 'abilities:' . TokenAbility::ACCESS_API->value]);

Route::middleware(['auth:sanctum', 'abilities:' . TokenAbility::ACCESS_API->value])->group(function () {
  // User routes
  Route::get('user', [UserController::class, 'show']);
  Route::put('user', [UserController::class, 'update']);
  Route::delete('user', [UserController::class, 'destroy']);

  // Stripe routes
  Route::post('stripe/checkout', [StripeController::class, 'subcriptionCheckout']);
  Route::post('stripe/cancel', [StripeController::class, 'cancel']);
  Route::post('stripe/resume', [StripeController::class, 'resume']);

  // Deck routes
  Route::post('decks', [DeckController::class, "createDeck"]);
  Route::get('/decks/likes', [UserDeckController::class, 'getLikedDecks']);
  Route::put('decks/{id}', [DeckController::class, "updateDeckById"]);
  Route::delete('decks/{id}', [DeckController::class, "deleteDeckById"]);
  Route::put('decks/{id}/like', [UserDeckController::class, 'likeOrDislikeDeckById']);
  Route::put('decks/{id}/grade', [UserDeckController::class, 'saveGradeDeckById']);

  // Quiz routes
  Route::post('/quizzes', [QuizController::class, 'store']);
  Route::get('/quizzes', [QuizController::class, 'myQuizzes']);
  Route::get('/quizzes/likes', [UserQuizController::class, 'getLikedQuizzes']);
  Route::put('/quizzes/{id}', [QuizController::class, 'update']);
  Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);
  Route::put('quizzes/{id}/like', [UserQuizController::class, 'likeOrDislikeQuizById']);
  Route::put('quizzes/{id}/grade', [UserQuizController::class, 'saveGradeQuizById']);
});

// Quiz routes
Route::get('/quizzes/{id}', [QuizController::class, 'show']);

// Deck Get routes
Route::get('decks', [DeckController::class, 'getDecksByPage']);
Route::get('decks/{id}', [DeckController::class, 'getDeckById']);