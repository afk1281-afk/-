import { createClient } from '@/lib/supabase/server'
import DashboardContent from './DashboardContent'
import type { AssessmentRow } from './DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0]
    ?? null

  let assessment: AssessmentRow | null = null
  if (user) {
    const { data } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_current', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    assessment = data ?? null
  }

  return <DashboardContent userName={userName} assessment={assessment} />
}
