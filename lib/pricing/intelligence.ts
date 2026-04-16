/**
 * Proposal Pricing Intelligence Engine
 * Provides market-rate data based on niche, complexity, and industry standards.
 */

export interface PricingFactors {
  niche: string
  complexity: 'low' | 'medium' | 'high'
  experienceYears?: number
}

export interface MarketRateResult {
  min: number
  max: number
  avg: number
  currency: string
  confidenceScore: number
}

const MARKET_DATA: Record<string, Record<string, { min: number, max: number, avg: number }>> = {
  'Web Design': {
    low: { min: 800, max: 2000, avg: 1400 },
    medium: { min: 2000, max: 6000, avg: 4500 },
    high: { min: 6000, max: 15000, avg: 10000 }
  },
  'Copywriting': {
    low: { min: 200, max: 800, avg: 500 },
    medium: { min: 800, max: 2500, avg: 1600 },
    high: { min: 2500, max: 8000, avg: 5000 }
  },
  'SEO': {
    low: { min: 500, max: 1500, avg: 1000 },
    medium: { min: 1500, max: 4000, avg: 2800 },
    high: { min: 4000, max: 10000, avg: 7000 }
  },
  'Graphic Design': {
    low: { min: 300, max: 1000, avg: 650 },
    medium: { min: 1000, max: 3500, avg: 2200 },
    high: { min: 3500, max: 10000, avg: 6000 }
  },
  'Video Editing': {
    low: { min: 400, max: 1200, avg: 800 },
    medium: { min: 1200, max: 4500, avg: 3000 },
    high: { min: 4500, max: 12000, avg: 8500 }
  }
}

export function getIntelligence(factors: PricingFactors): MarketRateResult {
  const nicheData = MARKET_DATA[factors.niche] || MARKET_DATA['Web Design']
  const stats = nicheData[factors.complexity]
  
  return {
    ...stats,
    currency: 'USD',
    confidenceScore: 0.85
  }
}
