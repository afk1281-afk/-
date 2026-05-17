'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { calculateScores, rowToFormData } from '@/lib/scoring'
import type { AssessmentRow, TaskRow } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

export type { AssessmentRow }

// ── DESIGN TOKENS ────────────────────────────────────────────
const C = {
  bg:         '#F0F4FA',
  bgCard:     '#FFFFFF',
  border:     '#DDE4EF',
  borderSoft: '#E8EEF8',
  ink:        '#0F1923',
  inkSoft:    '#4A5A6E',
  inkMute:    '#8A9AAB',
  blue:       '#1B5FAD',
  blueSoft:   '#2A75CC',
  blueDark:   '#0D3D75',
  orange:     '#E8521A',
  orangeSoft: '#FF6A30',
  amber:      '#D97706',
  rust:       '#DC2626',
}

const font = 'var(--font-rubik)'

const AXIS_LABELS: Record<string, string> = {
  incomeStructure: 'מבנה הכנסה',
  operational:     'יעילות תפעולית',
  capital:         'הקצאת הון',
  risk:            'ניהול סיכון',
  horizon:         'אופק פנסיוני',
  governance:      'ממשל פנימי',
}

const AXIS_COLORS: Record<string, string> = {
  incomeStructure: '#1B5FAD',
  operational:     '#E8521A',
  capital:         '#D97706',
  risk:            '#1B5FAD',
  horizon:         '#E8521A',
  governance:      '#1B5FAD',
}

