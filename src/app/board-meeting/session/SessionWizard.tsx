'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { InsightCard, ActionOption } from '@/lib/insights'

// ── Design tokens ─────────────────────────────────────────────
const C = {
  bg:       '#F0F4FA',
  bgCard:   '#FFFFFF',
  border:   '#DDE4EF',
  ink:      '#0F1923',
  inkSoft:  '#4A5A6E',
  inkMute:  '#8A9AAB',
  blue:     '#1B5FAD',
  blueDark: '#0D3D75',
  orange:   '#E8521A',
}
const font = 'var(--font-rubik)'

// ── Welcome screen ────────────────────────────────────────────
function WelcomeScreen({
  firstName, insightCount, onStart,
}: { firstName: string | null; insightCount: number; onStart: () => void }) {
  return (
    <div style={{ padding: '40px 20px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ fontSize: 60, marginBottom: 20, lineHeight: 1 }}>🏛️</div>
      <h1 style={{ fontFamily: font, fontSize: 24, fontWeight: 700, color: C.ink, margin: '0 0 10px', lineHeight: 1.25 }}>
        {firstName ? `${firstName}, ` : ''}ברוכים הבאים<br />לישיבת הדירקטוריון
      </h1>
      <p style={{ fontFamily: font, fontSize: 14, color: C.inkSoft, lineHeight: 1.75, margin: '0 0 28px', maxWidth: 300 }}>
        נסקור יחד {insightCount} ממצאים מהאבחון<br />
        ונבנה תוכנית פעולה לחודש הקרוב.
      </p>

      <div style={{ width: '100%', background: C.bgCard, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 28, overflow: 'hidden' }}>
        {[
          { icon: '🎯', text: '2-3 פעולות קלות בלבד — לא מציפים אתכם' },
          { icon: '📋', text: 'הפרוטוקול נשמר ומחכה לישיבה הבאה' },
          { icon: '⏱️', text: 'בערך 15-20 דקות' },
        ].map((item, i, arr) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 18px',
            borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ fontFamily: font, fontSize: 14, color: C.inkSoft, textAlign: 'right' }}>{item.text}</span>
          </div>
        ))}
      </div>

      <button onClick={onStart} style={{
        width: '100%', padding: '17px 24px',
        background: C.orange, border: 'none', borderRadius: 14,
        fontFamily: font, fontWeight: 700, fontSize: 17, color: '#fff',
        cursor: 'pointer', boxShadow: '0 6px 22px rgba(232,82,26,0.32)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        בואו נתחיל
        <span style={{ fontSize: 18 }}>→</span>
      </button>
    </div>
  )
}

// ── Single insight step ───────────────────────────────────────
function InsightStep({
  insight, stepNum, totalSteps, choice, onChoose, onNext,
}: {
  insight: InsightCard
  stepNum: number
  totalSteps: number
  choice: ActionOption | null
  onChoose: (a: ActionOption) => void
  onNext: () => void
}) {
  const scoreColor = insight.score >= 70 ? C.blue : insight.score >= 40 ? C.orange : '#DC2626'
  const scoreBg   = insight.score >= 70 ? '#1B5FAD12' : insight.score >= 40 ? '#E8521A12' : '#DC262612'

  return (
    <div style={{ padding: '0 16px 48px' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <span style={{ fontFamily: font, fontSize: 12, color: C.inkMute }}>
          ממצא {stepNum} מתוך {totalSteps}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} style={{
              height: 8, borderRadius: 4,
              width: i < stepNum ? 24 : 8,
              background: i < stepNum ? C.blue : C.border,
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Axis badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: scoreBg, border: `1px solid ${scoreColor}35`,
        borderRadius: 24, padding: '6px 14px', marginBottom: 16,
      }}>
        <span style={{ fontSize: 16 }}>{insight.emoji}</span>
        <span style={{ fontFamily: font, fontWeight: 600, fontSize: 13, color: scoreColor }}>{insight.axisLabel}</span>
        <span style={{
          background: scoreColor, color: '#fff', borderRadius: 10,
          padding: '1px 7px', fontFamily: font, fontSize: 12, fontWeight: 700,
        }}>{insight.score}</span>
      </div>

      {/* Title */}
      <h2 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.ink, margin: '0 0 14px', lineHeight: 1.3 }}>
        {insight.title}
      </h2>

      {/* Body */}
      <p style={{ fontFamily: font, fontSize: 14, color: C.inkSoft, lineHeight: 1.8, margin: '0 0 28px' }}>
        {insight.body}
      </p>

      {/* Action selector */}
      <div style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 12 }}>
        מה תרצו לעשות עם זה?
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {insight.actions.map((action, i) => {
          const selected = choice?.type === action.type
          return (
            <button key={i} onClick={() => onChoose(action)} style={{
              padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'right',
              border: `2px solid ${selected ? C.blue : C.border}`,
              background: selected ? `${C.blue}0D` : C.bgCard,
              display: 'flex', alignItems: 'center', gap: 12,
              transition: 'all 0.15s',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: font, fontWeight: 700, fontSize: 14, color: selected ? C.blue : C.ink, marginBottom: action.description ? 3 : 0 }}>
                  {action.label}
                </div>
                {action.description && (
                  <div style={{ fontFamily: font, fontSize: 12, color: C.inkMute, lineHeight: 1.5 }}>
                    {action.description}
                  </div>
                )}
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${selected ? C.blue : C.border}`,
                background: selected ? C.blue : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {selected && <span style={{ color: '#fff', fontSize: 12, lineHeight: 1 }}>✓</span>}
              </div>
            </button>
          )
        })}
      </div>

      {/* Continue */}
      <button onClick={onNext} disabled={!choice} style={{
        width: '100%', padding: '17px 24px',
        background: choice ? C.blue : C.border,
        border: 'none', borderRadius: 14,
        fontFamily: font, fontWeight: 700, fontSize: 16,
        color: choice ? '#fff' : C.inkMute,
        cursor: choice ? 'pointer' : 'not-allowed',
        transition: 'background 0.2s',
      }}>
        המשך
      </button>
    </div>
  )
}

// ── Summary screen ────────────────────────────────────────────
function SummaryScreen({
  insights, choices, saving, onFinish,
}: {
  insights: InsightCard[]
  choices: (ActionOption | null)[]
  saving: boolean
  onFinish: () => void
}) {
  const tasks = insights
    .map((ins, i) => ({ ins, choice: choices[i] }))
    .filter(({ choice }) => choice && choice.type !== 'none')

  return (
    <div style={{ padding: '32px 16px 48px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 52, marginBottom: 14, lineHeight: 1 }}>✅</div>
        <h2 style={{ fontFamily: font, fontSize: 22, fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>
          תוכנית הפעולה שלכם
        </h2>
        <p style={{ fontFamily: font, fontSize: 14, color: C.inkSoft, margin: 0 }}>
          {tasks.length > 0
            ? `${tasks.length} ${tasks.length === 1 ? 'פעולה' : 'פעולות'} לחודש הקרוב`
            : 'ישיבה ראשונה הושלמה'}
        </p>
      </div>

      {tasks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {tasks.map(({ ins, choice }, i) => (
            <div key={i} style={{
              background: C.bgCard, borderRadius: 14, padding: '16px',
              border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: `${C.blue}14`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: font, fontWeight: 700, fontSize: 15, color: C.blue,
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: font, fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 2 }}>
                  {choice!.type === 'article'
                    ? choice!.description
                    : 'קבע שיחת VIP עם סוכנות 360'}
                </div>
                <div style={{ fontFamily: font, fontSize: 12, color: C.inkMute }}>
                  {ins.axisLabel} · {choice!.type === 'article' ? 'קריאה' : 'שיחה'}
                </div>
              </div>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{ins.emoji}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: C.bgCard, borderRadius: 14, padding: '20px',
          border: `1px solid ${C.border}`, textAlign: 'center', marginBottom: 24,
        }}>
          <p style={{ fontFamily: font, fontSize: 14, color: C.inkSoft, lineHeight: 1.75, margin: 0 }}>
            לא בחרתם פעולות הפעם — לא נורא.<br />
            הישיבה הבאה תהיה כאן כשתהיו מוכנים.
          </p>
        </div>
      )}

      <div style={{
        background: `${C.blue}0A`, borderRadius: 12, padding: '14px 18px',
        border: `1px solid ${C.blue}22`, marginBottom: 24, textAlign: 'center',
      }}>
        <p style={{ fontFamily: font, fontSize: 13, color: C.blue, margin: 0, lineHeight: 1.6 }}>
          📋 הפרוטוקול נשמר ויחכה לכם בישיבה הבאה
        </p>
      </div>

      <button onClick={onFinish} disabled={saving} style={{
        width: '100%', padding: '17px 24px',
        background: saving ? C.border : C.orange,
        border: 'none', borderRadius: 14,
        fontFamily: font, fontWeight: 700, fontSize: 17,
        color: saving ? C.inkMute : '#fff',
        cursor: saving ? 'not-allowed' : 'pointer',
        boxShadow: saving ? 'none' : '0 6px 22px rgba(232,82,26,0.32)',
        transition: 'all 0.2s',
      }}>
        {saving ? 'שומר...' : 'סיום הישיבה ›'}
      </button>
    </div>
  )
}

// ── Main wizard ───────────────────────────────────────────────
type Step = 'welcome' | number | 'summary'

type Props = {
  insights: InsightCard[]
  userId: string
  firstName: string | null
  overallScore: number
  axesScores: Record<string, number>
}

export default function SessionWizard({
  insights, userId, firstName, overallScore, axesScores,
}: Props) {
  const router = useRouter()
  const startedAt = useRef(new Date().toISOString())
  const [step, setStep]     = useState<Step>('welcome')
  const [choices, setChoices] = useState<(ActionOption | null)[]>(
    new Array(insights.length).fill(null)
  )
  const [saving, setSaving] = useState(false)

  function advance() {
    if (step === 'welcome') {
      setStep(insights.length > 0 ? 0 : 'summary')
    } else if (typeof step === 'number') {
      setStep(step + 1 < insights.length ? step + 1 : 'summary')
    }
  }

  function setChoice(idx: number, action: ActionOption) {
    setChoices(prev => { const next = [...prev]; next[idx] = action; return next })
  }

  async function handleFinish() {
    setSaving(true)
    try {
      const supabase = createClient()
      const now       = new Date().toISOString()
      const dueDate   = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0]

      // 1 — board meeting record
      const { data: meeting, error: meetingErr } = await supabase
        .from('board_meetings')
        .insert({
          user_id: userId, type: 'first', status: 'completed',
          meeting_number: 1, score_at_meeting: overallScore,
          started_at: startedAt.current, completed_at: now,
        })
        .select('id')
        .single()

      if (meetingErr || !meeting) throw new Error(meetingErr?.message)

      // 2 — tasks (skip 'none' choices)
      const tasksToInsert = insights
        .map((ins, i) => ({ ins, choice: choices[i] }))
        .filter(({ choice }) => choice && choice.type !== 'none')
        .map(({ ins, choice }) => ({
          user_id:     userId,
          meeting_id:  meeting.id,
          title:       choice!.type === 'article'
            ? `קרא מאמר: ${choice!.description}`
            : 'קבע שיחת VIP עם סוכנות 360',
          axis:        ins.axis,
          type:        choice!.type === 'article' ? 'auto' : 'manual',
          action_type: choice!.type,
          action_ref:  choice!.ref ?? null,
          due_date:    dueDate,
        }))

      if (tasksToInsert.length > 0) {
        await supabase.from('tasks').insert(tasksToInsert)
      }

      // 3 — protocol
      await supabase.from('meeting_protocols').insert({
        meeting_id:    meeting.id,
        user_id:       userId,
        overall_score: overallScore,
        axes_scores:   axesScores,
        tasks_created: tasksToInsert,
        summary_text:  `ישיבה ראשונה. ציון כללי: ${overallScore}. ${tasksToInsert.length} משימות נבחרו.`,
      })

      router.push('/dashboard')
    } catch {
      setSaving(false)
    }
  }

  const stepNum = typeof step === 'number' ? step : 0

  return (
    <main style={{
      minHeight: '100vh', background: C.bg,
      fontFamily: font, direction: 'rtl',
      maxWidth: 480, margin: '0 auto',
    }}>
      {/* Top bar */}
      <div style={{
        background: `linear-gradient(90deg, ${C.blue} 0%, ${C.blueDark} 100%)`,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontSize: 18 }}>🏛️</span>
        <span style={{ fontFamily: font, fontWeight: 700, fontSize: 14, color: '#fff', flex: 1 }}>
          ישיבת דירקטוריון ראשונה
        </span>
        {typeof step === 'number' && insights.length > 0 && (
          <div style={{ display: 'flex', gap: 5 }}>
            {insights.map((_, i) => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i <= stepNum
                  ? 'rgba(255,255,255,0.9)'
                  : 'rgba(255,255,255,0.3)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Screens */}
      {step === 'welcome' && (
        <WelcomeScreen
          firstName={firstName}
          insightCount={insights.length}
          onStart={advance}
        />
      )}

      {typeof step === 'number' && (
        <InsightStep
          insight={insights[step]}
          stepNum={step + 1}
          totalSteps={insights.length}
          choice={choices[step]}
          onChoose={(a) => setChoice(step, a)}
          onNext={advance}
        />
      )}

      {step === 'summary' && (
        <SummaryScreen
          insights={insights}
          choices={choices}
          saving={saving}
          onFinish={handleFinish}
        />
      )}
    </main>
  )
}
