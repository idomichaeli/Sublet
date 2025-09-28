import { create } from "zustand";
import { UserRole } from "../../types/user";

interface AuthStore {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email, password) => {
    // Mock login - replace with actual API call
    set({
      isAuthenticated: true,
      user: {
        id: "1",
        email,
        name: "Test User",
        role: "RENTER" as UserRole,
      },
    });
  },
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    });
  },
  register: async (email, password, name, role) => {
    // Mock registration - replace with actual API call
    set({
      isAuthenticated: true,
      user: {
        id: "1",
        email,
        name,
        role,
      },
    });
  },
}));
