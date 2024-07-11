<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use Illuminate\Routing\Controller;

class FlashcardController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function createFlashcard(array $flashcard, int $deckId)
    {
        Flashcard::create([
            "question" => $flashcard["question"],
            "answer" => $flashcard["answer"],
            "deck_id" => $deckId,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function deleteFlashcardsByDeck(int $deckId)
    {
        try {
            $flashcards = Flashcard::where("deck_id", $deckId)->get();

            foreach ($flashcards as $flashcard) {
                $flashcard->delete();
            }

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
