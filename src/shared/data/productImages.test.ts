import { describe, it, expect } from 'vitest'

import { PRODUCT_IMAGES, productImage } from './productImages'

describe('productImage', () => {
  it('exposes a non-empty image pool', () => {
    expect(PRODUCT_IMAGES.length).toBeGreaterThan(0)
  })

  it('returns the image at the given index', () => {
    expect(productImage(0)).toBe(PRODUCT_IMAGES[0])
  })

  it('cycles through the pool when the index exceeds its length', () => {
    expect(productImage(PRODUCT_IMAGES.length)).toBe(PRODUCT_IMAGES[0])
    expect(productImage(PRODUCT_IMAGES.length + 1)).toBe(PRODUCT_IMAGES[1])
  })
})
