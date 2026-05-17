import { logoutAction } from './actions'

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        style={{
          padding: '8px 16px', fontSize: 13, fontFamily: 'var(--font-heebo)', fontWeight: 500,
          background: 'transparent', color: '#A8401D', border: '1px solid #A8401D40',
          borderRadius: 8, cursor: 'pointer',
        }}
      >
        התנתק
      </button>
    </form>
  )
}
