import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // App will run in offline mode without Supabase
  if (process.env.NODE_ENV === 'development') {
    console.warn('Missing Supabase environment variables. App will run in offline mode.')
  }
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      templates: {
        Row: {
          id: string
          name: string
          content: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          content: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          content?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
