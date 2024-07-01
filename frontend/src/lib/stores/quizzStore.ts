import { create } from "zustand";
import type { QCM } from "../../types/quizz.type";

type QCMState = {
  qcms: QCM[];
  saveQCM: (qcm: QCM) => void;
  removeQCM: (id: number) => void;
  resetQCMs: () => void;
};

const useQCMStore = create<QCMState>((set) => ({
  // Array of QCMs
  qcms: [],
  //Function to save the QCM in the store
  saveQCM: (qcm: QCM) =>
    set((state) => {
      const existingQCMIndex = state.qcms.findIndex(
        (item) => item.id === qcm.id
      );
      if (existingQCMIndex > -1) {
        const updatedQCMs = [...state.qcms];
        updatedQCMs[existingQCMIndex] = qcm;
        return { qcms: updatedQCMs };
      } else {
        return { qcms: [...state.qcms, qcm] };
      }
    }),
  //Function to remove the QCM from the store
  removeQCM: (id) =>
    set((state) => ({ qcms: state.qcms.filter((qcm) => qcm.id !== id) })),
  //Function to reset the QCMs
  resetQCMs: () => set({ qcms: [] }),
}));

export default useQCMStore;
