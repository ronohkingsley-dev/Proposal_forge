import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendFreelancerNotification } from '@/lib/notifications'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // 1. Fetch proposal by token
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('share_token', token)
      .single()

    if (fetchError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    // 2. Only update if it's currently 'draft' or 'sent'
    if (proposal.status === 'sent') {
      const { error: updateError } = await supabase
        .from('proposals')
        .update({ status: 'viewed' })
        .eq('id', proposal.id)

      if (updateError) throw updateError

      // 3. Send notification
      await sendFreelancerNotification(proposal.user_id, 'proposal_viewed', proposal)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Tracking Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
