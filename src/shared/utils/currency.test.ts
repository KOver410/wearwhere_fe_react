import { describe, expect, it } from 'vitest'

import { formatVND } from './currency'

describe('formatVND', () => {
  it.each([125000, '125000'])('formats %s as Vietnamese dong', (value) => {
    const result = formatVND(value)
    const normalizedResult = result.replace(/\s+/g, ' ')

    expect(normalizedResult).toMatch(/125[.\s]000/)
    expect(normalizedResult).toContain('₫')
    expect(normalizedResult.replace(/\D/g, '')).toBe('125000')
  })
})
