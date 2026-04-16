import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 })
    }

    const supabase = createClient()

    // Query for the proposal using the unique share_token
    // Note: This is an unauthenticated query as it's a public endpoint
    const { data: proposal, error } = await supabase
      .from('proposals')
      .select(`
        id, 
        project_title, 
        client_name, 
        client_email,
        status, 
        total_price, 
        currency, 
        content, 
        share_token, 
        expires_at,
        created_at
      `)
      .eq('share_token', token)
      .single()

    if (error || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    // Extracting fields from the 'content' JSONB column for a flattened response
    const content = proposal.content as any || {}
    
    const responseData = {
      id: proposal.id,
      title: proposal.project_title,
      client_name: proposal.client_name,
      client_email: proposal.client_email,
      scope_summary: content.scope_summary,
      complexity: content.complexity,
      niche: content.niche,
      timeline_days: content.timeline_days,
      price_cents: Math.round(proposal.total_price * 100),
      price_usd: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: proposal.currency || 'USD',
      }).format(proposal.total_price),
      deposit_percent: content.deposit_percent,
      status: proposal.status,
      created_at: proposal.created_at,
      expires_at: proposal.expires_at,
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('Public Proposal API Error:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
