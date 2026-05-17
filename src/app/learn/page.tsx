import BottomNav from '@/components/BottomNav'
import TopBar from '@/components/TopBar'
import { articles } from '@/lib/articles'
import { Clock, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const categoryColor: Record<string, { bg: string; text: string }> = {
  'חיסכון': { bg: '#1B5FAD18', text: '#1B5FAD' },
  'פנסיה': { bg: '#E8521A18', text: '#E8521A' },
  'השקעות': { bg: '#1B5FAD18', text: '#1B5FAD' },
  'ביטוח': { bg: '#E8521A18', text: '#E8521A' },
}

function getCategoryStyle(cat: string) {
  return categoryColor[cat] ?? { bg: '#4A5A6E18', text: '#4A5A6E' }
}

export default function LearnPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F0F4FA', fontFamily: 'var(--font-rubik)', direction: 'rtl' }}>
      <TopBar />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '72px 16px 100px' }}>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F1923', margin: '0 0 4px' }}>
          למידה
        </h1>
        <p style={{ fontSize: 14, color: '#4A5A6E', margin: '0 0 24px' }}>
          מדריכים פיננסיים בעברית
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {articles.map(article => {
            const cat = getCategoryStyle(article.category)
            return (
              <Link key={article.slug} href={`/learn/${article.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DDE4EF',
                  borderRadius: 16,
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.15s',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        backgroundColor: cat.bg, color: cat.text,
                        borderRadius: 20, padding: '2px 10px',
                        whiteSpace: 'nowrap',
                      }}>
                        {article.category}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#A0ADB8' }}>
                        <Clock size={11} />
                        {article.readTime} דקות קריאה
                      </span>
                    </div>
                    <h2 style={{
                      fontSize: 16, fontWeight: 700, color: '#0F1923',
                      margin: '0 0 4px', lineHeight: 1.35,
                    }}>
                      {article.title}
                    </h2>
                    <p style={{
                      fontSize: 13, color: '#4A5A6E', margin: 0,
                      lineHeight: 1.6, display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}>
                      {article.excerpt}
                    </p>
                  </div>
                  <ChevronLeft size={18} color="#A0ADB8" style={{ flexShrink: 0 }} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </main>
  )
}
