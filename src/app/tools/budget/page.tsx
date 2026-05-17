'use client'

import BottomNav from '@/components/BottomNav'
import TopBar from '@/components/TopBar'

export default function BudgetPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F0F4FA', fontFamily: 'var(--font-rubik)', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <div style={{ paddingTop: 56, paddingBottom: 68, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <iframe
          src="/budget-app/index.html"
          style={{ flex: 1, width: '100%', border: 'none', minHeight: 'calc(100vh - 124px)' }}
          title="מחשבון ניהול תקציב"
        />
      </div>
      <BottomNav />
    </main>
  )
}
