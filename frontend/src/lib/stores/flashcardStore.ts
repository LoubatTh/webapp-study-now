import { create } from "zustand";

type FlashcardRating = {
  flashcardId: number;
  rating: number;
};

type FlashcardStore = {
  ratings: FlashcardRating[];
  addRating: (flashcardId: number, rating: number) => void;
  getAverageRating: () => number | null;
  resetRatings: () => void;
};

const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  ratings: [],
  addRating: (flashcardId: number, rating: number) => {
    set((state) => {
      const existingRating = state.ratings.find(
        (r) => r.flashcardId === flashcardId
      );
      if (existingRating) {
        return {
          ratings: state.ratings.map((r) =>
            r.flashcardId === flashcardId ? { ...r, rating } : r
          ),
        };
      }
      return { ratings: [...state.ratings, { flashcardId, rating }] };
    });
  },
  getAverageRating: () => {
    const { ratings } = get();
    const total = ratings.reduce((acc, { rating }) => acc + rating, 0);
    return total / ratings.length;
  },
  resetRatings: () => {
    set({ ratings: [] });
  },
}));

export default useFlashcardStore;
