export interface CurrentUser {
  isGuest: boolean;
  name: string;
  bio: string;
  avatarUrl: string | null;
  currentStreakDays: number;
  currentBeans: number;
}

export interface CurrentUserStoreState {
  currentUser: CurrentUser;
  setCurrentUser: (currentUser: CurrentUser) => void;
  updateCurrentUser: (currentUser: Partial<CurrentUser>) => void;
  resetCurrentUser: () => void;
}
