import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zmbvcsowniyrtaleluoc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptYnZjc293bml5cnRhbGVsdW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDUyNzUsImV4cCI6MjA4OTQ4MTI3NX0.82NhpISN0nt9tL9NKsEC0Bnra0IWqI9QXuOk1UtL3BE'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Get all campaigns for this client
    const { data: campaigns } = await supabase
      .from('lite_campaigns')
      .select('id')
      .eq('client_id', params.id)

    if (campaigns && campaigns.length > 0) {
      const campaignIds = campaigns.map(c => c.id)

      // Get all video storage paths
      const { data: videos } = await supabase
        .from('lite_videos')
        .select('storage_path')
        .in('campaign_id', campaignIds)

      // Delete from storage
      if (videos && videos.length > 0) {
        await supabase.storage
          .from('tesutemo-lite-videos')
          .remove(videos.map(v => v.storage_path))
      }

      // Delete videos from DB
      await supabase.from('lite_videos').delete().in('campaign_id', campaignIds)

      // Delete campaigns
      await supabase.from('lite_campaigns').delete().eq('client_id', params.id)
    }

    // Delete client
    const { error } = await supabase
      .from('lite_clients')
      .delete()
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
