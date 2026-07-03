import { MemoryRouter } from 'react-router'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import { Header } from './Header'

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ isLoggedIn: false, promptLogin: vi.fn() }),
}))

vi.mock('@/features/account/api/cartApi', () => ({
  getCart: vi.fn().mockResolvedValue({ summary: { total_qty: 0 } }),
}))

function renderHeader() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('Header primary navigation', () => {
  it('shows the OOTD nav entry and no STYLE entry', () => {
    localStorage.setItem('ww-lang', 'en')
    renderHeader()
    expect(screen.getAllByText('OOTD').length).toBeGreaterThan(0)
    expect(screen.queryByText('STYLE')).toBeNull()
    expect(screen.queryByText('Style')).toBeNull()
  })
})
