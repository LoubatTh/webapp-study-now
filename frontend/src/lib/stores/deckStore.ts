import { create } from "zustand";
import type { Deck } from "../../types/deck.type";

type DeckState = {
  decks: Deck[];
  saveDeck: (deck: Deck) => void;
  removeDeck: (id: number) => void;
  resetDecks: () => void;
};

const useDeckStore = create<DeckState>((set) => ({
  // Array of Decks
  decks: [],
  //Function to save the Deck in the store
  saveDeck: (deck: Deck) =>
    set((state) => {
      const existingDeckIndex = state.decks.findIndex(
        (item) => item.id === deck.id
      );
      if (existingDeckIndex > -1) {
        const updatedDecks = [...state.decks];
        updatedDecks[existingDeckIndex] = deck;
        return { decks: updatedDecks };
      } else {
        return { decks: [...state.decks, deck] };
      }
    }),
  //Function to remove the Deck from the store
  removeDeck: (id) =>
    set((state) => ({ decks: state.decks.filter((deck) => deck.id !== id) })),
  //Function to reset the Decks
  resetDecks: () => set({ decks: [] }),
}));

export default useDeckStore;
