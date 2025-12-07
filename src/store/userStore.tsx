import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  email: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  saveInfo: (data: { accessToken: string; user: User }) => void;
  getInfo: () => { accessToken: string | null; user: User | null };
  logout: () => void;
}

export const useUserStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      saveInfo: ({ accessToken, user }) => {
        set({
          accessToken,
          user,
          isAuthenticated: true,
        });
      },

      getInfo: () => {
        const { accessToken, user } = get();
        return { accessToken, user };
      },

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
