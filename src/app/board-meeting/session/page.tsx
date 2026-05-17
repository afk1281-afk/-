import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { calculateScores, rowToFormData } from '@/lib/scoring'
import { buildInsightCards } from '@/lib/insights'
import type { AssessmentRow } from '@/lib/types'
import SessionWizard from './SessionWizard'

export default async function BoardMeetingSessionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: row } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_current', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!row) redirect('/assessment')

  const scores = calculateScores(rowToFormData(row as AssessmentRow))
  const insights = buildInsightCards(scores)

  const firstName = (user.user_metadata?.full_name as string | undefined)
    ?.split(' ')[0] ?? null

  return (
    <SessionWizard
      insights={insights}
      userId={user.id}
      firstName={firstName}
      overallScore={scores.overall}
      axesScores={scores.axes as unknown as Record<string, number>}
    />
  )
}
