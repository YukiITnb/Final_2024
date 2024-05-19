import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useProgressStore = create(
  persist(
    (set) => ({
      progress: 0,
      color: "",
      refresh: false,
      today: "",
      user: {
        uid: "",
        userName: "",
        avatar: "",
        groups: [],
      },
      setUser: (user) => set({ user }),
      setToday: (today) => set({ today }),
      setRefresh: (refresh) => set({ refresh }),
      setColor: (color) => set({ color }),
      increaseProgress: () =>
        set((state) => ({
          progress: state.progress < 100 ? state.progress + 10 : state.progress,
        })),
      resetProgress: () => set({ progress: 0 }),
      setProgress: (newProgress) => set({ progress: newProgress }),
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      uid: "",
      setUid: (uid) => set({ uid }),
    }),
    {
      name: "progress-app",
      getStorage: () => createJSONStorage(() => AsyncStorage),
    }
  )
);
