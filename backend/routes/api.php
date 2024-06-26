<?php

use App\Enums\TokenAbility;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QcmController;
use Illuminate\Support\Facades\Route;

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
  Route::put('user', [UserController::class, 'update']);
  Route::delete('user', [UserController::class, 'destroy']);
});

// Qcm routes

Route::post('/qcms', [QcmController::class, 'store']);
Route::get('/qcms/{id}', [QcmController::class, 'show']);
Route::put('/qcms/{id}', [QcmController::class, 'update']);
Route::delete('/qcms/{id}', [QcmController::class, 'destroy']);