'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <CheckCircle size={48} color="#1B5FAD" style={{ marginBottom: 16 }} />
        <h2 style={titleStyle}>הקישור נשלח</h2>
        <p style={{ fontFamily: 'var(--font-rubik)', fontSize: 15, color: '#4A5A6E', lineHeight: 1.6, margin: '0 0 20px' }}>
          שלחנו קישור לאיפוס סיסמה לכתובת <strong>{email}</strong>.
          בדוק את תיבת הדואר שלך.
        </p>
        <Link href="/login" style={{ fontFamily: 'var(--font-rubik)', fontSize: 14, color: '#1B5FAD', fontWeight: 600, textDecoration: 'none' }}>
          חזרה לכניסה
        </Link>
      </div>
    )
  }

  return (
    <>
      <h2 style={titleStyle}>איפוס סיסמה</h2>
      <p style={{ fontFamily: 'var(--font-rubik)', fontSize: 14, color: '#8A9AAB', textAlign: 'center', margin: '0 0 24px' }}>
        נשלח לך קישור לאיפוס הסיסמה באימייל
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>אימייל</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            dir="ltr"
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#1B5FAD'; e.target.style.boxShadow = '0 0 0 3px #1B5FAD18' }}
            onBlur={e => { e.target.style.borderColor = '#DDE4EF'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        <button type="submit" disabled={loading} style={submitStyle(loading)}>
          {loading ? 'שולח...' : 'שלח קישור לאיפוס'}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Link href="/login" style={{ fontFamily: 'var(--font-rubik)', fontSize: 14, color: '#1B5FAD', fontWeight: 600, textDecoration: 'none' }}>
          חזרה לכניסה
        </Link>
      </div>
    </>
  )
}

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-rubik)',
  fontSize: 22,
  fontWeight: 700,
  color: '#0F1923',
  textAlign: 'center',
  margin: '0 0 8px 0',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-rubik)',
  fontSize: 13,
  fontWeight: 500,
  color: '#4A5A6E',
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  fontFamily: 'var(--font-rubik)',
  fontSize: 15,
  color: '#0F1923',
  backgroundColor: '#F8FAFD',
  border: '1px solid #DDE4EF',
  borderRadius: 10,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

const submitStyle = (loading: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '14px',
  fontFamily: 'var(--font-rubik)',
  fontSize: 16,
  fontWeight: 700,
  backgroundColor: '#1B5FAD',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: 10,
  cursor: loading ? 'not-allowed' : 'pointer',
  opacity: loading ? 0.65 : 1,
  transition: 'opacity 0.15s',
  marginTop: 8,
})
