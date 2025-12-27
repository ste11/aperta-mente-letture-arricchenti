import { create } from 'zustand';

interface AuthState {
  isOwnerLoggedIn: boolean;
  ownerEmail: string | null;
  isLocked: boolean;
  lockTimeRemaining: number;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  checkLockStatus: () => void;
}

// Owner credentials (in production, this should be handled securely on the backend)
const OWNER_EMAIL = 'stefano.ricci11@gmail.com';
const OWNER_PASSWORD = 'Library2025top!';

// Brute force protection constants
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const ATTEMPT_RESET_TIME = 15 * 60 * 1000; // Reset attempts after 15 minutes

interface LoginAttempt {
  count: number;
  firstAttemptTime: number;
  lockedUntil?: number;
}

const getLoginAttempts = (): LoginAttempt => {
  if (typeof window === 'undefined') {
    return { count: 0, firstAttemptTime: Date.now() };
  }
  const stored = localStorage.getItem('loginAttempts');
  if (!stored) {
    return { count: 0, firstAttemptTime: Date.now() };
  }
  return JSON.parse(stored);
};

const setLoginAttempts = (attempts: LoginAttempt) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('loginAttempts', JSON.stringify(attempts));
  }
};

const clearLoginAttempts = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('loginAttempts');
  }
};

const isAccountLocked = (): boolean => {
  const attempts = getLoginAttempts();
  if (!attempts.lockedUntil) return false;
  
  const now = Date.now();
  if (now < attempts.lockedUntil) {
    return true;
  }
  
  // Unlock has expired, clear attempts
  clearLoginAttempts();
  return false;
};

const getRemainingLockTime = (): number => {
  const attempts = getLoginAttempts();
  if (!attempts.lockedUntil) return 0;
  
  const remaining = Math.max(0, attempts.lockedUntil - Date.now());
  return remaining;
};

const recordFailedAttempt = () => {
  const attempts = getLoginAttempts();
  const now = Date.now();
  
  // Reset attempts if enough time has passed
  if (now - attempts.firstAttemptTime > ATTEMPT_RESET_TIME) {
    attempts.count = 1;
    attempts.firstAttemptTime = now;
  } else {
    attempts.count++;
  }
  
  // Lock account if max attempts exceeded
  if (attempts.count >= MAX_ATTEMPTS) {
    attempts.lockedUntil = now + LOCKOUT_DURATION;
  }
  
  setLoginAttempts(attempts);
};

const clearFailedAttempts = () => {
  clearLoginAttempts();
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isOwnerLoggedIn: false,
  ownerEmail: null,
  isLocked: false,
  lockTimeRemaining: 0,
  login: (email: string, password: string) => {
    // Check if account is locked
    if (isAccountLocked()) {
      const remaining = getRemainingLockTime();
      const minutes = Math.ceil(remaining / 60000);
      set({ isLocked: true, lockTimeRemaining: remaining });
      return {
        success: false,
        error: `Account temporaneamente bloccato. Riprova tra ${minutes} minuto${minutes > 1 ? 'i' : ''}.`,
      };
    }
    
    // Check credentials
    if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
      set({ isOwnerLoggedIn: true, ownerEmail: email, isLocked: false, lockTimeRemaining: 0 });
      localStorage.setItem('ownerLoggedIn', 'true');
      localStorage.setItem('ownerEmail', email);
      clearFailedAttempts();
      return { success: true };
    }
    
    // Record failed attempt
    recordFailedAttempt();
    const attempts = getLoginAttempts();
    const remainingAttempts = MAX_ATTEMPTS - attempts.count;
    
    if (remainingAttempts <= 0) {
      const remaining = getRemainingLockTime();
      set({ isLocked: true, lockTimeRemaining: remaining });
      return {
        success: false,
        error: `Troppi tentativi falliti. Account bloccato per 15 minuti.`,
      };
    }
    
    return {
      success: false,
      error: `Email o password non corretti. Tentativi rimanenti: ${remainingAttempts}`,
    };
  },
  logout: () => {
    set({ isOwnerLoggedIn: false, ownerEmail: null });
    localStorage.removeItem('ownerLoggedIn');
    localStorage.removeItem('ownerEmail');
  },
  checkLockStatus: () => {
    if (isAccountLocked()) {
      const remaining = getRemainingLockTime();
      set({ isLocked: true, lockTimeRemaining: remaining });
    } else {
      set({ isLocked: false, lockTimeRemaining: 0 });
    }
  },
}));

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const isLoggedIn = localStorage.getItem('ownerLoggedIn') === 'true';
  const email = localStorage.getItem('ownerEmail');
  if (isLoggedIn && email) {
    useAuthStore.setState({ isOwnerLoggedIn: true, ownerEmail: email });
  }
  
  // Check initial lock status
  useAuthStore.getState().checkLockStatus();
}
