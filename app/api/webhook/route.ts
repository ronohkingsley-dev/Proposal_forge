import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const proposalId = paymentIntent.metadata.proposalId

        if (proposalId) {
          const supabase = createClient()
          
          const { error } = await supabase
            .from('proposals')
            .update({
              status: 'signed',
              deposit_paid_at: new Date().toISOString(),
              stripe_payment_intent_id: paymentIntent.id
            })
            .eq('id', proposalId)

          if (error) {
            console.error('Database update error in webhook:', error)
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
          }
          
          console.log(`Verified payment for proposal ${proposalId}. Status updated to signed.`)
        }
        break
      
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        // Handle subscription checkout
        if (session.mode === 'subscription' && session.client_reference_id && session.metadata?.plan) {
          const supabase = createClient()
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_tier: session.metadata.plan,
              stripe_customer_id: session.customer as string
            })
            .eq('id', session.client_reference_id)

          if (error) {
            console.error('Database update error for subscription:', error)
            // Still returning 200 below so Stripe doesn't continually retry on a code error
          } else {
            console.log(`Verified checkout session for subscription. User ${session.client_reference_id} updated to plan ${session.metadata.plan}.`)
          }
          break
        }

        // Handle proposal deposit checkout
        const checkoutProposalId = session.metadata?.proposalId

        if (checkoutProposalId) {
          const supabase = createClient()
          
          const { error } = await supabase
            .from('proposals')
            .update({
              status: 'signed',
              deposit_paid_at: new Date().toISOString(),
              stripe_payment_intent_id: session.payment_intent as string
            })
            .eq('id', checkoutProposalId)

          if (error) {
            console.error('Database update error in webhook:', error)
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
          }
          
          console.log(`Verified checkout session for proposal ${checkoutProposalId}. Status updated to signed.`)
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
