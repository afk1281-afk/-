import BottomNav from '@/components/BottomNav'
import TopBar from '@/components/TopBar'
import { Users } from 'lucide-react'

export default function CommunityPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F0F4FA', fontFamily: 'var(--font-rubik)' }}>
      <TopBar />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '72px 24px 100px', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: '#E8521A18', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 24px',
        }}>
          <Users size={30} color="#E8521A" strokeWidth={1.75} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-rubik)', fontSize: 28, fontWeight: 700, color: '#0F1923', margin: '0 0 12px' }}>
          קהילה
        </h1>
        <p style={{ fontSize: 16, color: '#4A5A6E', lineHeight: 1.7, margin: 0 }}>
          פורום, שאלות ותשובות, ושיתוף ניסיון עם חברי הקהילה — בקרוב
        </p>
      </div>
      <BottomNav />
    </main>
  )
}
