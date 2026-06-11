import { create } from "zustand";

import type { CurrentUser, CurrentUserStoreState } from "./types";

export const GUEST_CURRENT_USER: CurrentUser = {
  authRole: "guest",
  isGuest: true,
  name: "Guest",
  bio: "",
  avatarUrl: null,
  currentStreakDays: 0,
  currentBeans: 0,
};

export const ANONYMOUS_CURRENT_USER: CurrentUser = {
  ...GUEST_CURRENT_USER,
  authRole: "anonymous",
  isGuest: false,
  name: "익명 꼬깃러",
};

export const useCurrentUserStore = create<CurrentUserStoreState>((set) => ({
  currentUser: ANONYMOUS_CURRENT_USER,

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
    set({ currentUser: ANONYMOUS_CURRENT_USER });
  },
}));
