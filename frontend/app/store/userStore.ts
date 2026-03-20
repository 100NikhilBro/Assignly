import { create } from "zustand";

type User = {
  id: string;
  email: string;
  name?: string;
  credits: number;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  updateCredits: (credits: number) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  updateCredits: (credits) =>
    set((state) => ({
      user: state.user ? { ...state.user, credits } : null,
    })),

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));