// ── SCORE ARC ────────────────────────────────────────────────
const ScoreArc = ({ score = 71 }: { score: number }) => {
  const r = 54, cx = 70, cy = 70
  const circ = 2 * Math.PI * r
  const dashArr = circ * 0.75
  const filled  = dashArr * (score / 100)
  const empty   = dashArr - filled
  const rotate  = -225

  const color = score >= 80 ? C.blue : score >= 60 ? C.orange : C.rust

  return (
    <svg width="140" height="110" viewBox="0 0 140 110">
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color}/>
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="10"
        strokeDasharray={`${dashArr} ${circ}`} strokeDashoffset={0}
        strokeLinecap="round"
        transform={`rotate(${rotate} ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#arcGrad)" strokeWidth="10"
        strokeDasharray={`${filled} ${empty + circ * 0.25}`} strokeDashoffset={0}
        strokeLinecap="round"
        transform={`rotate(${rotate} ${cx} ${cy})`}/>
      <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
        fontFamily={font} fontSize="30" fontWeight="700" fill="#FFFFFF">{score}</text>
      <text x={cx} y={cy + 24} textAnchor="middle"
        fontFamily={font} fontSize="11" fill="rgba(255,255,255,0.65)">מתוך 100</text>
    </svg>
  )
}

// ── CHATBOT PANEL ────────────────────────────────────────────
type Msg = { role: 'bot' | 'user'; text: string }

const ChatBot = ({ onClose }: { onClose: () => void }) => {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'bot', text: 'שלום! אני היועץ הפיננסי הדיגיטלי שלך 👋\nאני כאן כדי לעזור לך להבין את המצב הפיננסי שלך ולענות על שאלות. במה אוכל לעזור?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const quickQ = ['מה הציון שלי אומר?', 'איך לשפר את התזרים?', 'מה זה Wealth Mapping?']

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Msg = { role: 'user', text }
    setMsgs(m => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...msgs, userMsg].map(m => ({
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: m.text
          }))
        })
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'bot', text: data.text ?? 'סליחה, לא הצלחתי להבין. אפשר לנסות שוב?' }])
    } catch {
      setMsgs(m => [...m, { role: 'bot', text: 'אופס, יש בעיה טכנית זמנית. נסה שוב בעוד רגע.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,25,35,0.55)',
      zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.bgCard, borderRadius: '20px 20px 0 0',
        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 32px rgba(27,95,173,0.18)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px 12px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 18
          }}>💬</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: font, fontWeight: 700, color: C.ink, fontSize: 15 }}>יועץ פיננסי דיגיטלי</div>
            <div style={{ fontFamily: font, fontSize: 12, color: C.blue, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }}/>
              מחובר ומוכן לעזור
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 20, cursor: 'pointer',
            color: C.inkMute, padding: 4, lineHeight: 1
          }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '16px',
          display: 'flex', flexDirection: 'column', gap: 12, minHeight: 200
        }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-start' : 'flex-end' }}>
              <div style={{
                maxWidth: '80%', padding: '10px 14px',
                borderRadius: m.role === 'user' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                background: m.role === 'user' ? C.blue : C.bg,
                color: m.role === 'user' ? '#fff' : C.ink,
                fontFamily: font, fontSize: 14, lineHeight: 1.6,
                whiteSpace: 'pre-wrap', direction: 'rtl'
              }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ padding: '10px 16px', background: C.bg, borderRadius: '16px 4px 16px 16px', display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: '50%', background: C.blue,
                    display: 'inline-block',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
                  }}/>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick questions */}
        {msgs.length <= 1 && (
          <div style={{ padding: '0 16px 10px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {quickQ.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} style={{
                background: '#1B5FAD12', border: `1px solid ${C.border}`,
                borderRadius: 20, padding: '6px 12px',
                fontFamily: font, fontSize: 12, color: C.blue,
                cursor: 'pointer', whiteSpace: 'nowrap'
              }}>{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          padding: '10px 16px 24px', borderTop: `1px solid ${C.border}`,
          display: 'flex', gap: 10, alignItems: 'center'
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="שאל/י שאלה..."
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 12, direction: 'rtl',
              border: `1px solid ${C.border}`, background: C.bg,
              fontFamily: font, fontSize: 14, color: C.ink, outline: 'none'
            }}
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{
            width: 42, height: 42, borderRadius: '50%',
            background: input.trim() ? C.blue : C.border,
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.2s'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9"/>
            </svg>
          </button>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  )
}

// ── PROPS ─────────────────────────────────────────────────────
type Props = {
  userName?: string | null
  assessment?: AssessmentRow | null
  tasks?: TaskRow[]
  lastMeeting?: { completed_at: string; meeting_number: number } | null
}

// ── MAIN ─────────────────────────────────────────────────────
export default function DashboardContent({ userName, assessment, tasks = [], lastMeeting = null }: Props) {
  const [chatOpen, setChatOpen] = useState(false)
  const [greeting, setGreeting] = useState('שלום')
  const [visible, setVisible]   = useState(false)
  const [doneIds, setDoneIds]   = useState<Set<string>>(new Set())

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting('בוקר טוב')
    else if (h < 17) setGreeting('צהריים טובים')
    else setGreeting('ערב טוב')
    setTimeout(() => setVisible(true), 80)
  }, [])

  const scores = assessment ? calculateScores(rowToFormData(assessment)) : null
  const score = scores?.overall ?? 0
  const scoreLabel = score >= 80 ? 'מצוין' : score >= 65 ? 'טוב' : score >= 40 ? 'דורש תשומת לב' : score > 0 ? 'דורש פעולה מיידית' : '—'

  const axes = scores ? [
    { label: 'מבנה הכנסה',     val: scores.axes.incomeStructure, color: C.blue },
    { label: 'יעילות תפעולית', val: scores.axes.operational,     color: C.orange },
    { label: 'הקצאת הון',      val: scores.axes.capital,         color: C.amber },
    { label: 'ניהול סיכון',    val: scores.axes.risk,            color: C.blue },
    { label: 'אופק פנסיוני',   val: scores.axes.horizon,         color: C.orange },
    { label: 'ממשל פנימי',     val: scores.axes.governance,      color: C.blue },
  ] : []

  const weakAxes = axes.filter(a => a.val < 60).length

  const alerts = scores ? [
    scores.axes.risk < 75 && { emoji: '⚠️', text: 'כיסוי ביטוחי חלקי — כדאי לבדוק' },
    scores.metrics.savingsRate > 0.1 && { emoji: '📈', text: `שיעור החיסכון שלך: ${Math.round(scores.metrics.savingsRate * 100)}% — טוב!` },
    scores.metrics.monthsOfSurvival < 3 && { emoji: '🚨', text: 'קרן חירום נמוכה — פחות מ-3 חודשי הוצאות' },
    scores.axes.capital >= 40 && { emoji: '🛡️', text: 'קרן ההשתלמות שלך נזילה — הזדמנות להשקעה' },
  ].filter((a): a is { emoji: string; text: string } => Boolean(a)) : []

  const openTasks = tasks.filter(t => !doneIds.has(t.id))

  const markDone = async (taskId: string) => {
    setDoneIds(prev => new Set([...prev, taskId]))
    const supabase = createClient()
    await supabase.from('tasks').update({ status: 'done', completed_at: new Date().toISOString() }).eq('id', taskId)
  }

  const meetingDueMs = lastMeeting
    ? new Date(lastMeeting.completed_at).getTime() + 30 * 24 * 60 * 60 * 1000
    : null
  const daysUntil = meetingDueMs !== null
    ? Math.ceil((meetingDueMs - Date.now()) / (24 * 60 * 60 * 1000))
    : null
  const isFirst = !lastMeeting
  const isDue   = !isFirst && (daysUntil ?? 0) <= 0

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  })

  const displayName = userName ?? 'שלום'

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, fontFamily: font,
      direction: 'rtl', display: 'flex', flexDirection: 'column',
      maxWidth: 480, margin: '0 auto', position: 'relative', overflowX: 'hidden'
    }}>
      <TopBar />

      {/* ── HEADER ── */}
      <div style={{
        ...fade(0),
        marginTop: 56,
        padding: '24px 20px 24px',
        background: `linear-gradient(175deg, ${C.blue} 0%, ${C.blueDark} 100%)`,
        borderRadius: '0 0 28px 28px',
        boxShadow: '0 8px 28px rgba(27,95,173,0.28)'
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontFamily: font, fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.3 }}>
              {greeting},
            </p>
            <h1 style={{ margin: '2px 0 0', fontFamily: font, fontSize: 26, color: '#FFFFFF', fontWeight: 700 }}>
              {displayName} 👋
            </h1>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '6px 12px',
            fontFamily: font, fontSize: 12, color: 'rgba(255,255,255,0.75)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            מאי 2026
          </div>
        </div>

        {/* Score card */}
        <div style={{
          background: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: '14px 20px',
          border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <ScoreArc score={score}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: font, fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>
              ציון מערכת ההפעלה
            </div>
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: 20,
              background: score >= 80 ? C.blue : score >= 65 ? C.orange : C.rust,
              fontFamily: font, fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 10,
              border: '2px solid rgba(255,255,255,0.25)'
            }}>
              {scoreLabel}
            </div>
            <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 14, opacity: s <= 3.5 ? 1 : 0.3 }}>★</span>
              ))}
            </div>
            <p style={{ margin: 0, fontFamily: font, fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              {weakAxes > 0 ? `${weakAxes} צירים דורשים תשומת לב` : 'כל הצירים תקינים'}
            </p>
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{ flex: 1, padding: '20px 16px 100px' }}>

        {/* BOARD MEETING CARD */}
        <div style={{ ...fade(80), marginBottom: 16 }}>
          <div style={{
            background: (isFirst || isDue)
              ? `linear-gradient(135deg, ${C.orange} 0%, #C0400F 100%)`
              : `linear-gradient(135deg, ${C.blue} 0%, ${C.blueDark} 100%)`,
            borderRadius: 18, padding: '18px 20px',
            boxShadow: (isFirst || isDue)
              ? '0 6px 24px rgba(232,82,26,0.30)'
              : '0 6px 24px rgba(27,95,173,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 26 }}>🏛️</span>
                <div>
                  <div style={{ fontFamily: font, fontWeight: 700, fontSize: 16, color: '#fff' }}>ישיבת דירקטוריון</div>
                  <div style={{ fontFamily: font, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                    {isFirst ? 'ראשונה' : `ישיבה מס׳ ${(lastMeeting?.meeting_number ?? 0) + 1}`}
                  </div>
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '4px 10px',
                fontFamily: font, fontSize: 11, fontWeight: 700, color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)', whiteSpace: 'nowrap'
              }}>
                {isFirst ? '⚡ חדש' : isDue ? '⚡ הגיע הזמן' : `בעוד ${daysUntil} ימים`}
              </div>
            </div>
            <p style={{ margin: '0 0 14px', fontFamily: font, fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
              {isFirst
                ? 'ישיבה של 20 דקות שתגלה מה לתקן ואיך — צעד ראשון וצעד שני ברורים.'
                : isDue
                  ? 'הגיע הזמן לישיבה החודשית — עדכנו תובנות ובנו 2–3 משימות חדשות.'
                  : 'הישיבה הבאה מתוכננת — תזכורת תגיע כשיגיע הזמן.'
              }
            </p>
            {(isFirst || isDue) && (
              <a href="/board-meeting/session" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: 12, padding: '10px 18px',
                fontFamily: font, fontWeight: 700, fontSize: 14, color: '#fff',
                textDecoration: 'none'
              }}>
                {isFirst ? 'התחל את הישיבה הראשונה' : 'פתח ישיבה עכשיו'} →
              </a>
            )}
          </div>
        </div>

        {/* TASKS */}
        {openTasks.length > 0 && (
          <div style={{ ...fade(200), marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontFamily: font, fontSize: 17, color: C.ink, fontWeight: 700 }}>
                המשימות שלכם
              </h2>
              <span style={{
                background: C.orange, borderRadius: 20, padding: '2px 10px',
                fontFamily: font, fontSize: 12, fontWeight: 700, color: '#fff'
              }}>{openTasks.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {openTasks.map((task, i) => (
                <div key={task.id} style={{
                  ...fade(220 + i * 40),
                  background: C.bgCard, borderRadius: 14, padding: '14px',
                  border: `1px solid ${C.border}`,
                  boxShadow: '0 2px 8px rgba(27,95,173,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {task.axis && (
                        <span style={{
                          background: `${AXIS_COLORS[task.axis] ?? C.blue}22`,
                          color: AXIS_COLORS[task.axis] ?? C.blue,
                          borderRadius: 8, padding: '2px 8px',
                          fontFamily: font, fontSize: 11, fontWeight: 600
                        }}>
                          {AXIS_LABELS[task.axis] ?? task.axis}
                        </span>
                      )}
                      <span style={{ fontSize: 13 }}>{task.action_type === 'article' ? '🔄' : '📞'}</span>
                    </div>
                    <button onClick={() => markDone(task.id)} style={{
                      background: 'none', border: `1px solid ${C.border}`,
                      borderRadius: 8, padding: '3px 10px',
                      fontFamily: font, fontSize: 11, color: C.inkMute,
                      cursor: 'pointer'
                    }}>✓ סיימתי</button>
                  </div>
                  <p style={{ margin: '0 0 10px', fontFamily: font, fontSize: 14, color: C.ink, fontWeight: 600, lineHeight: 1.4 }}>
                    {task.title}
                  </p>
                  {task.action_type === 'article' && task.action_ref ? (
                    <a href={`/learn/${task.action_ref}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: `${C.blue}12`, border: `1px solid ${C.blue}30`,
                      borderRadius: 10, padding: '7px 14px',
                      fontFamily: font, fontSize: 13, fontWeight: 600, color: C.blue,
                      textDecoration: 'none'
                    }}>📖 קרא מאמר ›</a>
                  ) : task.action_type === 'vip' ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: `${C.orange}12`, border: `1px solid ${C.orange}30`,
                      borderRadius: 10, padding: '7px 14px',
                      fontFamily: font, fontSize: 13, fontWeight: 600, color: C.orange
                    }}>📞 צרו קשר עם הסוכנות</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AXES GRID */}
        <div style={{ ...fade(420), marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontFamily: font, fontSize: 17, color: C.ink, fontWeight: 700 }}>
              6 צירי הבריאות הפיננסית
            </h2>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: font, fontSize: 12, color: C.blue,
              display: 'flex', alignItems: 'center', gap: 4, padding: 0, fontWeight: 600
            }}>
              פירוט מלא ›
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {axes.map((a, i) => (
              <div key={i} style={{
                ...fade(440 + i * 40),
                background: C.bgCard, borderRadius: 14, padding: '12px 10px',
                border: `1px solid ${C.border}`,
                boxShadow: '0 2px 8px rgba(27,95,173,0.05)',
                textAlign: 'center'
              }}>
                <div style={{ position: 'relative', height: 5, background: C.border, borderRadius: 3, marginBottom: 8 }}>
                  <div style={{
                    position: 'absolute', right: 0, top: 0, height: 5,
                    width: `${a.val}%`, background: a.color, borderRadius: 3,
                    transition: 'width 0.8s ease'
                  }}/>
                </div>
                <div style={{ fontFamily: font, fontWeight: 700, fontSize: 16, color: a.color, marginBottom: 2 }}>
                  {a.val}
                </div>
                <div style={{ fontFamily: font, fontSize: 10, color: C.inkMute, lineHeight: 1.3 }}>
                  {a.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALERTS */}
        <div style={{ ...fade(700), marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 12px', fontFamily: font, fontSize: 17, color: C.ink, fontWeight: 700 }}>
            תובנות חשובות עבורך
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{
                ...fade(720 + i * 50),
                background: C.bgCard, borderRadius: 14, padding: '13px 14px',
                border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: '0 2px 8px rgba(27,95,173,0.04)'
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{a.emoji}</span>
                <p style={{ margin: 0, fontFamily: font, fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>
                  {a.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CHATBOT CTA */}
        <div style={{ ...fade(850), marginBottom: 16 }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueDark} 100%)`,
            borderRadius: 18, padding: '20px', position: 'relative', overflow: 'hidden',
            boxShadow: '0 6px 24px rgba(27,95,173,0.28)'
          }}>
            <div style={{
              position: 'absolute', left: -20, top: -20,
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)'
            }}/>
            <div style={{
              position: 'absolute', left: 20, bottom: -30,
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(232,82,26,0.15)'
            }}/>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>💬</div>
                <div>
                  <div style={{ fontFamily: font, fontWeight: 700, color: '#fff', fontSize: 15 }}>יועץ פיננסי דיגיטלי</div>
                  <div style={{ fontFamily: font, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>מבוסס AI • זמין 24/7</div>
                </div>
              </div>
              <p style={{ margin: '0 0 16px', fontFamily: font, fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                שאל אותי על הציון שלך, על הצירים, או כל דבר שקשור לניהול פיננסי חכם.
              </p>
              <button onClick={() => setChatOpen(true)} style={{
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 12, padding: '10px 20px', cursor: 'pointer',
                fontFamily: font, fontWeight: 600, fontSize: 14, color: '#fff',
                display: 'flex', alignItems: 'center', gap: 8,
                backdropFilter: 'blur(8px)'
              }}>
                💬 פתח שיחה עכשיו
              </button>
            </div>
          </div>
        </div>

        {/* WEALTH MAPPING TEASER */}
        <div style={{ ...fade(950) }}>
          <div style={{
            background: C.bgCard, borderRadius: 14, padding: '14px 16px',
            border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 2px 8px rgba(27,95,173,0.06)'
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>📞</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: font, fontWeight: 700, fontSize: 13, color: C.ink }}>
                שיחת VIP Wealth Mapping
              </div>
              <p style={{ margin: '2px 0 0', fontFamily: font, fontSize: 11, color: C.inkMute, lineHeight: 1.5 }}>
                קבל תכנית פעולה אישית עם יועץ מסוכנות 360
              </p>
            </div>
            <button style={{
              background: C.orange, border: 'none', borderRadius: 10, padding: '7px 14px',
              fontFamily: font, fontWeight: 700, fontSize: 12, color: '#fff',
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
            }}>
              קבע עכשיו
            </button>
          </div>
        </div>

      </div>

      <BottomNav />

      {chatOpen && <ChatBot onClose={() => setChatOpen(false)}/>}
    </div>
  )
}
