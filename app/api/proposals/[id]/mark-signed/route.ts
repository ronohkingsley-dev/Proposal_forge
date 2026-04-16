import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendFreelancerNotification } from '@/lib/notifications'

/**
 * Public endpoint to mark a proposal as signed after payment.
 * POST /api/proposals/[id]/mark-signed
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const supabase = createClient()

    // 1. Fetch current status
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    // 2. If already signed, just return success
    if (proposal.status === 'signed') {
      return NextResponse.json({ 
        success: true, 
        message: "Already signed", 
        proposal_id: id, 
        status: 'signed' 
      })
    }

    // 3. Update status to 'signed' and set timestamp
    const { error: updateError } = await supabase
      .from('proposals')
      .update({ 
        status: 'signed',
        deposit_paid_at: new Date().toISOString()
      })
      .eq('id', id)
      .in('status', ['draft', 'sent', 'viewed'])

    if (updateError) {
      throw updateError
    }

    // 4. Send notification
    await sendFreelancerNotification(proposal.user_id, 'deposit_received', proposal)

    return NextResponse.json({ 
      success: true, 
      proposal_id: id, 
      status: 'signed' 
    })

  } catch (error: any) {
    console.error('Mark Signed Error:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
