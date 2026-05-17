import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FirstMeetingInvite from './FirstMeetingInvite'

export type InviteScores = {
  score_overall: number
  score_income_structure: number
  score_operational: number
  score_capital: number
  score_risk: number
  score_horizon: number
  score_governance: number
}

export default async function FirstBoardMeetingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('assessments')
    .select('score_overall, score_income_structure, score_operational, score_capital, score_risk, score_horizon, score_governance')
    .eq('user_id', user.id)
    .eq('is_current', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) redirect('/assessment')

  const firstName = (user.user_metadata?.full_name as string | undefined)
    ?.split(' ')[0] ?? null

  return <FirstMeetingInvite scores={data as InviteScores} userName={firstName} />
}
