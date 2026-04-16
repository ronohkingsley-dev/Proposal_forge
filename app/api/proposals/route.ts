import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // 1. Get Session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse Body
    const body = await request.json()
    const { 
      project_title, 
      client_name, 
      client_email, 
      client_id,
      total_price,
      content
    } = body

    // Simple validation
    if (!project_title || !client_email || !client_name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    let finalClientId = client_id

    // If client_id is not provided or is 'new', we should create a new client first
    if (!finalClientId || finalClientId === 'new') {
      // check if client with this email exists for this user
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('email', client_email)
        .single()
        
      if (existingClient) {
        finalClientId = existingClient.id
      } else {
        const { data: newClient, error: newClientError } = await supabase
          .from('clients')
          .insert({
            user_id: session.user.id,
            name: client_name,
            email: client_email
          })
          .select('id')
          .single()
          
        if (newClientError) throw newClientError
        finalClientId = newClient.id
      }
    }

    // 3. Get Expiration settings
    const { data: profile } = await supabase
      .from('profiles')
      .select('default_expiration_days')
      .eq('id', session.user.id)
      .single()

    const expiryDays = profile?.default_expiration_days || 30
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiryDays)

    // 4. Generate Token
    const share_token = crypto.randomUUID()

    // 4. Insert into DB
    const { data, error } = await supabase
      .from('proposals')
      .insert({
        user_id: session.user.id,
        project_title: project_title,
        client_name: client_name,
        client_email: client_email,
        client_id: finalClientId,
        status: 'draft',
        total_price: total_price,
        share_token: share_token,
        content: content,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database Error:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('proposals')
      .select('*, client_email')
      .filter('user_id', 'eq', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ message: 'Method not implemented' }, { status: 501 })
  }
}
