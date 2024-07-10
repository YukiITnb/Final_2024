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
        points: 0,
      },
      habits: [],
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
      setHabits: (habits) => set({ habits }),
      addHabit: (habit) =>
        set((state) => ({ habits: [...state.habits, habit] })),
      removeHabit: (habitId) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.habit_id !== habitId),
        })),
      updateHabit: (updatedHabit) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.habit_id === updatedHabit.habit_id ? updatedHabit : habit
          ),
        })),
      refreshGroup: false,
      setRefreshGroup: (refreshGroup) => set({ refreshGroup }),
      refreshpost: false,
      setRefreshPost: (refreshPost) => set({ refreshPost }),
      oldPassword: "",
      setOldPassword: (oldPassword) => set({ oldPassword }),
    }),
    {
      name: "progress-app",
      getStorage: () => createJSONStorage(() => AsyncStorage),
    }
  )
);
