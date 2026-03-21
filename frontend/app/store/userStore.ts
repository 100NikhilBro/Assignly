import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  email: string;
  name?: string;
  credits: number;
  role?: "user" | "guest";
};

type UserStore = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoggedIn: boolean;  // ✅ ADD THIS - for quick login status check
  
  // Actions
  setUser: (user: User, token: string) => void;
  updateCredits: (credits: number) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isLoggedIn: false,  // ✅ ADD THIS - initial state

      setUser: (user, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));  // ✅ Store user too
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isLoggedIn: true,  // ✅ ADD THIS - set to true on login
          isLoading: false 
        });
      },

      updateCredits: (credits) =>
        set((state) => ({
          user: state.user ? { ...state.user, credits } : null,
        })),

      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoggedIn: false,  // ✅ ADD THIS - set to false on logout
          isLoading: false 
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoggedIn: state.isLoggedIn,  // ✅ ADD THIS - persist login status
      }),
    }
  )
);