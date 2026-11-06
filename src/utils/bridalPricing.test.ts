import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateDiscountPercent,
  generateProductCode,
  generateAutoProductTitle,
  calculateCatalogSummary,
} from './bridalPricing.ts'
import { INITIAL_BRIDAL_PRODUCTS } from '../data/initialBridalData.ts'

describe('bridalPricing utilities', () => {
  it('calculates discount percentage accurately', () => {
    assert.equal(calculateDiscountPercent(8500000, 6500000), 24)
    assert.equal(calculateDiscountPercent(5000000, 5000000), 0)
    assert.equal(calculateDiscountPercent(null, 5000000), 0)
  })

  it('generates standardized SKU codes for wedding gowns and party dresses', () => {
    assert.equal(generateProductCode('wedding_gown', 9), 'EB-GWN-009')
    assert.equal(generateProductCode('party_dress', 4), 'EB-PTY-004')
  })

  it('generates clean auto titles from color, silhouette, and product type', () => {
    assert.equal(
      generateAutoProductTitle('Ballgown', 'Ivory & Warm Champagne', 'wedding_gown'),
      'Ivory Ballgown Wedding Gown'
    )
    assert.equal(
      generateAutoProductTitle('Sheath / Column', 'Deep Emerald', 'party_dress'),
      'Deep Emerald Sheath Evening Dress'
    )
  })

  it('computes catalog summary metrics accurately from initial bridal data', () => {
    const summary = calculateCatalogSummary(INITIAL_BRIDAL_PRODUCTS)
    assert.equal(summary.totalProducts, 8)
    assert.equal(summary.weddingGownsCount, 5)
    assert.equal(summary.partyDressesCount, 3)
    assert.ok(summary.avgRentalPrice > 0)
    assert.ok(summary.avgPurchasePrice > summary.avgRentalPrice)
  })
})

