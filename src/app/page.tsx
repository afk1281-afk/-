import { ArrowLeft, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import TopBar from '@/components/TopBar'

const BENEFITS = [
  'ציון בריאות פיננסית כללי לחברה המשפחתית',
  'פירוט בששה צירים מקצועיים — הכנסה, יעילות, הון, סיכון, אופק וממשל',
  'תמונה ברורה של תזרים, נטל חוב, חודשי קיום ופער פנסיוני',
  'מפת הדרכים האישית שלכם להמשך',
]

export default function WelcomePage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F0F4FA', fontFamily: 'var(--font-rubik)' }}>
      <TopBar />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '72px 24px 48px' }}>

        {/* Hero */}
        <h1 style={{
          textAlign: 'center', margin: '0 0 8px',
          fontFamily: 'var(--font-rubik)', fontSize: 'clamp(36px, 8vw, 48px)',
          fontWeight: 800, color: '#0F1923', lineHeight: 1.1,
        }}>
          מערכת ההפעלה
          <br />
          <span style={{ color: '#1B5FAD' }}>הפיננסית</span>
        </h1>

        {/* Divider */}
        <div style={{ width: 48, height: 3, backgroundColor: '#E8521A', borderRadius: 2, margin: '24px auto' }} />

        {/* Subtitle */}
        <p style={{ textAlign: 'center', fontSize: 17, color: '#4A5A6E', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 32px' }}>
          שב לראשונה בכיסא המנכ״ל של החברה המשפחתית שלך.
          תוך כשמונה דקות תקבל דוח מצב מלא על ששת הצירים שמרכיבים את הבריאות הפיננסית.
        </p>

        {/* Benefits card */}
        <div style={{
          backgroundColor: '#FFFFFF', border: '1px solid #DDE4EF',
          borderRadius: 16, padding: '24px', marginBottom: 32,
          boxShadow: '0 4px 24px rgba(27, 95, 173, 0.08)',
        }}>
          <p style={{ fontFamily: 'var(--font-rubik)', fontSize: 15, fontWeight: 600, color: '#0F1923', margin: '0 0 16px' }}>
            מה תקבלו בסיום
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {BENEFITS.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  backgroundColor: '#1B5FAD', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  <Check size={13} color="#FFFFFF" strokeWidth={3} />
                </div>
                <span style={{ fontSize: 15, color: '#4A5A6E', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link href="/assessment" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          width: '100%', padding: '18px 24px', borderRadius: 12,
          backgroundColor: '#1B5FAD', color: '#FFFFFF',
          fontFamily: 'var(--font-rubik)', fontSize: 17, fontWeight: 700,
          textDecoration: 'none', boxSizing: 'border-box',
        }}>
          התחלת האבחון
          <ArrowLeft size={20} />
        </Link>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link href="/login" style={{ fontSize: 14, color: '#8A9AAB', textDecoration: 'none' }}>
            יש לך חשבון?{' '}
            <span style={{ color: '#1B5FAD', fontWeight: 600 }}>כניסה</span>
          </Link>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#A0ADB8', lineHeight: 1.6 }}>
          המידע באפליקציה זו הוא חינוכי בלבד ואינו מהווה ייעוץ פיננסי, ביטוחי או פנסיוני.
        </p>

      </div>
    </main>
  )
}
