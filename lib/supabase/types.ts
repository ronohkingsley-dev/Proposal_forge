export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'pro' | 'agency'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'agency'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'agency'
          created_at?: string
          updated_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          user_id: string
          client_name: string
          project_title: string
          status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
          total_price: number | null
          currency: string
          content: Json
          share_token: string
          view_count: number
          last_viewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_name: string
          project_title: string
          status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
          total_price?: number | null
          currency?: string
          content?: Json
          share_token?: string
          view_count?: number
          last_viewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_name?: string
          project_title?: string
          status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
          total_price?: number | null
          currency?: string
          content?: Json
          share_token?: string
          view_count?: number
          last_viewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      proposal_views: {
        Row: {
          id: string
          proposal_id: string
          viewer_ip: string | null
          user_agent: string | null
          time_spent_seconds: number
          viewed_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          viewer_ip?: string | null
          user_agent?: string | null
          time_spent_seconds?: number
          viewed_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          viewer_ip?: string | null
          user_agent?: string | null
          time_spent_seconds?: number
          viewed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
