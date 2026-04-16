import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token, seconds } = await request.json()

    // Validation
    if (!token || typeof seconds !== 'number' || seconds <= 0 || seconds > 3600) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 })
    }

    const supabase = createClient()

    // 1. Get current time spent
    const { data: proposal, error: findError } = await supabase
      .from('proposals')
      .select('id, time_spent_seconds')
      .eq('share_token', token)
      .single()

    if (findError || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    // 2. Increment time spent
    const newTotal = (proposal.time_spent_seconds || 0) + seconds

    const { error: updateError } = await supabase
      .from('proposals')
      .update({ time_spent_seconds: newTotal })
      .eq('id', proposal.id)

    if (updateError) throw updateError

    return NextResponse.json({ 
      success: true, 
      total_seconds: newTotal 
    })
  } catch (error: any) {
    console.error('Heartbeat API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
