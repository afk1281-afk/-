'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('הסיסמה חייבת להכיל לפחות 8 תווים')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message === 'User already registered' ? 'אימייל זה כבר רשום. נסה להתחבר.' : error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <>
      <h2 style={titleStyle}>יצירת חשבון</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>שם מלא</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="ישראל ישראלי"
            required
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#1B5FAD'; e.target.style.boxShadow = '0 0 0 3px #1B5FAD18' }}
            onBlur={e => { e.target.style.borderColor = '#DDE4EF'; e.target.style.boxShadow = 'none' }}
          />
        </div>

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

        <div>
          <label style={labelStyle}>סיסמה</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="לפחות 8 תווים"
              required
              dir="ltr"
              style={{ ...inputStyle, paddingLeft: 44 }}
              onFocus={e => { e.target.style.borderColor = '#1B5FAD'; e.target.style.boxShadow = '0 0 0 3px #1B5FAD18' }}
              onBlur={e => { e.target.style.borderColor = '#DDE4EF'; e.target.style.boxShadow = 'none' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#A0ADB8', padding: 0,
              }}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ fontFamily: 'var(--font-rubik)', fontSize: 13, color: '#DC2626', margin: 0 }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} style={submitStyle(loading)}>
          {loading ? 'יוצר חשבון...' : 'יצירת חשבון'}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: 'center', fontFamily: 'var(--font-rubik)', fontSize: 14, color: '#4A5A6E' }}>
        יש לך חשבון?{' '}
        <Link href="/login" style={{ color: '#1B5FAD', fontWeight: 600, textDecoration: 'none' }}>
          כניסה
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
  margin: '0 0 24px 0',
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
