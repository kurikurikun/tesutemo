import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zmbvcsowniyrtaleluoc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptYnZjc293bml5cnRhbGVsdW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDUyNzUsImV4cCI6MjA4OTQ4MTI3NX0.82NhpISN0nt9tL9NKsEC0Bnra0IWqI9QXuOk1UtL3BE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export type LiteClient = {
  id: string
  name: string
  org_name: string
  email: string
  phone: string | null
  use_case: string
  created_at: string
}

export type LiteCampaign = {
  id: string
  client_id: string
  name: string
  questions: string[]
  created_at: string
}

export type LiteVideo = {
  id: string
  campaign_id: string
  session_id: string
  respondent_name: string | null
  question_index: number
  storage_path: string
  created_at: string
}
