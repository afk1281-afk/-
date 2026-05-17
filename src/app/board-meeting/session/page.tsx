import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function BoardMeetingSessionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main style={{
      minHeight: '100vh', background: '#F0F4FA',
      fontFamily: 'var(--font-rubik)', direction: 'rtl',
      maxWidth: 480, margin: '0 auto',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 52, marginBottom: 18 }}>🏛️</div>
      <h1 style={{
        fontFamily: 'var(--font-rubik)', fontSize: 22,
        fontWeight: 700, color: '#0F1923', margin: '0 0 12px',
      }}>
        הישיבה המודרכת בדרך
      </h1>
      <p style={{
        fontFamily: 'var(--font-rubik)', fontSize: 14,
        color: '#4A5A6E', lineHeight: 1.75, margin: '0 0 32px',
        maxWidth: 320,
      }}>
        אנחנו בונים את חווית הישיבה המודרכת.<br />
        תחזרו לדשבורד ונעדכן אתכם כשהיא מוכנה.
      </p>
      <Link href="/dashboard" style={{
        background: '#1B5FAD', borderRadius: 12, padding: '14px 36px',
        fontFamily: 'var(--font-rubik)', fontWeight: 700,
        fontSize: 15, color: '#fff', textDecoration: 'none',
        display: 'inline-block',
        boxShadow: '0 4px 14px rgba(27,95,173,0.28)',
      }}>
        לדשבורד
      </Link>
    </main>
  )
}
