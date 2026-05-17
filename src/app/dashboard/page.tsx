import { createClient } from '@/lib/supabase/server'
import DashboardContent from './DashboardContent'
import type { AssessmentRow } from './DashboardContent'
import type { TaskRow } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0]
    ?? null

  let assessment: AssessmentRow | null = null
  let tasks: TaskRow[] = []
  let lastMeeting: { completed_at: string; meeting_number: number } | null = null

  if (user) {
    const [assessmentRes, tasksRes, meetingRes] = await Promise.all([
      supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_current', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('tasks')
        .select('id, title, description, axis, type, status, action_type, action_ref, due_date')
        .eq('user_id', user.id)
        .eq('status', 'open')
        .order('created_at', { ascending: true }),
      supabase
        .from('board_meetings')
        .select('completed_at, meeting_number')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single(),
    ])
    assessment = assessmentRes.data ?? null
    tasks = (tasksRes.data ?? []) as TaskRow[]
    lastMeeting = meetingRes.data ?? null
  }

  return (
    <DashboardContent
      userName={userName}
      assessment={assessment}
      tasks={tasks}
      lastMeeting={lastMeeting}
    />
  )
}
