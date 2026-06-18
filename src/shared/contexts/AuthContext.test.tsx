import { useEffect, useState } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginPromptModal } from '@/shared/components/LoginPromptModal'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { ApiError, type AuthTokens } from '@/shared/api/contracts'
import { readTokenSnapshot, saveTokens } from '@/shared/api/tokenStorage'
import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import { AuthProvider, useAuth } from './AuthContext'

const {
  loginCustomerMock,
  registerCustomerMock,
  logoutCustomerMock,
  refreshSessionMock,
  getMeMock,
  setUnauthorizedHandlerMock,
} = vi.hoisted(() => ({
  loginCustomerMock: vi.fn(),
  registerCustomerMock: vi.fn(),
  logoutCustomerMock: vi.fn(),
  refreshSessionMock: vi.fn(),
  getMeMock: vi.fn(),
  setUnauthorizedHandlerMock: vi.fn(),
}))

vi.mock('@/features/auth/api/authApi', () => ({
  loginCustomer: loginCustomerMock,
  registerCustomer: registerCustomerMock,
  logoutCustomer: logoutCustomerMock,
  refreshSession: refreshSessionMock,
  getMe: getMeMock,
}))

vi.mock('@/shared/api/apiClient', async () => {
  const actual = await vi.importActual<typeof import('@/shared/api/apiClient')>('@/shared/api/apiClient')
  return {
    ...actual,
    setUnauthorizedHandler: setUnauthorizedHandlerMock,
  }
})

vi.mock('@/app/layouts/PublicLayout', () => ({
  PublicLayout: () => <div data-testid="public-layout">Public layout</div>,
}))

const firstTokens: AuthTokens = {
  access_token: 'access-1',
  refresh_token: 'refresh-1',
  token_type: 'Bearer',
  expires_at: '2026-06-05T00:00:00.000Z',
}

const secondTokens: AuthTokens = {
  access_token: 'access-2',
  refresh_token: 'refresh-2',
  token_type: 'Bearer',
  expires_at: '2026-06-06T00:00:00.000Z',
}

const customerUser = {
  id: 'customer-1',
  email: 'customer@example.com',
  phone: null,
  name: 'Customer Example',
  role: 'customer',
  status: 'active',
  avatar_url: null,
  bio: null,
  email_verified: false,
  phone_verified: false,
  created_at: '2026-06-04T00:00:00.000Z',
}

const replacementUser = {
  ...customerUser,
  id: 'customer-2',
  email: 'new@example.com',
}

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

function AuthProbe() {
  const auth = useAuth()
  const [error, setError] = useState('')
  const [errorCode, setErrorCode] = useState('')
  const [resultEmail, setResultEmail] = useState('')

  const runAction = (action: () => Promise<unknown> | void) => {
    try {
      const result = action()
      void Promise.resolve(result).then(
        (value) => {
          if (value && typeof value === 'object' && 'email' in value && typeof value.email === 'string') {
            setResultEmail(value.email)
          }
        },
        (reason: unknown) => {
          setError(reason instanceof Error ? reason.message : String(reason))
          setErrorCode(reason instanceof ApiError ? reason.code : '')
        },
      )
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
      setErrorCode(reason instanceof ApiError ? reason.code : '')
    }
  }

  return (
    <div>
      <div data-testid="role">{auth.role ?? ''}</div>
      <div data-testid="email">{auth.user?.email ?? ''}</div>
      <div data-testid="logged-in">{String(auth.isLoggedIn)}</div>
      <div data-testid="loading">{String(auth.isLoading)}</div>
      <div data-testid="pending-redirect">{auth.pendingRedirect ?? ''}</div>
      <div data-testid="prompt-open">{String(auth.showLoginPrompt)}</div>
      <div data-testid="error">{error}</div>
      <div data-testid="error-code">{errorCode}</div>
      <div data-testid="result-email">{resultEmail}</div>
      <button
        type="button"
        onClick={() =>
          runAction(() => auth.login({ email: 'customer@example.com', password: 'P@ssw0rd!' }, true))
        }
      >
        login-local
      </button>
      <button
        type="button"
        onClick={() =>
          runAction(() => auth.login({ email: 'customer@example.com', password: 'P@ssw0rd!' }, false))
        }
      >
        login-session
      </button>
      <button
        type="button"
        onClick={() =>
          runAction(() =>
            auth.register({
              name: 'Customer Example',
              email: 'customer@example.com',
              password: 'P@ssw0rd!',
            })
          )
        }
      >
        register
      </button>
      <button
        type="button"
        onClick={() => runAction(() => auth.logout())}
      >
        logout
      </button>
      <button
        type="button"
        onClick={() => runAction(() => auth.restoreSession())}
      >
        restore
      </button>
      <button type="button" onClick={() => auth.promptLogin('/wishlist?tab=saved')}>
        prompt
      </button>
    </div>
  )
}

