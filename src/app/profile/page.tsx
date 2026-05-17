import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/BottomNav'
import TopBar from '@/components/TopBar'
import { logoutAction } from './actions'
import { User } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.user_metadata?.full_name || user?.email || ''

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F0F4FA', fontFamily: 'var(--font-rubik)' }}>
      <TopBar />
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '72px 24px 100px' }}>

        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#1B5FAD18', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <User size={32} color="#1B5FAD" strokeWidth={1.75} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0F1923' }}>{name}</div>
          <div style={{ fontSize: 14, color: '#8A9AAB', marginTop: 4 }}>{user?.email}</div>
        </div>

        {/* Logout */}
        <form action={logoutAction}>
          <button type="submit" style={{
            width: '100%', padding: '14px',
            fontFamily: 'var(--font-rubik)', fontSize: 16, fontWeight: 600,
            backgroundColor: '#FFFFFF', color: '#DC2626',
            border: '1px solid #FECACA', borderRadius: 10, cursor: 'pointer',
          }}>
            התנתקות
          </button>
        </form>

      </div>
      <BottomNav />
    </main>
  )
}
