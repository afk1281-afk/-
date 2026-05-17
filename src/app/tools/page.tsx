import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import TopBar from '@/components/TopBar'
import { Calculator, TrendingUp, BarChart3, ChevronLeft } from 'lucide-react'

const tools = [
  {
    href: '/tools/financial-os',
    icon: BarChart3,
    color: '#1B5FAD',
    title: 'מערכת ההפעלה הפיננסית',
    description: 'אבחון מלא של הבריאות הפיננסית שלך — ציון, 6 צירים ומפת דרכים',
  },
  {
    href: '/tools/compound',
    icon: TrendingUp,
    color: '#E8521A',
    title: 'מחשבון ריבית דריבית',
    description: 'חשב כמה יגדל הכסף שלך לאורך זמן עם ריבית מצטברת',
  },
  {
    href: '/tools/budget',
    icon: Calculator,
    color: '#1B5FAD',
    title: 'מחשבון ניהול תקציב',
    description: 'עקוב אחרי הכנסות, הוצאות וקטגוריות תקציב חודשיות',
  },
]

export default function ToolsPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F0F4FA', fontFamily: 'var(--font-rubik)' }}>
      <TopBar />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '72px 20px 100px' }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E8521A', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
            כלים פיננסיים
          </div>
          <h1 style={{ fontFamily: 'var(--font-rubik)', fontSize: 28, fontWeight: 800, color: '#0F1923', margin: 0 }}>
            מחשבונים
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tools.map(tool => (
            <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#FFFFFF', border: '1px solid #DDE4EF', borderRadius: 14,
                padding: '20px', display: 'flex', alignItems: 'center', gap: 16,
                boxShadow: '0 2px 8px rgba(27,95,173,0.06)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  backgroundColor: `${tool.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <tool.icon size={24} color={tool.color} strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0F1923', marginBottom: 4 }}>
                    {tool.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#8A9AAB', lineHeight: 1.5 }}>
                    {tool.description}
                  </div>
                </div>
                <ChevronLeft size={18} color="#8A9AAB" />
              </div>
            </Link>
          ))}
        </div>

      </div>
      <BottomNav />
    </main>
  )
}
