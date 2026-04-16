import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch clients and their proposals count + last proposal date
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*, proposals(id, created_at)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (clientsError) throw clientsError

    const mappedClients = clients.map((client: any) => {
      const proposals = client.proposals || []
      const lastProposal = proposals.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
      
      return {
        ...client,
        proposal_count: proposals.length,
        last_proposal_date: lastProposal ? lastProposal.created_at : null
      }
    })

    return NextResponse.json(mappedClients)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, email, company, phone, notes } = await req.json()
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: session.user.id,
        name,
        email,
        company,
        phone,
        notes
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
