export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = createClient()

    // 1. Authenticate User
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch Proposal and verify ownership
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*, profiles(full_name, email)')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !proposal) {
      return NextResponse.json({ message: 'Proposal not found' }, { status: 404 })
    }

    if (!proposal.client_email) {
      return NextResponse.json({ message: 'Client email missing' }, { status: 400 })
    }

    // Parse body for optional flags
    let isReminder = false
    try {
      const body = await request.json()
      isReminder = body.isReminder === true
    } catch (e) {
      // ignore
    }

    // 3. Prepare Email Content
    const userName = proposal.profiles?.full_name || session.user.email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const shareLink = `${baseUrl}/share/${proposal.share_token}`
    const priceFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: proposal.currency || 'USD',
    }).format(proposal.total_price || 0)

    const expiresAt = proposal.expires_at 
      ? new Date(proposal.expires_at).toLocaleDateString('en-US', { dateStyle: 'long' }) 
      : 'in 30 days'

    const subject = isReminder 
      ? `Reminder: Your proposal expires on ${expiresAt}` 
      : `Your proposal from ${session.user.email} is ready`

    const titlePrefix = isReminder ? 'Proposal Reminder' : 'Proposal Ready for Review'
    const bodyText = isReminder 
      ? `This is a friendly reminder that your proposal for the project <span style="color: #000; font-weight: 700;">${proposal.project_title}</span> expires on ${expiresAt}.`
      : `<strong>${userName}</strong> has shared a professional proposal with you for the project: <span style="color: #000; font-weight: 700;">${proposal.project_title}</span>.`

    // 4. Send Email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'ProposalForge <onboarding@resend.dev>', // Use a verified domain in production
      to: proposal.client_email,
      subject: subject,
      text: `Hello ${proposal.client_name},\n\n${userName} has shared a proposal with you: ${proposal.project_title}\n\nView it here: ${shareLink}\n\nPrice: ${priceFormatted}\nExpires: ${expiresAt}\n\nBest regards,\nThe ProposalForge Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
          <h1 style="color: #2563eb; font-size: 24px; font-weight: 800; margin-bottom: 24px;">${titlePrefix}</h1>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Hello <strong>${proposal.client_name}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            ${bodyText}
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <div style="margin-bottom: 16px;">
              <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em;">Total Investment</span>
              <div style="font-size: 28px; font-weight: 800; color: #0f172a;">${priceFormatted}</div>
            </div>
            
            <div style="margin-bottom: 24px;">
              <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em;">Valid Until</span>
              <div style="font-size: 16px; font-weight: 600; color: #334155;">${expiresAt}</div>
            </div>
            
            <a href="${shareLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 8px; text-decoration: none; text-align: center;">
              View & Forge Deal
            </a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Sent via <strong>ProposalForge</strong>. Secure, tracked, and data-backed proposals.
          </p>
        </div>
      `
    })

    if (emailError) {
      console.error('Resend Error:', emailError)
      return NextResponse.json({ message: 'Failed to send email', error: emailError }, { status: 500 })
    }

    // 5. Update status to 'sent'
    const { error: updateError } = await supabase
      .from('proposals')
      .update({ status: 'sent' })
      .eq('id', id)

    if (updateError) {
      console.error('Update Status Error:', updateError)
      // We don't return 500 here because the email was already sent
    }

    return NextResponse.json({ success: true, message: "Email sent", id: emailData?.id })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
