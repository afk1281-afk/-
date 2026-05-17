'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calculator, Users, BookOpen, User } from 'lucide-react'

const tabs = [
  { href: '/dashboard', icon: Home, label: 'בית' },
  { href: '/tools', icon: Calculator, label: 'כלים' },
  { href: '/community', icon: Users, label: 'קהילה' },
  { href: '/learn', icon: BookOpen, label: 'למידה' },
  { href: '/profile', icon: User, label: 'אני' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #DDE4EF',
      display: 'flex',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href
        return (
          <Link key={href} href={href} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 0 12px',
            gap: 4,
            textDecoration: 'none',
            color: isActive ? '#1B5FAD' : '#8A9AAB',
          }}>
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
            <span style={{
              fontFamily: 'var(--font-rubik)',
              fontSize: 11,
              fontWeight: isActive ? 600 : 400,
              lineHeight: 1,
            }}>
              {label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                width: 32,
                height: 2,
                backgroundColor: '#1B5FAD',
                borderRadius: '0 0 2px 2px',
              }} />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