function renderAuth(children: React.ReactNode, initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LanguageProvider>
        <AuthProvider>
          {children}
          <LoginPromptModal />
        </AuthProvider>
      </LanguageProvider>
    </MemoryRouter>,
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.resetModules()
    loginCustomerMock.mockReset()
    registerCustomerMock.mockReset()
    logoutCustomerMock.mockReset()
    refreshSessionMock.mockReset()
    getMeMock.mockReset()
    setUnauthorizedHandlerMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('restores to a logged-out idle state when no tokens exist', async () => {
    renderAuth(<AuthProbe />)

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('logged-in')).toHaveTextContent('false')
    expect(getMeMock).not.toHaveBeenCalled()
  })

  it('restores the current customer session on mount when tokens are present', async () => {
    saveTokens(firstTokens, true)
    getMeMock.mockResolvedValue({ user: customerUser })

    renderAuth(<AuthProbe />)

    await waitFor(() => {
      expect(screen.getByTestId('logged-in')).toHaveTextContent('true')
    })

    expect(getMeMock).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('email')).toHaveTextContent('customer@example.com')
    expect(screen.getByTestId('role')).toHaveTextContent('customer')
  })

  it('applyUser replaces the current user in context state', async () => {
    saveTokens(firstTokens, true)
    getMeMock.mockResolvedValue({ user: customerUser })

    function ApplyUserHarness() {
      const { user, applyUser } = useAuth()
      return (
        <div>
          <span data-testid="user-name">{user?.name ?? 'none'}</span>
          <button type="button" onClick={() => applyUser({ ...customerUser, name: 'Renamed User' })}>
            apply
          </button>
        </div>
      )
    }

    render(
      <LanguageProvider>
        <MemoryRouter>
          <AuthProvider>
            <ApplyUserHarness />
          </AuthProvider>
        </MemoryRouter>
      </LanguageProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('Customer Example'))
    await userEvent.click(screen.getByRole('button', { name: 'apply' }))
    expect(screen.getByTestId('user-name')).toHaveTextContent('Renamed User')
  })

  it('clears tokens and user state when session restoration fails', async () => {
    saveTokens(firstTokens, true)
    getMeMock.mockRejectedValue(new ApiError(401, 'UNAUTHORIZED', 'Expired'))

    renderAuth(<AuthProbe />)

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('logged-in')).toHaveTextContent('false')
    expect(readTokenSnapshot()).toBeNull()
  })

  it('logs in a customer and saves a persistent token snapshot when rememberMe is true', async () => {
    const user = userEvent.setup()
    loginCustomerMock.mockResolvedValue({ user: customerUser, tokens: firstTokens })

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'login-local' }))

    await waitFor(() => {
      expect(screen.getByTestId('logged-in')).toHaveTextContent('true')
    })

    expect(screen.getByTestId('result-email')).toHaveTextContent('customer@example.com')
    expect(loginCustomerMock).toHaveBeenCalledWith({
      email: 'customer@example.com',
      password: 'P@ssw0rd!',
    })
    expect(readTokenSnapshot()).toMatchObject({
      persistence: 'local',
      tokens: firstTokens,
    })
  })

  it('registers a customer and saves the new session in session storage', async () => {
    const user = userEvent.setup()
    registerCustomerMock.mockResolvedValue({ user: customerUser, tokens: firstTokens })

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'register' }))

    await waitFor(() => {
      expect(screen.getByTestId('logged-in')).toHaveTextContent('true')
    })

    expect(screen.getByTestId('result-email')).toHaveTextContent('customer@example.com')
    expect(registerCustomerMock).toHaveBeenCalledWith({
      name: 'Customer Example',
      email: 'customer@example.com',
      password: 'P@ssw0rd!',
    })
    expect(readTokenSnapshot()).toMatchObject({
      persistence: 'session',
      tokens: firstTokens,
    })
  })

  it('rejects non-customer login responses without exposing authenticated state', async () => {
    const user = userEvent.setup()
    loginCustomerMock.mockResolvedValue({
      user: { ...customerUser, role: 'brand' },
      tokens: firstTokens,
    })

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'login-session' }))

    await waitFor(() => {
      expect(screen.getByTestId('error')).not.toHaveTextContent('')
    })

    expect(screen.getByTestId('logged-in')).toHaveTextContent('false')
    expect(readTokenSnapshot()).toBeNull()
  })

  it('rejects invalid token payloads before anything is saved locally', async () => {
    const user = userEvent.setup()
    loginCustomerMock.mockResolvedValue({
      user: customerUser,
      tokens: {
        access_token: 'broken',
        refresh_token: '',
        token_type: 'Bearer',
        expires_at: '2026-06-05T00:00:00.000Z',
      },
    })

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'login-session' }))

    await waitFor(() => {
      expect(screen.getByTestId('error')).not.toHaveTextContent('')
    })

    expect(screen.getByTestId('logged-in')).toHaveTextContent('false')
    expect(readTokenSnapshot()).toBeNull()
  })

  it('logs out with the refresh token and clears the current session even when the request fails', async () => {
    const user = userEvent.setup()
    loginCustomerMock.mockResolvedValue({ user: customerUser, tokens: firstTokens })
    logoutCustomerMock.mockRejectedValue(new Error('Network failed'))

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'login-session' }))
    await waitFor(() => {
      expect(screen.getByTestId('logged-in')).toHaveTextContent('true')
    })

    await user.click(screen.getByRole('button', { name: 'logout' }))

    await waitFor(() => {
      expect(screen.getByTestId('logged-in')).toHaveTextContent('false')
    })

    expect(logoutCustomerMock).toHaveBeenCalledWith(firstTokens.refresh_token)
    expect(readTokenSnapshot()).toBeNull()
    expect(screen.getByTestId('error')).toHaveTextContent('Network failed')
  })

  it('restores successfully when getMe rotates the current token snapshot', async () => {
    saveTokens(firstTokens, true)
    getMeMock.mockImplementation(async () => {
      saveTokens(secondTokens, true)
      return { user: customerUser }
    })

    renderAuth(<AuthProbe />)

    await waitFor(() => {
      expect(screen.getByTestId('logged-in')).toHaveTextContent('true')
    })

    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('email')).toHaveTextContent('customer@example.com')
    expect(readTokenSnapshot()).toMatchObject({
      persistence: 'local',
      tokens: secondTokens,
    })
  })

  it('does not let a stale restore overwrite a replacement login session', async () => {
    const user = userEvent.setup()
    const pendingRestore = deferred<{ user: typeof customerUser }>()
    saveTokens(firstTokens, true)
    getMeMock.mockReturnValue(pendingRestore.promise)
    loginCustomerMock.mockResolvedValue({ user: replacementUser, tokens: secondTokens })

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'login-local' }))

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('new@example.com')
    })

    await act(async () => {
      pendingRestore.resolve({ user: customerUser })
      await pendingRestore.promise
    })

    expect(screen.getByTestId('email')).toHaveTextContent('new@example.com')
    expect(screen.getByTestId('logged-in')).toHaveTextContent('true')
    expect(readTokenSnapshot()).toMatchObject({
      persistence: 'local',
      tokens: secondTokens,
    })
  })

  it('rejects a stale late login success without overwriting a newer login session', async () => {
    const user = userEvent.setup()
    const pendingFirstLogin = deferred<{ user: typeof customerUser; tokens: AuthTokens }>()
    loginCustomerMock
      .mockReturnValueOnce(pendingFirstLogin.promise)
      .mockResolvedValueOnce({ user: replacementUser, tokens: secondTokens })

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'login-session' }))
    await user.click(screen.getByRole('button', { name: 'login-local' }))

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('new@example.com')
    })

    await act(async () => {
      pendingFirstLogin.resolve({ user: customerUser, tokens: firstTokens })
      await pendingFirstLogin.promise.catch(() => undefined)
    })

    expect(screen.getByTestId('error-code')).toHaveTextContent('STALE_AUTH_OPERATION')
    expect(screen.getByTestId('email')).toHaveTextContent('new@example.com')
    expect(readTokenSnapshot()).toMatchObject({
      persistence: 'local',
      tokens: secondTokens,
    })
  })

  it('preserves an existing authenticated session when a re-login fails', async () => {
    const user = userEvent.setup()
    loginCustomerMock
      .mockResolvedValueOnce({ user: customerUser, tokens: firstTokens })
      .mockRejectedValueOnce(new Error('Retry failed'))

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'login-session' }))
    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('customer@example.com')
    })

    await user.click(screen.getByRole('button', { name: 'login-local' }))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Retry failed')
    })

    expect(screen.getByTestId('email')).toHaveTextContent('customer@example.com')
    expect(readTokenSnapshot()).toMatchObject({
      persistence: 'session',
      tokens: firstTokens,
    })
  })

  it('rejects a stale late login failure without clearing a replacement session', async () => {
    const user = userEvent.setup()
    const pendingFirstLogin = deferred<{ user: typeof customerUser; tokens: AuthTokens }>()
    loginCustomerMock
      .mockReturnValueOnce(pendingFirstLogin.promise)
      .mockResolvedValueOnce({ user: replacementUser, tokens: secondTokens })

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'login-session' }))
    await user.click(screen.getByRole('button', { name: 'login-local' }))

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('new@example.com')
    })

    await act(async () => {
      pendingFirstLogin.reject(new Error('Late login failed'))
      await pendingFirstLogin.promise.catch(() => undefined)
    })

    expect(screen.getByTestId('error-code')).toHaveTextContent('STALE_AUTH_OPERATION')
    expect(screen.getByTestId('email')).toHaveTextContent('new@example.com')
    expect(readTokenSnapshot()).toMatchObject({
      persistence: 'local',
      tokens: secondTokens,
    })
  })

  it('rejects a stale late register failure without clearing a replacement session', async () => {
    const user = userEvent.setup()
    const pendingRegister = deferred<{ user: typeof customerUser; tokens: AuthTokens }>()
    registerCustomerMock.mockReturnValueOnce(pendingRegister.promise)
    loginCustomerMock.mockResolvedValueOnce({ user: replacementUser, tokens: secondTokens })

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'register' }))
    await user.click(screen.getByRole('button', { name: 'login-local' }))

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('new@example.com')
    })

    await act(async () => {
      pendingRegister.reject(new Error('Late register failed'))
      await pendingRegister.promise.catch(() => undefined)
    })

    expect(screen.getByTestId('error-code')).toHaveTextContent('STALE_AUTH_OPERATION')
    expect(screen.getByTestId('email')).toHaveTextContent('new@example.com')
    expect(readTokenSnapshot()).toMatchObject({
      persistence: 'local',
      tokens: secondTokens,
    })
  })

  it('does not let a stale logout clear a newer replacement login session', async () => {
    const user = userEvent.setup()
    const pendingLogout = deferred<void>()
    loginCustomerMock
      .mockResolvedValueOnce({ user: customerUser, tokens: firstTokens })
      .mockResolvedValueOnce({
        user: { ...customerUser, id: 'customer-2', email: 'new@example.com' },
        tokens: secondTokens,
      })
    logoutCustomerMock.mockReturnValue(pendingLogout.promise)

    renderAuth(<AuthProbe />)

    await user.click(screen.getByRole('button', { name: 'login-session' }))
    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('customer@example.com')
    })

    await user.click(screen.getByRole('button', { name: 'logout' }))
    await user.click(screen.getByRole('button', { name: 'login-local' }))

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('new@example.com')
    })

    await act(async () => {
      pendingLogout.resolve()
      await pendingLogout.promise
    })

    expect(screen.getByTestId('logged-in')).toHaveTextContent('true')
    expect(screen.getByTestId('email')).toHaveTextContent('new@example.com')
    expect(readTokenSnapshot()).toMatchObject({
      persistence: 'local',
      tokens: secondTokens,
    })
  })

  it('registers and removes the unauthorized handler, and the handler clears the current session', async () => {
    const user = userEvent.setup()
    loginCustomerMock.mockResolvedValue({ user: customerUser, tokens: firstTokens })

    const { unmount } = renderAuth(<AuthProbe />)

    expect(setUnauthorizedHandlerMock).toHaveBeenCalledWith(expect.any(Function))

    await user.click(screen.getByRole('button', { name: 'login-local' }))
    await waitFor(() => {
      expect(screen.getByTestId('logged-in')).toHaveTextContent('true')
    })

    const unauthorizedHandler = setUnauthorizedHandlerMock.mock.calls[0]?.[0] as (() => void) | undefined
    expect(unauthorizedHandler).toBeTypeOf('function')

    act(() => {
      unauthorizedHandler?.()
    })

    await waitFor(() => {
      expect(screen.getByTestId('logged-in')).toHaveTextContent('false')
    })

    expect(readTokenSnapshot()).toBeNull()

    unmount()

    expect(setUnauthorizedHandlerMock).toHaveBeenLastCalledWith(null)
  })
})

