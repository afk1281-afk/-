'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { InviteScores } from './page'

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

const AXES = [
  { key: 'score_income_structure' as const, label: 'מבנה הכנסה' },
  { key: 'score_operational'      as const, label: 'יעילות תפעולית' },
  { key: 'score_capital'          as const, label: 'הקצאת הון' },
  { key: 'score_risk'             as const, label: 'ניהול סיכון' },
  { key: 'score_horizon'          as const, label: 'אופק פנסיוני' },
  { key: 'score_governance'       as const, label: 'ממשל פנימי' },
]

function ScoreArc({ score }: { score: number }) {
  const r = 58, cx = 74, cy = 74
  const circ = 2 * Math.PI * r
  const dashArr = circ * 0.75
  const filled = dashArr * (score / 100)
  const empty = dashArr - filled
  const arcColor = score >= 70 ? '#64B5F6' : score >= 40 ? '#FFB74D' : '#EF9A9A'

  return (
    <svg width="148" height="122" viewBox="0 0 148 122">
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="rgba(255,255,255,0.18)" strokeWidth="12"
        strokeDasharray={`${dashArr} ${circ}`} strokeLinecap="round"
        transform={`rotate(-225 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={arcColor} strokeWidth="12"
        strokeDasharray={`${filled} ${empty + circ * 0.25}`} strokeLinecap="round"
        transform={`rotate(-225 ${cx} ${cy})`} />
      <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
        fontFamily={font} fontSize="36" fontWeight="700" fill="#FFFFFF">
        {score}
      </text>
      <text x={cx} y={cy + 28} textAnchor="middle"
        fontFamily={font} fontSize="12" fill="rgba(255,255,255,0.65)">
        מתוך 100
      </text>
    </svg>
  )
}

function AxisCard({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? C.blue : score >= 40 ? C.orange : '#DC2626'
  const bg    = score >= 70 ? '#1B5FAD12' : score >= 40 ? '#E8521A12' : '#DC262612'
  return (
    <div style={{
      background: bg, border: `1px solid ${color}35`,
      borderRadius: 12, padding: '11px 6px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: font, fontWeight: 700, fontSize: 20, color, marginBottom: 3 }}>
        {score}
      </div>
      <div style={{ fontFamily: font, fontSize: 10, color: C.inkMute, lineHeight: 1.3 }}>
        {label}
      </div>
    </div>
  )
}

export default function FirstMeetingInvite({
  scores, userName,
}: { scores: InviteScores; userName: string | null }) {
  const router = useRouter()

  const weakCount = AXES.filter(a => scores[a.key] < 60).length
  const overall   = scores.score_overall
  const scoreLabel =
    overall >= 70 ? 'בריא' : overall >= 40 ? 'דורש תשומת לב' : 'דורש פעולה'

  return (
    <main style={{
      minHeight: '100vh', background: C.bg,
      fontFamily: font, direction: 'rtl',
      maxWidth: 480, margin: '0 auto',
    }}>

      {/* ── BLUE HEADER ── */}
      <div style={{
        background: `linear-gradient(175deg, ${C.blue} 0%, ${C.blueDark} 100%)`,
        padding: '28px 20px 40px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative blobs */}
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
        <div style={{
          position: 'absolute', left: -20, bottom: -50,
          width: 130, height: 130, borderRadius: '50%',
          background: 'rgba(232,82,26,0.07)',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Image src="/icon.png" alt="360" width={38} height={38}
              style={{ objectFit: 'contain' }} priority />
          </div>

          <p style={{ margin: '0 0 4px', fontFamily: font, fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>
            האבחון הושלם ✓
          </p>
          <h1 style={{ margin: '0 0 26px', fontFamily: font, fontSize: 23, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
            {userName ? `${userName}, ` : ''}הנה מה שגילינו
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <ScoreArc score={overall} />
          </div>

          <div style={{
            display: 'inline-block', padding: '5px 18px', borderRadius: 20,
            background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)',
            fontFamily: font, fontWeight: 700, fontSize: 14, color: '#fff',
          }}>
            {scoreLabel}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: '24px 16px 48px' }}>

        {/* Axes grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
          {AXES.map(a => (
            <AxisCard key={a.key} label={a.label} score={scores[a.key]} />
          ))}
        </div>

        {/* Explanation card */}
        <div style={{
          background: C.bgCard, borderRadius: 16, padding: '20px',
          border: `1px solid ${C.border}`, marginBottom: 20,
          boxShadow: '0 2px 14px rgba(27,95,173,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 26 }}>🏛️</span>
            <div style={{ fontFamily: font, fontWeight: 700, fontSize: 16, color: C.ink }}>
              ישיבת הדירקטוריון הראשונה
            </div>
          </div>
          <p style={{ margin: '0 0 10px', fontFamily: font, fontSize: 14, color: C.inkSoft, lineHeight: 1.75 }}>
            בחצי שעה הקרובה נסקור יחד מה האבחון חשף, ונמצא{' '}
            <strong style={{ color: C.ink }}>
              {weakCount > 0
                ? `${weakCount} פעולות קלות שתוכלו להתחיל מחר`
                : 'הזדמנויות לשיפור שמתאימות לכם'}
            </strong>.
          </p>
          <p style={{ margin: 0, fontFamily: font, fontSize: 13, color: C.inkMute, lineHeight: 1.65 }}>
            בסוף הישיבה תצאו עם 2-3 משימות ברורות — לא יותר. ופרוטוקול שנשמר לכל ישיבה הבאה.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => router.push('/board-meeting/session')}
          style={{
            width: '100%', padding: '17px 24px', marginBottom: 12,
            background: C.orange, border: 'none', borderRadius: 14,
            fontFamily: font, fontWeight: 700, fontSize: 17, color: '#fff',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 6px 22px rgba(232,82,26,0.32)',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.92' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
        >
          🏛️ התחילו את הישיבה הראשונה
        </button>

        {/* Secondary skip link */}
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            width: '100%', padding: '14px 24px',
            background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 14,
            fontFamily: font, fontSize: 14, color: C.inkSoft,
            cursor: 'pointer',
          }}
        >
          לדשבורד — אמשיך מאוחר יותר
        </button>
      </div>
    </main>
  )
}
