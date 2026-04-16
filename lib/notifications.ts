import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function sendFreelancerNotification(userId: string, type: 'proposal_viewed' | 'deposit_received' | 'expiration_warning', proposalData: any) {
  try {
    // 1. Fetch user's email and notification settings
    const { data: userAuth, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError || !userAuth.user) throw userError

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('notification_settings, full_name')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    const settings = profile.notification_settings || {}
    
    // Check if notification is enabled for this type
    if (settings[type] === false) {
      return { success: true, message: 'Notification disabled by user' }
    }

    const freelancerEmail = userAuth.user.email
    if (!freelancerEmail) throw new Error('No email found for user')

    let subject = ''
    let html = ''

    if (type === 'proposal_viewed') {
      subject = `Proposal Viewed: ${proposalData.project_title}`
      html = `<p>Hi ${profile.full_name || 'there'},</p>
              <p>Your proposal <strong>${proposalData.project_title}</strong> was just viewed by <strong>${proposalData.client_name}</strong>.</p>
              <p>Log in to your Dashboard to track details.</p>`
    } else if (type === 'deposit_received') {
      subject = `Deposit Received for ${proposalData.project_title}`
      html = `<p>Awesome news!</p>
              <p><strong>${proposalData.client_name}</strong> has signed and paid the deposit for <strong>${proposalData.project_title}</strong>.</p>
              <p>Check your Stripe account for the funds.</p>`
    } else if (type === 'expiration_warning') {
      subject = `Proposal Expiring Soon: ${proposalData.project_title}`
      html = `<p>Just a heads up,</p>
              <p>Your proposal <strong>${proposalData.project_title}</strong> sent to <strong>${proposalData.client_name}</strong> is expiring in 24 hours.</p>
              <p>You might want to send them a quick reminder!</p>`
    }

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'ProposalForge <notifications@resend.dev>', // Should use verified domain
      to: freelancerEmail,
      subject: subject,
      html: html
    })

    if (emailError) throw emailError

    return { success: true, id: emailData?.id }
  } catch (error: any) {
    console.error('Notification Error:', error)
    return { success: false, error: error.message }
  }
}
