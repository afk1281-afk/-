import Image from 'next/image'

export default function TopBar() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 56,
      backgroundColor: '#FFFFFF', borderBottom: '1px solid #DDE4EF',
      display: 'flex', alignItems: 'center', padding: '0 16px', zIndex: 50, direction: 'ltr',
    }}>
      <Image src="/icon.png" alt="360" width={38} height={38} style={{ objectFit: 'contain' }} priority />
    </div>
  )
}
