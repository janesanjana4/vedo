import VedoLogo from '../components/VedoLogo'

interface SplashProps {
  onGetStarted: () => void
  onSignIn: () => void
}

export default function Splash({ onGetStarted, onSignIn }: SplashProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '100vh',
      background: '#ffffff',
      padding: '0 20px 48px',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '8vh',
      }}>
        <VedoLogo width={160} />
        <p style={{
          fontSize: 13,
          color: '#999999',
          fontStyle: 'italic',
          marginTop: 12,
          textAlign: 'center',
          fontFamily: 'inherit',
        }}>
          find your people, find your place
        </p>
        <svg width="220" height="180" viewBox="0 0 220 180" fill="none" style={{ marginTop: 48 }}>
          <circle cx="70" cy="90" r="44" fill="#EEEDFE" stroke="#AFA9EC" strokeWidth="1" />
          <text x="70" y="97" textAnchor="middle" fontSize="18" fontWeight="500" fill="#534AB7">AK</text>
          <circle cx="150" cy="90" r="44" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1" />
          <text x="150" y="97" textAnchor="middle" fontSize="18" fontWeight="500" fill="#0F6E56">PR</text>
          <path d="M110 55 Q110 30 110 55" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="110" cy="48" r="4" fill="#D85A30" />
          <path d="M94 72 Q110 58 126 72" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div style={{ width: '100%' }}>
        <button
          onClick={onGetStarted}
          style={{
            width: '100%',
            padding: '16px',
            background: '#1a1a1a',
            color: '#ffffff',
            border: 'none',
            borderRadius: 30,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.2px',
          }}
        >
          get started
        </button>
        <p style={{
          textAlign: 'center',
          marginTop: 16,
          fontSize: 13,
          color: '#999999',
          fontFamily: 'inherit',
        }}>
          already have an account?{' '}
          <span
            onClick={onSignIn}
            style={{
              color: '#1a1a1a',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            sign in
          </span>
        </p>
      </div>
    </div>
  )
}