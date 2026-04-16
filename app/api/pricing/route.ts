import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface PricingResponse {
  low: number
  median: number
  high: number
  sample_size: number
  source: 'primary' | 'fallback' | 'default'
}

type Complexity = 'low' | 'medium' | 'high'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const niche = searchParams.get('niche')
    const complexity = searchParams.get('complexity') as Complexity
    
    // Default values
    const country = searchParams.get('country') || 'US'
    const experience = parseInt(searchParams.get('experience') || '3')

    if (!niche || !complexity) {
      return NextResponse.json({ error: "Niche and complexity are required" }, { status: 400 })
    }

    const supabase = createClient()

    // 1. Primary Query: Match niche, complexity, country, and experience range
    let { data, error } = await supabase
      .from('pricing_data')
      .select('price_cents')
      .eq('niche', niche)
      .eq('project_complexity', complexity)
      .eq('country', country)
      .gte('years_experience', experience - 2)
      .lte('years_experience', experience + 2)

    let source: 'primary' | 'fallback' | 'default' = 'primary'

    // 2. Fallback Query: If fewer than 3 matches, widen search (ignore country/experience)
    if (!data || data.length < 3) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('pricing_data')
        .select('price_cents')
        .eq('niche', niche)
        .eq('project_complexity', complexity)
      
      data = fallbackData
      source = 'fallback'
      
      if (fallbackError) throw fallbackError
    }

    // 3. Defaults: If still no data, return static defaults
    if (!data || data.length === 0) {
      const defaults: Record<Complexity, { low: number, median: number, high: number }> = {
        low: { low: 30000, median: 55000, high: 80000 },
        medium: { low: 80000, median: 190000, high: 300000 },
        high: { low: 300000, median: 550000, high: 800000 }
      }

      const formatUSD = (cents: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

      const d = defaults[complexity]

      return NextResponse.json({
        ...d,
        low_usd: formatUSD(d.low),
        median_usd: formatUSD(d.median),
        high_usd: formatUSD(d.high),
        sample_size: 0,
        source: 'default'
      })
    }

    // 4. Calculate Statistics
    const prices = data.map(row => row.price_cents).sort((a, b) => a - b)
    const sampleSize = prices.length

    const getPercentile = (p: number) => {
      if (sampleSize < 4) {
        if (p === 25) return prices[0]
        if (p === 50) return prices[Math.floor(sampleSize / 2)]
        return prices[sampleSize - 1]
      }
      
      const index = (p / 100) * (sampleSize - 1)
      const lower = Math.floor(index)
      const upper = Math.ceil(index)
      const weight = index - lower
      return Math.round(prices[lower] * (1 - weight) + prices[upper] * weight)
    }

    const low = getPercentile(25)
    const median = getPercentile(50)
    const high = getPercentile(75)

    const formatUSD = (cents: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

    return NextResponse.json({
      low,
      median,
      high,
      low_usd: formatUSD(low),
      median_usd: formatUSD(median),
      high_usd: formatUSD(high),
      sample_size: sampleSize,
      source
    })

  } catch (error: any) {
    console.error('Pricing API Error:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
