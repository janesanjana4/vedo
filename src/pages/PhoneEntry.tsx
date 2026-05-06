import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

interface PhoneEntryProps {
  onNext: (phone: string) => void
  onBack: () => void
}

export default function PhoneEntry({ onNext, onBack }: PhoneEntryProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { sendOTP } = useAuthStore()

  const isValid = email.includes('@') && email.includes('.') && email.length > 5

  const handleSend = async () => {
    if (!isValid) return
    setLoading(true)
    setError('')
    const { error } = await sendOTP(email)
    setLoading(false)
    if (error) {
      setError('Could not send code. Please check your email and try again.')
    } else {
      onNext(email)
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: '#ffffff', padding: '0 20px 40px',
    }}>
      <div style={{ height: 3, background: '#F0F0F0' }}>
        <div style={{ height: 3, background: '#1a1a1a', width: '16%', borderRadius: 2 }} />
      </div>

      <div style={{ padding: '14px 0 0' }}>
        <button onClick={onBack} style={{
          width: 34, height: 34, borderRadius: '50%',
          border: '1px solid #E8E8E8', background: '#ffffff',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, paddingTop: 24 }}>
        <h1 style={{
          fontSize: 22, fontWeight: 500, color: '#1a1a1a',
          lineHeight: 1.25, marginBottom: 8, fontFamily: 'inherit',
        }}>
          what's your<br />email address?
        </h1>
        <p style={{ fontSize: 13, color: '#999999', marginBottom: 28, fontFamily: 'inherit' }}>
          we'll send you a one-time code to verify it's you.
        </p>

        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="your@email.com"
            autoComplete="email"
            style={{
              width: '100%', padding: '14px 16px',
              border: `1px solid ${email.length > 0 ? '#1a1a1a' : '#E8E8E8'}`,
              borderRadius: 12, fontSize: 15,
              color: '#1a1a1a', fontFamily: 'inherit',
              outline: 'none', background: '#ffffff',
              transition: 'border 0.15s',
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 12, color: '#E24B4A', marginBottom: 12, fontFamily: 'inherit' }}>
            {error}
          </p>
        )}

        <p style={{ fontSize: 11, color: '#BBBBBB', fontFamily: 'inherit' }}>
          by continuing you agree to our{' '}
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>terms</span>
          {' '}&{' '}
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>privacy policy</span>
        </p>
      </div>

      <button
        onClick={handleSend}
        disabled={!isValid || loading}
        style={{
          width: '100%', padding: '16px',
          background: isValid && !loading ? '#1a1a1a' : '#E0E0E0',
          color: isValid && !loading ? '#ffffff' : '#AAAAAA',
          border: 'none', borderRadius: 30,
          fontSize: 15, fontWeight: 500,
          cursor: isValid && !loading ? 'pointer' : 'default',
          fontFamily: 'inherit', transition: 'background 0.2s',
        }}
      >
        {loading ? 'sending...' : 'send code →'}
      </button>
    </div>
  )
}