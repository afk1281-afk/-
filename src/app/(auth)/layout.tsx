import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#F0F4FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      {/* Icon top-left */}
      <div style={{ position: 'fixed', top: 10, left: 16, zIndex: 50 }}>
        <Image src="/icon.png" alt="360" width={38} height={38} style={{ objectFit: 'contain' }} priority />
      </div>

      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #DDE4EF',
          borderRadius: 20,
          padding: '36px 28px',
          boxShadow: '0 4px 24px rgba(27, 95, 173, 0.08)',
        }}>
          {children}
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center', marginTop: 20,
          fontFamily: 'var(--font-rubik)', fontSize: 12,
          color: '#A0ADB8', lineHeight: 1.6,
        }}>
          המידע באפליקציה זו הוא חינוכי בלבד ואינו מהווה ייעוץ פיננסי, ביטוחי או פנסיוני.
        </p>
      </div>
    </main>
  )
}
