import { create } from "zustand";
import { persist } from "zustand/middleware";



interface AuthState {
  token: string | null;
  role: string | null;
  firstName: string | null;
  setAuth: (token: string, role: string, firstName: string) => void;
  logout: () => void;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      firstName: null,
      setAuth: (token, role, firstName) => set({ token, role, firstName }),
      logout: () => set({ token: null, role: null, firstName: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);