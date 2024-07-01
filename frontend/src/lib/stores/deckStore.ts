import { create } from "zustand";
import type { Flashcard } from "../../types/deck.type";

type DeckState = {
  deck: Flashcard[];
  saveFlashcard: (flashcard: Flashcard) => void;
  removeFlashcard: (id: number) => void;
  resetDeck: () => void;
};

const useDeckStore = create<DeckState>((set) => ({
  // Array of flashcards
  deck: [],
  //Function to save the flashcard in the deck
  saveFlashcard: (flashcard: Flashcard) =>
    set((state) => {
      const existingDeckIndex = state.deck.findIndex(
        (item) => item.id === flashcard.id
      );
      if (existingDeckIndex > -1) {
        const updateddeck = [...state.deck];
        updateddeck[existingDeckIndex] = flashcard;
        return { deck: updateddeck };
      } else {
        return { deck: [...state.deck, flashcard] };
      }
    }),
  //Function to remove the flashcard from the deck
  removeFlashcard: (id) =>
    set((state) => ({
      deck: state.deck.filter((deck) => deck.id !== id),
    })),
  //Function to reset the deck
  resetDeck: () => set({ deck: [] }),
}));

export default useDeckStore;
