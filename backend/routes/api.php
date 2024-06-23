<?php

use App\Http\Controllers\DeckController;
use App\Http\Controllers\FlashcardController;
use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "api", "namespace" => "App\Http\Controllers"], function () {
    Route::apiResource("decks", DeckController::class);
    Route::apiResource("flashcards", FlashcardController::class);
});
