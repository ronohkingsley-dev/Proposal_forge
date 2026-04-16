import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { sendFreelancerNotification } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Basic auth check for cron if configured
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const now = new Date()
    
    // 1. Process 24h Expiration Reminders
    const h24Ahead = new Date()
    h24Ahead.setHours(h24Ahead.getHours() + 24)
    
    const { data: expiringProposals } = await supabase
      .from('proposals')
      .select('*, profiles(full_name, email)')
      .in('status', ['sent', 'viewed'])
      .gt('expires_at', now.toISOString())
      .lte('expires_at', h24Ahead.toISOString())

    if (expiringProposals && expiringProposals.length > 0) {
      for (const proposal of expiringProposals) {
        const userName = proposal.profiles?.full_name || proposal.profiles?.email
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const shareLink = `${baseUrl}/share/${proposal.share_token}`
        const expiresAt = new Date(proposal.expires_at).toLocaleDateString()

        // Send to client
        await resend.emails.send({
          from: 'ProposalForge <notifications@resend.dev>',
          to: proposal.client_email,
          subject: `Reminder: Your proposal expires tomorrow`,
          html: `<p>Hello ${proposal.client_name},</p>
                 <p>This is a reminder that the proposal <strong>${proposal.project_title}</strong> from ${userName} will expire on ${expiresAt}.</p>
                 <p><a href="${shareLink}">Click here to view it.</a></p>`
        })

        // Notify freelancer
        await sendFreelancerNotification(proposal.user_id, 'expiration_warning', proposal)
      }
    }

    // 2. Mark Expired (> 7 Days)
    const d7Ago = new Date()
    d7Ago.setDate(d7Ago.getDate() - 7)

    const { error: expireError, data: expiredUpdate } = await supabase
      .from('proposals')
      .update({ status: 'expired' })
      .in('status', ['draft', 'sent', 'viewed'])
      .lt('expires_at', d7Ago.toISOString())
      .select('id')

    if (expireError) throw expireError

    return NextResponse.json({ 
      success: true, 
      reminders_sent: expiringProposals?.length || 0,
      expired_updated: expiredUpdate?.length || 0
    })

  } catch (error: any) {
    console.error('Cron Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
