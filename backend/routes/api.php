<?php

use App\Http\Controllers\DeckController;
use App\Http\Controllers\FlashcardController;
use Illuminate\Support\Facades\Route;

Route::group(["namespace" => "App\Http\Controllers"], function () {
    Route::get("decks", [DeckController::class, "getDecksByUser"]);
    Route::get("decks/{id}", [DeckController::class, "getDeckById"]);
    Route::post("decks", [DeckController::class, "createDeck"]);
    Route::put("decks/{id}", [DeckController::class, "updateDeckById"]);
    Route::delete("decks/{id}", [DeckController::class, "deleteDeckById"]);
});
