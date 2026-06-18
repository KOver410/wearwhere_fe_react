import { describe, expect, it } from 'vitest'

import type { AuthTokens } from './contracts'
import {
  clearTokens,
  readTokenPersistence,
  readTokens,
  saveTokens,
} from './tokenStorage'

const STORAGE_KEY = 'wearwhere.auth.tokens'

const tokens: AuthTokens = {
  access_token: 'access-token',
  refresh_token: 'refresh-token',
  token_type: 'Bearer',
  expires_at: '2026-06-05T00:00:00.000Z',
}

describe('tokenStorage', () => {
  it('saves persistent tokens in local storage and clears session storage', () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))

    saveTokens(tokens, true)

    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(tokens))
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('saves non-persistent tokens in session storage and clears local storage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))

    saveTokens(tokens, false)

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(tokens))
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('reads local storage before session storage', () => {
    const sessionTokens = { ...tokens, access_token: 'session-access' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionTokens))

    expect(readTokens()).toEqual(tokens)
  })

  it.each([
    ['local', localStorage],
    ['session', sessionStorage],
  ] as const)('reports %s persistence for the active readable token', (expected, storage) => {
    storage.setItem(STORAGE_KEY, JSON.stringify(tokens))

    expect(readTokenPersistence()).toBe(expected)
  })

  it('returns null persistence when there are no readable tokens', () => {
    expect(readTokenPersistence()).toBeNull()
  })

  it('clears tokens from both storage locations', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))

    clearTokens()

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it.each([
    ['an array', []],
    ['an empty object', {}],
    ['missing access token', { refresh_token: 'refresh-token', token_type: 'Bearer', expires_at: tokens.expires_at }],
    ['missing refresh token', { access_token: 'access-token', token_type: 'Bearer', expires_at: tokens.expires_at }],
    ['missing token type', { access_token: 'access-token', refresh_token: 'refresh-token', expires_at: tokens.expires_at }],
    ['missing expiry', { access_token: 'access-token', refresh_token: 'refresh-token', token_type: 'Bearer' }],
    ['an empty access token', { ...tokens, access_token: '' }],
    ['an empty refresh token', { ...tokens, refresh_token: '' }],
    ['an empty token type', { ...tokens, token_type: '' }],
    ['an empty expiry', { ...tokens, expires_at: '' }],
    ['a non-string access token', { ...tokens, access_token: 123 }],
  ])('rejects %s on save, clears both stores, and persists nothing', (_name, invalidTokens) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))

    expect(() => saveTokens(invalidTokens as AuthTokens, true)).toThrow(TypeError)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(readTokens()).toBeNull()
    expect(readTokenPersistence()).toBeNull()
  })

  it('clears both stores and returns null when selected local storage contains malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{bad-json')
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))

    expect(readTokens()).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('clears both stores and returns null when selected session storage contains malformed JSON', () => {
    sessionStorage.setItem(STORAGE_KEY, '{bad-json')

    expect(readTokens()).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it.each([
    ['null', null],
    ['an array', []],
    ['an empty object', {}],
    ['an empty access token', { ...tokens, access_token: '' }],
    ['an empty refresh token', { ...tokens, refresh_token: '' }],
    ['an empty token type', { ...tokens, token_type: '' }],
    ['an empty expiry', { ...tokens, expires_at: '' }],
    ['a non-string token field', { ...tokens, access_token: 123 }],
  ])('clears both stores and returns null when stored tokens are %s', (_name, invalidTokens) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidTokens))
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))

    expect(readTokens()).toBeNull()
    expect(readTokenPersistence()).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
