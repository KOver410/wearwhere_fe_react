import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '@/types/user';
import {
  loginWithGoogle as googleLogin,
  loginWithEmail as emailLogin,
  registerWithEmail as emailRegister,
  logout as authLogout,
  restoreSession,
} from '@/services/auth';
import { userService } from '@/services/user';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  loginWithGoogle: () => Promise<User>;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  registerWithEmail: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  showLoginPrompt: boolean;
  promptLogin: (redirectPath?: string) => void;
  dismissPrompt: () => void;
  pendingRedirect: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const isLoggedIn = !!user;

  // Load full profile after auth login
  const loadProfile = useCallback(async (): Promise<User> => {
    const profile = await userService.getProfile();
    setUser(profile);
    return profile;
  }, []);

  // Restore session on mount
  useEffect(() => {
    restoreSession()
      .then(async (result) => {
        if (result) {
          try {
            await loadProfile();
          } catch {
            setUser(null);
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [loadProfile]);

  const loginWithGoogleFn = useCallback(async (): Promise<User> => {
    await googleLogin();
    const profile = await loadProfile();
    setShowLoginPrompt(false);
    setPendingRedirect(null);
    return profile;
  }, [loadProfile]);

  const loginWithEmailFn = useCallback(async (email: string, password: string): Promise<User> => {
    await emailLogin(email, password);
    const profile = await loadProfile();
    setShowLoginPrompt(false);
    setPendingRedirect(null);
    return profile;
  }, [loadProfile]);

  const registerWithEmailFn = useCallback(async (email: string, password: string): Promise<User> => {
    await emailRegister(email, password);
    const profile = await loadProfile();
    setShowLoginPrompt(false);
    setPendingRedirect(null);
    return profile;
  }, [loadProfile]);

  const logoutFn = useCallback(async () => {
    await authLogout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      await loadProfile();
    } catch {
      setUser(null);
    }
  }, [loadProfile]);

  const promptLogin = useCallback((redirectPath?: string) => {
    setPendingRedirect(redirectPath || null);
    setShowLoginPrompt(true);
  }, []);

  const dismissPrompt = useCallback(() => {
    setShowLoginPrompt(false);
    setPendingRedirect(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        loginWithGoogle: loginWithGoogleFn,
        loginWithEmail: loginWithEmailFn,
        registerWithEmail: registerWithEmailFn,
        logout: logoutFn,
        refreshUser,
        showLoginPrompt,
        promptLogin,
        dismissPrompt,
        pendingRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      isLoggedIn: false,
      isLoading: true,
      user: null,
      loginWithGoogle: async () => { throw new Error('AuthProvider not found'); },
      loginWithEmail: async () => { throw new Error('AuthProvider not found'); },
      registerWithEmail: async () => { throw new Error('AuthProvider not found'); },
      logout: async () => {},
      refreshUser: async () => {},
      showLoginPrompt: false,
      promptLogin: () => {},
      dismissPrompt: () => {},
      pendingRedirect: null,
    } as AuthContextType;
  }
  return ctx;
}
