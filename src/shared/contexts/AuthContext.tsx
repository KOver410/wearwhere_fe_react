import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ApiError, isAuthTokens } from '@/shared/api/contracts';
import { setUnauthorizedHandler } from '@/shared/api/apiClient';
import { clearTokens, readTokenSnapshot, saveTokens, type TokenSnapshot } from '@/shared/api/tokenStorage';
import { getMe, loginCustomer, logoutCustomer, registerCustomer } from '@/features/auth/api/authApi';
import type { AuthUser, LoginCustomerInput, RegisterCustomerInput } from '@/features/auth/api/contracts';

interface AuthContextType {
  user: AuthUser | null;
  role: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (input: LoginCustomerInput, rememberMe: boolean) => Promise<AuthUser>;
  register: (input: RegisterCustomerInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  applyUser: (user: AuthUser) => void;
  restoreSession: () => Promise<void>;
  showLoginPrompt: boolean;
  promptLogin: (redirectPath?: string) => void;
  dismissPrompt: () => void;
  pendingRedirect: string | null;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  role: null,
  isLoggedIn: false,
  isLoading: false,
  login: async () => {
    throw new Error('Auth context unavailable');
  },
  register: async () => {
    throw new Error('Auth context unavailable');
  },
  logout: async () => undefined,
  applyUser: () => undefined,
  restoreSession: async () => undefined,
  showLoginPrompt: false,
  promptLogin: () => undefined,
  dismissPrompt: () => undefined,
  pendingRedirect: null,
};

const AuthContext = createContext<AuthContextType | null>(null);

function snapshotsMatch(left: TokenSnapshot | null, right: TokenSnapshot | null): boolean {
  return (
    left !== null &&
    right !== null &&
    left.persistence === right.persistence &&
    left.tokens.access_token === right.tokens.access_token &&
    left.tokens.refresh_token === right.tokens.refresh_token &&
    left.tokens.token_type === right.tokens.token_type &&
    left.tokens.expires_at === right.tokens.expires_at
  );
}

function nonCustomerError(role: string): ApiError {
  return new ApiError(403, 'UNSUPPORTED_ROLE', `Only customer accounts are supported. Received "${role}".`);
}

function invalidAuthResponseError(): ApiError {
  return new ApiError(500, 'INVALID_AUTH_RESPONSE', 'Invalid auth response');
}

function staleAuthOperationError(): ApiError {
  return new ApiError(409, 'STALE_AUTH_OPERATION', 'Stale auth operation');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const authOperationCounterRef = useRef(0);
  const activeAuthOperationIdRef = useRef<number | null>(null);
  const ownedSessionOperationIdRef = useRef<number | null>(null);
  const sessionEpochRef = useRef(0);

  const applyLoggedOutState = useCallback((resetPrompt = false) => {
    if (!mountedRef.current) {
      return;
    }

    setUser(null);
    setIsLoading(false);

    if (resetPrompt) {
      setShowLoginPrompt(false);
      setPendingRedirect(null);
    }
  }, []);

  const markSessionMutation = useCallback(() => {
    sessionEpochRef.current += 1;
  }, []);

  const invalidatePendingAuthOperations = useCallback(() => {
    authOperationCounterRef.current += 1;
    activeAuthOperationIdRef.current = null;
  }, []);

  const beginAuthOperation = useCallback(() => {
    const operationId = authOperationCounterRef.current + 1;
    authOperationCounterRef.current = operationId;
    activeAuthOperationIdRef.current = operationId;
    return {
      operationId,
      startingSnapshot: readTokenSnapshot(),
      startingSessionEpoch: sessionEpochRef.current,
    };
  }, []);

  const isCurrentAuthOperation = useCallback((operationId: number) => {
    return activeAuthOperationIdRef.current === operationId;
  }, []);

  const persistAuthenticatedUser = useCallback(
    (nextUser: AuthUser, tokens: unknown, persistent: boolean, owningOperationId: number | null) => {
      if (!isAuthTokens(tokens)) {
        throw invalidAuthResponseError();
      }

      if (nextUser.role !== 'customer') {
        throw nonCustomerError(nextUser.role);
      }

      saveTokens(tokens, persistent);
      ownedSessionOperationIdRef.current = owningOperationId;
      markSessionMutation();

      if (!mountedRef.current) {
        activeAuthOperationIdRef.current = null;
        return nextUser;
      }

      setUser(nextUser);
      setIsLoading(false);
      setShowLoginPrompt(false);
      setPendingRedirect(null);
      activeAuthOperationIdRef.current = null;
      return nextUser;
    },
    [markSessionMutation],
  );

  const restoreSession = useCallback(async () => {
    const startingSnapshot = readTokenSnapshot();
    const startingSessionEpoch = sessionEpochRef.current;

    if (!startingSnapshot) {
      applyLoggedOutState();
      return;
    }

    if (mountedRef.current) {
      setIsLoading(true);
    }

    try {
      const response = await getMe();
      const currentSnapshot = readTokenSnapshot();

      if (sessionEpochRef.current !== startingSessionEpoch) {
        return;
      }

      if (!currentSnapshot) {
        applyLoggedOutState();
        return;
      }

      if (response.user.role !== 'customer') {
        clearTokens();
        ownedSessionOperationIdRef.current = null;
        markSessionMutation();
        applyLoggedOutState();
        throw nonCustomerError(response.user.role);
      }

      ownedSessionOperationIdRef.current = null;

      if (mountedRef.current) {
        setUser(response.user);
        setIsLoading(false);
      }
    } catch (error) {
      if (snapshotsMatch(startingSnapshot, readTokenSnapshot())) {
        clearTokens();
        ownedSessionOperationIdRef.current = null;
        markSessionMutation();
        applyLoggedOutState();
      }

      throw error;
    }
  }, [applyLoggedOutState, markSessionMutation]);

  useEffect(() => {
    mountedRef.current = true;

    const handleUnauthorized = () => {
      invalidatePendingAuthOperations();
      clearTokens();
      ownedSessionOperationIdRef.current = null;
      markSessionMutation();
      applyLoggedOutState();
    };

    setUnauthorizedHandler(handleUnauthorized);
    void restoreSession().catch(() => undefined);

    return () => {
      mountedRef.current = false;
      setUnauthorizedHandler(null);
    };
  }, [applyLoggedOutState, invalidatePendingAuthOperations, markSessionMutation, restoreSession]);

  const login = useCallback(
    async (input: LoginCustomerInput, rememberMe: boolean) => {
      const operation = beginAuthOperation();

      if (mountedRef.current) {
        setIsLoading(true);
      }

      try {
        const response = await loginCustomer(input);
        if (!isCurrentAuthOperation(operation.operationId)) {
          throw staleAuthOperationError();
        }

        return persistAuthenticatedUser(response.user, response.tokens, rememberMe, operation.operationId);
      } catch (error) {
        if (!isCurrentAuthOperation(operation.operationId)) {
          throw staleAuthOperationError();
        }

        activeAuthOperationIdRef.current = null;

        const currentSnapshot = readTokenSnapshot();
        const shouldClear =
          currentSnapshot === null ||
          (operation.startingSnapshot !== null &&
            snapshotsMatch(operation.startingSnapshot, currentSnapshot) &&
            ownedSessionOperationIdRef.current === operation.operationId);

        if (shouldClear) {
          clearTokens();
          ownedSessionOperationIdRef.current = null;
          markSessionMutation();
          applyLoggedOutState();
        } else if (mountedRef.current) {
          setIsLoading(false);
        }

        throw error;
      }
    },
    [applyLoggedOutState, beginAuthOperation, isCurrentAuthOperation, markSessionMutation, persistAuthenticatedUser],
  );

  const register = useCallback(
    async (input: RegisterCustomerInput) => {
      const operation = beginAuthOperation();

      if (mountedRef.current) {
        setIsLoading(true);
      }

      try {
        const response = await registerCustomer(input);
        if (!isCurrentAuthOperation(operation.operationId)) {
          throw staleAuthOperationError();
        }

        return persistAuthenticatedUser(response.user, response.tokens, false, operation.operationId);
      } catch (error) {
        if (!isCurrentAuthOperation(operation.operationId)) {
          throw staleAuthOperationError();
        }

        activeAuthOperationIdRef.current = null;

        const currentSnapshot = readTokenSnapshot();
        const shouldClear =
          currentSnapshot === null ||
          (operation.startingSnapshot !== null &&
            snapshotsMatch(operation.startingSnapshot, currentSnapshot) &&
            ownedSessionOperationIdRef.current === operation.operationId);

        if (shouldClear) {
          clearTokens();
          ownedSessionOperationIdRef.current = null;
          markSessionMutation();
          applyLoggedOutState();
        } else if (mountedRef.current) {
          setIsLoading(false);
        }

        throw error;
      }
    },
    [applyLoggedOutState, beginAuthOperation, isCurrentAuthOperation, markSessionMutation, persistAuthenticatedUser],
  );

  const logout = useCallback(async () => {
    const startingSnapshot = readTokenSnapshot();

    if (!startingSnapshot) {
      clearTokens();
      applyLoggedOutState(true);
      return;
    }

    if (mountedRef.current) {
      setIsLoading(true);
    }

    let logoutError: unknown = null;

    try {
      await logoutCustomer(startingSnapshot.tokens.refresh_token);
    } catch (error) {
      logoutError = error;
    } finally {
      if (snapshotsMatch(startingSnapshot, readTokenSnapshot())) {
        invalidatePendingAuthOperations();
        clearTokens();
        ownedSessionOperationIdRef.current = null;
        markSessionMutation();
        applyLoggedOutState(true);
      } else if (mountedRef.current) {
        setIsLoading(false);
      }
    }

    if (logoutError) {
      throw logoutError;
    }
  }, [applyLoggedOutState, invalidatePendingAuthOperations, markSessionMutation]);

  const applyUser = useCallback((nextUser: AuthUser) => {
    if (mountedRef.current) setUser(nextUser);
  }, []);

  const promptLogin = useCallback((redirectPath?: string) => {
    setPendingRedirect(redirectPath || null);
    setShowLoginPrompt(true);
  }, []);

  const dismissPrompt = useCallback(() => {
    setShowLoginPrompt(false);
    setPendingRedirect(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      role: user?.role ?? null,
      isLoggedIn: user !== null,
      isLoading,
      login,
      register,
      logout,
      applyUser,
      restoreSession,
      showLoginPrompt,
      promptLogin,
      dismissPrompt,
      pendingRedirect,
    }),
    [dismissPrompt, isLoading, login, logout, applyUser, pendingRedirect, promptLogin, register, restoreSession, showLoginPrompt, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext) ?? defaultAuthContext;
}
