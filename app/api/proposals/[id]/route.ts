import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/proposals/[id]
 * Fetch a single proposal only if owned by the user.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API GET Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * PUT /api/proposals/[id]
 * Update a specific proposal if it belongs to the user and is in an editable state.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Fetch current proposal to verify ownership and status
    const { data: existing, error: fetchError } = await supabase
      .from('proposals')
      .select('status, user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existing || existing.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    // 2. State validation: Only allow 'draft' or 'sent' (and implicitly 'viewed' if we want, 
    // but prompt says only 'draft' or 'sent' - actually prompt says: 
    // "If status is 'signed' or 'expired', return 403" which implies others are okay, 
    // but also says "Only allow update if proposal status is 'draft' or 'sent'".
    // I will strictly follow "Only allow update if status is 'draft' or 'sent'".
    const allowedStatuses = ['draft', 'sent']
    if (!allowedStatuses.includes(existing.status)) {
        if (existing.status === 'signed' || existing.status === 'expired') {
            return NextResponse.json({ error: 'Cannot edit signed or expired proposal' }, { status: 403 })
        }
        // For other statuses (like viewed, accepted, rejected if they exist)
        return NextResponse.json({ error: `Cannot edit proposal with status: ${existing.status}` }, { status: 403 })
    }

    // 3. Parse and validate body
    const body = await request.json()
    const { 
      title, 
      client_name, 
      client_email, 
      scope_summary, 
      complexity, 
      niche, 
      timeline_days, 
      price_cents, 
      deposit_percent 
    } = body

    // 4. Perform update
    const { data, error: updateError } = await supabase
      .from('proposals')
      .update({
        project_title: title,
        client_name: client_name,
        client_email: client_email,
        total_price: price_cents ? price_cents / 100 : 0,
        content: {
          scope_summary,
          complexity,
          niche,
          timeline_days,
          deposit_percent: deposit_percent || 0
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Update Error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json(data)

  } catch (error: any) {
    console.error('API PUT Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
