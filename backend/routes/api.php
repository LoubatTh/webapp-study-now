<?php

use Illuminate\Support\Facades\Route;
use App\Enums\TokenAbility;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\QcmController;
use App\Http\Controllers\QuizController;

Route::group(["namespace" => "App\Http\Controllers"], function () {
    Route::get("decks", [DeckController::class, "getDecksByUser"]);
    Route::get("decks/{id}", [DeckController::class, "getDeckById"]);
    Route::post("decks", [DeckController::class, "createDeck"]);
    Route::put("decks/{id}", [DeckController::class, "updateDeckById"]);
    Route::delete("decks/{id}", [DeckController::class, "deleteDeckById"]);
});


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
});

// Qcm routes
Route::get('/qcms/{id}', [QcmController::class, 'show']);
Route::post('/quizzes/{id}/qcms', [QcmController::class, 'store']);
Route::put('/qcms/{id}', [QcmController::class, 'update']);
Route::delete('/qcms/{id}', [QcmController::class, 'destroy']);

// Quiz routes
Route::post('/quizzes', [QuizController::class, 'store']);

Route::get('/quizzes/{id}', [QuizController::class, 'show']);
