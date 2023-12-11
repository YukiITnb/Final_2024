import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useProgressStore = create(
  persist(
    (set) => ({
      progress: 0,
      increaseProgress: () =>
        set((state) => ({ progress: state.progress < 100 ? state.progress + 10 : state.progress })),
      resetProgress: () => set({ progress: 0 }),
      setProgress: (newProgress) => set({ progress: newProgress }),
    }),
    {
      name: 'progress-app',
      getStorage: () => createJSONStorage(() => AsyncStorage),
    }
  )
);
