import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole, User } from "../../types/user";

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  role: UserRole | null;
  login: (payload: { token: string; user: User }) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      role: null,
      login: ({ token, user }) =>
        set({ isAuthenticated: true, token, user, role: user.role }),
      logout: () => set({ isAuthenticated: false, token: null, user: null, role: null }),
      setRole: (role) => set({ role }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
        role: state.role 
      }),
    }
  )
);


