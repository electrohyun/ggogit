import { create } from "zustand";
import type { CurrentUser, CurrentUserStoreState } from "./types";

export const GUEST_CURRENT_USER: CurrentUser = {
  isGuest: true,
  name: "Guest",
  bio: "",
  avatarUrl: null,
  currentStreakDays: 0,
  currentBeans: 0,
};

export const useCurrentUserStore = create<CurrentUserStoreState>((set) => ({
  currentUser: GUEST_CURRENT_USER,

  setCurrentUser: (currentUser) => {
    set({ currentUser });
  },

  updateCurrentUser: (currentUser) => {
    set((state) => ({
      currentUser: {
        ...state.currentUser,
        ...currentUser,
      },
    }));
  },

  resetCurrentUser: () => {
    set({ currentUser: GUEST_CURRENT_USER });
  },
}));
