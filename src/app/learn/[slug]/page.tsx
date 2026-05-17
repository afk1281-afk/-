import { getArticle, articles } from '@/lib/articles'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F0F4FA', fontFamily: 'var(--font-rubik)', direction: 'rtl' }}>
      <TopBar />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '72px 16px 100px' }}>

        {/* Back link */}
        <Link href="/learn" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 14, color: '#1B5FAD', textDecoration: 'none',
          fontWeight: 500, marginBottom: 20,
        }}>
          <ChevronRight size={16} />
          חזרה למאמרים
        </Link>

        {/* Article card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #DDE4EF',
          borderRadius: 20,
          padding: '28px 24px',
          boxShadow: '0 4px 24px rgba(27, 95, 173, 0.06)',
        }}>
          {/* Category + read time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#1B5FAD',
              backgroundColor: '#1B5FAD18', borderRadius: 20, padding: '3px 12px',
            }}>
              {article.category}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#A0ADB8' }}>
              <Clock size={13} />
              {article.readTime} דקות קריאה
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 22, fontWeight: 800, color: '#0F1923',
            margin: '0 0 12px', lineHeight: 1.35,
          }}>
            {article.title}
          </h1>

          {/* Excerpt */}
          <p style={{
            fontSize: 15, color: '#4A5A6E', lineHeight: 1.75,
            margin: '0 0 24px', borderBottom: '1px solid #DDE4EF', paddingBottom: 24,
          }}>
            {article.excerpt}
          </p>

          {/* Body paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {article.paragraphs.map((para, i) => (
              <p key={i} style={{
                fontSize: 15, color: '#1C2B3A', lineHeight: 1.85, margin: 0,
              }}>
                {para}
              </p>
            ))}
          </div>

          {/* Disclaimer */}
          <div style={{
            marginTop: 32, padding: '14px 16px',
            backgroundColor: '#F0F4FA', borderRadius: 12,
            fontSize: 12, color: '#A0ADB8', lineHeight: 1.6,
          }}>
            המידע במאמר זה הוא חינוכי בלבד ואינו מהווה ייעוץ פיננסי, ביטוחי או פנסיוני.
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  )
}
