import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

export async function POST(request: Request) {
  try {
    const { proposalId, amount, proposalTitle, clientEmail } = await request.json()

    if (!proposalId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Create a Stripe Checkout Session
    // This provides the hosted UI the user requested
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Deposit: ${proposalTitle}`,
              description: `50% Upfront Deposit for Proposal #${proposalId.slice(0, 8)}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?proposal_id=${proposalId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/share/${proposalId}`, // This might need the token, but we'll use ID/token logic in the share page
      customer_email: clientEmail,
      payment_intent_data: {
        metadata: {
          proposalId,
          type: 'deposit'
        }
      },
      metadata: {
        proposalId,
        type: 'deposit'
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe Session Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
