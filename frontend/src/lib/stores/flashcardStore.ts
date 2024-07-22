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
  allFlashcardsGraded: (totalFlashcards: number) => boolean;
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
    if (ratings.length === 0) return null;
    const total = ratings.reduce((acc, { rating }) => acc + rating, 0);
    return parseFloat((total / ratings.length).toFixed(2));
  },
  resetRatings: () => {
    set({ ratings: [] });
  },
  allFlashcardsGraded: (totalFlashcards: number) => {
    const { ratings } = get();
    return (
      ratings.length === totalFlashcards && ratings.every((r) => r.rating > 0)
    );
  },
}));

export default useFlashcardStore;
