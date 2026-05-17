import Link from 'next/link'
import LogoutButton from './LogoutButton'

const C = {
  bg: '#F4EEE1',
  bgCard: '#FBF7EC',
  border: '#E5DAC2',
  borderSoft: '#EEE5D0',
  ink: '#1A1612',
  inkSoft: '#4A4339',
  inkMute: '#8B8377',
  green: '#1E3A2E',
  gold: '#A8804A',
  rust: '#A8401D',
}

type PageLink = {
  title: string
  description: string
  href: string
  badge?: string
  badgeColor?: string
  note?: string
}

const sections: { title: string; pages: PageLink[] }[] = [
  {
    title: 'אימות — דורשים התנתקות',
    pages: [
      {
        title: 'הרשמה', description: 'יצירת חשבון חדש', href: '/register',
        badge: 'LOGGED OUT', badgeColor: C.rust,
        note: 'מפנה לדשבורד אם מחובר',
      },
      {
        title: 'כניסה', description: 'התחברות לחשבון קיים', href: '/login',
        badge: 'LOGGED OUT', badgeColor: C.rust,
        note: 'מפנה לדשבורד אם מחובר',
      },
      {
        title: 'איפוס סיסמה', description: 'שחזור גישה לחשבון', href: '/reset-password',
        badge: 'LOGGED OUT', badgeColor: C.rust,
      },
    ],
  },
  {
    title: 'זרימת משתמש — דורשים כניסה',
    pages: [
      {
        title: 'אבחון פיננסי', description: '7 שלבים לאיסוף נתונים', href: '/assessment',
        badge: 'LOGGED IN', badgeColor: C.green,
      },
      {
        title: 'דשבורד (נתונים אמיתיים)', description: 'נתוני המשתמש המחובר מ-Supabase', href: '/dashboard',
        badge: 'LOGGED IN', badgeColor: C.green,
      },
    ],
  },
  {
    title: 'תצוגות מקדימה — ללא תלות בכניסה',
    pages: [
      {
        title: 'דשבורד — נתוני דמו', description: 'משפחה ישראלית בינונית, כל השדות מלאים', href: '/dev/dashboard',
        badge: 'MOCK', badgeColor: C.gold,
      },
    ],
  },
]

export default function DevPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: C.bg, fontFamily: 'var(--font-heebo)' }} dir="rtl">
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
          <div>
            <div style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: 6,
              background: '#1E3A2E18', fontFamily: 'var(--font-heebo)', fontSize: 11,
              fontWeight: 600, color: C.green, letterSpacing: '0.18em', marginBottom: 16,
            }}>
              DEV · מאחורי הקלעים
            </div>
            <h1 style={{ fontFamily: 'var(--font-frank-ruhl)', fontSize: 36, fontWeight: 500, color: C.ink, margin: '0 0 12px 0' }}>
              מפת הדפים
            </h1>
            <p style={{ fontSize: 15, color: C.inkSoft, margin: 0, lineHeight: 1.6 }}>
              גישה ישירה לכל דף ומצב. דפי אימות דורשים התנתקות תחילה.
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {sections.map((section) => (
            <div key={section.title}>
              <div style={{
                fontFamily: 'var(--font-heebo)', fontSize: 11, fontWeight: 600,
                color: C.gold, letterSpacing: '0.18em', textTransform: 'uppercase',
                marginBottom: 16,
              }}>
                {section.title}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                {section.pages.map((page) => (
                  <Link
                    key={page.href + page.title}
                    href={page.href}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      background: C.bgCard, border: `1px solid ${C.borderSoft}`,
                      borderRadius: 12, padding: '20px 22px',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', gap: 8,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ fontFamily: 'var(--font-frank-ruhl)', fontSize: 17, fontWeight: 500, color: C.ink }}>
                          {page.title}
                        </div>
                        {page.badge && (
                          <div style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                            color: page.badgeColor || C.gold,
                            background: `${page.badgeColor || C.gold}18`,
                            padding: '2px 7px', borderRadius: 4, flexShrink: 0,
                          }}>
                            {page.badge}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: C.inkMute, lineHeight: 1.5 }}>
                        {page.description}
                      </div>
                      {page.note && (
                        <div style={{ fontSize: 12, color: C.rust, marginTop: 2 }}>
                          ⚠ {page.note}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: C.green, fontWeight: 500, marginTop: 4, direction: 'ltr', textAlign: 'right' }}>
                        {page.href}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
