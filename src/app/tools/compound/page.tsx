'use client'

import { useState } from 'react'
import BottomNav from '@/components/BottomNav'
import TopBar from '@/components/TopBar'
import { TrendingUp } from 'lucide-react'

const C = {
  blue: '#1B5FAD',
  orange: '#E8521A',
  bg: '#F0F4FA',
  card: '#FFFFFF',
  border: '#DDE4EF',
  ink: '#0F1923',
  inkSoft: '#4A5A6E',
  inkMute: '#8A9AAB',
}

type Result = {
  total: number
  totalContributions: number
  totalInterest: number
  yearly: { year: number; balance: number }[]
}

function fmt(n: number) {
  return '₪' + Math.round(n).toLocaleString('he-IL')
}

function computeResult(initial: string, monthly: string, rate: string, years: string): Result | null {
  const P   = parseFloat(initial) || 0
  const pmt = parseFloat(monthly) || 0
  const r   = (parseFloat(rate) || 0) / 100 / 12
  const n   = (parseFloat(years) || 0) * 12

  if (n === 0) return null

  const futureInitial  = r > 0 ? P * Math.pow(1 + r, n) : P
  const futureMonthly  = r > 0 ? pmt * ((Math.pow(1 + r, n) - 1) / r) : pmt * n
  const total          = futureInitial + futureMonthly
  const totalContributions = P + pmt * n
  const totalInterest  = total - totalContributions

  const yearly: Result['yearly'] = []
  for (let y = 1; y <= parseFloat(years); y++) {
    const m   = y * 12
    const bal = r > 0
      ? P * Math.pow(1 + r, m) + pmt * ((Math.pow(1 + r, m) - 1) / r)
      : P + pmt * m
    yearly.push({ year: y, balance: bal })
  }

  return { total, totalContributions, totalInterest, yearly }
}

export default function CompoundPage() {
  const [initial, setInitial] = useState('10000')
  const [monthly, setMonthly] = useState('500')
  const [rate, setRate]       = useState('7')
  const [years, setYears]     = useState('20')
  const [result, setResult]   = useState<Result | null>(null)

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    fontFamily: 'var(--font-rubik)', fontSize: 16, fontWeight: 600,
    color: C.ink, backgroundColor: '#F8FAFD',
    border: `1px solid ${C.border}`, borderRadius: 10, outline: 'none',
    boxSizing: 'border-box', direction: 'ltr', textAlign: 'right',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 500,
    color: C.inkSoft, marginBottom: 6,
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: C.bg, fontFamily: 'var(--font-rubik)' }}>
      <TopBar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '72px 20px 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
            כלים פיננסיים
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.ink, margin: 0 }}>
            מחשבון ריבית דריבית
          </h1>
        </div>

        {/* Inputs */}
        <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>השקעה ראשונית (₪)</label>
              <input type="number" value={initial} onChange={e => setInitial(e.target.value)}
                style={inputStyle} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>הפקדה חודשית (₪)</label>
              <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)}
                style={inputStyle} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>תשואה שנתית (%)</label>
              <input type="number" value={rate} onChange={e => setRate(e.target.value)}
                style={inputStyle} placeholder="7" step="0.1" />
            </div>
            <div>
              <label style={labelStyle}>תקופה (שנים)</label>
              <input type="number" value={years} onChange={e => setYears(e.target.value)}
                style={inputStyle} placeholder="20" />
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={() => setResult(computeResult(initial, monthly, rate, years))}
            style={{
              width: '100%', padding: '14px',
              backgroundColor: C.blue, color: '#FFFFFF',
              border: 'none', borderRadius: 12,
              fontFamily: 'var(--font-rubik)', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', letterSpacing: 0.3,
            }}
          >
            חשב
          </button>
        </div>

        {/* Results */}
        {result && (
          <>
            <div style={{
              backgroundColor: C.blue, borderRadius: 16, padding: '28px 24px',
              textAlign: 'center', marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF99', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                סכום סופי לאחר {years} שנים
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, color: '#FFFFFF', lineHeight: 1, marginBottom: 8 }}>
                {fmt(result.total)}
              </div>
              <div style={{ fontSize: 13, color: '#FFFFFF99', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <TrendingUp size={13} />
                ריבית דריבית עשתה את העבודה
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.inkMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>סך הפקדות</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>{fmt(result.totalContributions)}</div>
              </div>
              <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.inkMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>רווח מריבית</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.orange }}>{fmt(result.totalInterest)}</div>
              </div>
            </div>

            <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 12 }}>פירוק הסכום הסופי</div>
              <div style={{ height: 20, borderRadius: 6, overflow: 'hidden', display: 'flex', marginBottom: 12 }}>
                <div style={{ width: `${(result.totalContributions / result.total) * 100}%`, background: C.blue }} />
                <div style={{ flex: 1, background: C.orange }} />
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.inkSoft }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: C.blue }} />
                  הפקדות ({Math.round((result.totalContributions / result.total) * 100)}%)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.inkSoft }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: C.orange }} />
                  ריבית ({Math.round((result.totalInterest / result.total) * 100)}%)
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 16 }}>התפתחות לאורך השנים</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {result.yearly
                  .filter((_, i) => i % Math.max(1, Math.floor(result.yearly.length / 10)) === 0 || i === result.yearly.length - 1)
                  .map(row => (
                    <div key={row.year} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #F0F4FA' }}>
                      <div style={{ width: 52, fontSize: 13, fontWeight: 600, color: C.inkMute, flexShrink: 0 }}>שנה {row.year}</div>
                      <div style={{ flex: 1, height: 8, background: '#F0F4FA', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${(row.balance / result.total) * 100}%`, height: '100%', background: C.blue, borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, minWidth: 100, textAlign: 'left' }}>{fmt(row.balance)}</div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
