<?php

use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\OrganizationDeckController;
use App\Http\Controllers\OrganizationUserController;
use App\Http\Middleware\EnsureIsOrganizationMember;
use App\Http\Middleware\EnsureIsOrganizationOwner;
use App\Http\Middleware\EnsureOrganizationExist;
use App\Http\Middleware\EnsureUserIsPremium;
use App\Http\Middleware\VerifyUserIsPremium;
use Illuminate\Support\Facades\Route;
use App\Enums\TokenAbility;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QcmController;
use App\Http\Controllers\QuizController;

// Deck routes
Route::get("decks", [DeckController::class, "getDecksByPage"]);
Route::get("decks/{id}", [DeckController::class, "getDeckById"]);

Route::middleware(['auth:sanctum', 'abilities:' . TokenAbility::ACCESS_API->value])->group(function () {
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
    Route::get('user/organizations', [UserController::class, 'showOrganizations']);
    Route::put('user', [UserController::class, 'update']);
    Route::delete('user', [UserController::class, 'destroy']);

    // Stripe routes
    Route::post('stripe/checkout', [StripeController::class, 'subcriptionCheckout']);
    Route::post('stripe/cancel', [StripeController::class, 'cancel']);
    Route::post('stripe/resume', [StripeController::class, 'resume']);

    // Organization routes
    Route::get('organizations/{id}', [OrganizationController::class, 'show']);
    Route::middleware([EnsureOrganizationExist::class])->group(function () {
        Route::middleware([EnsureIsOrganizationMember::class])->group(function () {
            Route::get('organizations/{id}/users', [OrganizationUserController::class, 'show']);
            Route::get('organizations/{id}/decks', [OrganizationDeckController::class, 'index']);
            Route::get('organizations/{id}/decks/{deckId}', [OrganizationDeckController::class, 'show']);
        });
        Route::middleware([EnsureUserIsPremium::class])->group(function () {
            Route::post('organizations', [OrganizationController::class, 'store'])->withoutMiddleware(EnsureOrganizationExist::class);
            Route::middleware([EnsureIsOrganizationOwner::class])->group(function () {
                Route::put('organizations/{id}', [OrganizationController::class, 'update']);
                Route::delete('organizations/{id}', [OrganizationController::class, 'destroy']);
                Route::post('organizations/{id}/users', [OrganizationUserController::class, 'store']);
                Route::delete('organizations/{id}/users/{userId}', [OrganizationUserController::class, 'destroy']);
                Route::post('organizations/{id}/decks', [OrganizationDeckController::class, 'store']);
                Route::put('organizations/{id}/decks/{deckId}', [OrganizationDeckController::class, 'update']);
                Route::delete('organizations/{id}/decks/{deckId}', [OrganizationDeckController::class, 'destroy']);
            });
        });
    });

    // Quiz routes
    Route::post('/quizzes', [QuizController::class, 'store']);
    Route::get('/quizzes', [QuizController::class, 'myQuizzes']);
    Route::put('/quizzes/{id}', [QuizController::class, 'update']);
    Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);
});

// Qcm routes
Route::get('/qcms/{id}', [QcmController::class, 'show']);
Route::post('/quizzes/{id}/qcms', [QcmController::class, 'store']);
Route::put('/qcms/{id}', [QcmController::class, 'update']);
Route::delete('/qcms/{id}', [QcmController::class, 'destroy']);

// Quiz routes
Route::get('/quizzes/{id}', [QuizController::class, 'show']);

