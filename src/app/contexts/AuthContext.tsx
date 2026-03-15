import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  showLoginPrompt: boolean;
  promptLogin: (redirectPath?: string) => void;
  dismissPrompt: () => void;
  pendingRedirect: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    setShowLoginPrompt(false);
    setPendingRedirect(null);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const promptLogin = useCallback((redirectPath?: string) => {
    setPendingRedirect(redirectPath || null);
    setShowLoginPrompt(true);
  }, []);

  const dismissPrompt = useCallback(() => {
    setShowLoginPrompt(false);
    setPendingRedirect(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, showLoginPrompt, promptLogin, dismissPrompt, pendingRedirect }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      isLoggedIn: false,
      login: () => {},
      logout: () => {},
      showLoginPrompt: false,
      promptLogin: () => {},
      dismissPrompt: () => {},
      pendingRedirect: null,
    };
  }
  return ctx;
}
