import { create } from 'zustand';

interface AuthState {
  isOwnerLoggedIn: boolean;
  ownerEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Owner credentials (in production, this should be handled securely on the backend)
const OWNER_EMAIL = 'owner@library.com';
const OWNER_PASSWORD = 'LibraryOwner2025!';

export const useAuthStore = create<AuthState>((set) => ({
  isOwnerLoggedIn: false,
  ownerEmail: null,
  login: (email: string, password: string) => {
    if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
      set({ isOwnerLoggedIn: true, ownerEmail: email });
      localStorage.setItem('ownerLoggedIn', 'true');
      localStorage.setItem('ownerEmail', email);
      return true;
    }
    return false;
  },
  logout: () => {
    set({ isOwnerLoggedIn: false, ownerEmail: null });
    localStorage.removeItem('ownerLoggedIn');
    localStorage.removeItem('ownerEmail');
  },
}));

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const isLoggedIn = localStorage.getItem('ownerLoggedIn') === 'true';
  const email = localStorage.getItem('ownerEmail');
  if (isLoggedIn && email) {
    useAuthStore.setState({ isOwnerLoggedIn: true, ownerEmail: email });
  }
}
