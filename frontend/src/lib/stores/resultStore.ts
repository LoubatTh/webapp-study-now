import { create } from "zustand";

type StoreState = {
  score: number | null;
  maxScore: number | null;
  setScore: (newScore: number | void) => void;
  setMaxScore: (newMaxScore: number | void) => void;
};

const useStore = create<StoreState>((set) => ({
  score: null,
  maxScore: null,
  setScore: (newScore) => {
    if (newScore !== undefined) {
      set({ score: Math.round(newScore * 100) / 100 });
    }
  },
  setMaxScore: (newMaxScore) => {
    if (newMaxScore !== undefined) {
      set({ maxScore: Math.round(newMaxScore * 100) / 100 });
    }
  },
}));

export default useStore;
