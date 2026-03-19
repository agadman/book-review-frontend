import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/auth";

// Typdefinition för auth state
interface AuthState {
  user: User | null; // Inloggad användare (null om ej inloggad)
  token: string | null; // JWT-token för autentisering
  setUser: (user: User, token: string) => void; // Sätter user + token vid login
  logout: () => void;
}

// Skapar zustand store 
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      // Sparar användare och token i state
      setUser: (user, token) => set({ user, token }),

      // Uppdaterar state och tömmer localStorage
      logout: () => set({ user: null, token: null }), 
    }),
    {
      name: "auth-storage", // Nyckel i localStorage
      storage: createJSONStorage(() => localStorage), // Använder localStorage
    }
  )
);