describe('App router wiring', () => {
  it('renders App with BrowserRouter wrapped around AppProviders so the modal has router context', async () => {
    const { default: App } = await import('@/app/App')

    expect(() => render(<App />)).not.toThrow()
    expect(screen.getByTestId('public-layout')).toBeInTheDocument()
  })
})

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.resetModules()
    loginCustomerMock.mockReset()
    registerCustomerMock.mockReset()
    logoutCustomerMock.mockReset()
    refreshSessionMock.mockReset()
    getMeMock.mockReset()
    setUnauthorizedHandlerMock.mockReset()
  })

  it('shows a neutral loading container during session restoration and does not prompt early', async () => {
    const pendingRestore = deferred<{ user: typeof customerUser }>()
    saveTokens(firstTokens, true)
    getMeMock.mockReturnValue(pendingRestore.promise)

    renderAuth(
      <Routes>
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <div>Protected content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      ['/wishlist?tab=saved'],
    )

    expect(screen.getByTestId('protected-route-loading')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /sign in/i })).not.toBeInTheDocument()

    await act(async () => {
      pendingRestore.resolve({ user: customerUser })
      await pendingRestore.promise
    })

    await waitFor(() => {
      expect(screen.getByText('Protected content')).toBeInTheDocument()
    })
  })

  it('opens the login prompt with an encoded pathname and search redirect after restoration completes', async () => {
    renderAuth(
      <Routes>
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <div>Protected content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      ['/wishlist?tab=saved'],
    )

    const signInLink = await screen.findByRole('link', { name: /đăng nhập|sign in/i })

    expect(signInLink).toHaveAttribute('href', '/login?redirect=%2Fwishlist%3Ftab%3Dsaved')
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })
})
