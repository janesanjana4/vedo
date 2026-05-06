import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

interface OTPVerifyProps {
  phone: string
  onNext: () => void
  onBack: () => void
}

export default function OTPVerify({ phone, onNext, onBack }: OTPVerifyProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(45)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { verifyOTP, sendOTP } = useAuthStore()

  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const isComplete = otp.every(d => d !== '')

  useEffect(() => {
    if (countdown === 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 7) refs[index + 1].current?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      refs[index - 1].current?.focus()
    }
  }

  const handleVerify = async () => {
    if (!isComplete) return
    setLoading(true)
    setError('')
    const token = otp.join('')
    const { error } = await verifyOTP(phone, token)
    setLoading(false)
    if (error) {
      setError('Invalid code. Please try again.')
      setOtp(['', '', '', '', '', '', '', ''])
      refs[0].current?.focus()
    } else {
      onNext()
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: '#ffffff', padding: '0 20px 40px',
    }}>
      <div style={{ height: 3, background: '#F0F0F0' }}>
        <div style={{ height: 3, background: '#1a1a1a', width: '32%', borderRadius: 2 }} />
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
          enter the code<br />we sent you
        </h1>
        <p style={{ fontSize: 13, color: '#999999', marginBottom: 32, fontFamily: 'inherit' }}>
          sent to {phone}{' '}
          <span onClick={onBack} style={{ color: '#1a1a1a', textDecoration: 'underline', cursor: 'pointer' }}>
            change
          </span>
        </p>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: 42, height: 52,
                border: `1.5px solid ${digit ? '#1a1a1a' : '#E8E8E8'}`,
                borderRadius: 10, textAlign: 'center',
                fontSize: 18, fontWeight: 500, color: '#1a1a1a',
                fontFamily: 'inherit', outline: 'none', background: '#ffffff',
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ fontSize: 12, color: '#E24B4A', textAlign: 'center', marginBottom: 12, fontFamily: 'inherit' }}>
            {error}
          </p>
        )}

        <p style={{ textAlign: 'center', fontSize: 12, color: '#AAAAAA', fontFamily: 'inherit' }}>
          {countdown > 0 ? (
            <>didn't get it? resend in 0:{countdown.toString().padStart(2, '0')}</>
          ) : (
            <span
              onClick={() => { sendOTP(phone); setCountdown(45) }}
              style={{ color: '#1a1a1a', textDecoration: 'underline', cursor: 'pointer' }}
            >
              resend code
            </span>
          )}
        </p>
      </div>

      <button
        onClick={handleVerify}
        disabled={!isComplete || loading}
        style={{
          width: '100%', padding: '16px',
          background: isComplete && !loading ? '#1a1a1a' : '#E0E0E0',
          color: isComplete && !loading ? '#ffffff' : '#AAAAAA',
          border: 'none', borderRadius: 30,
          fontSize: 15, fontWeight: 500,
          cursor: isComplete && !loading ? 'pointer' : 'default',
          fontFamily: 'inherit', transition: 'background 0.2s',
        }}
      >
        {loading ? 'verifying...' : 'verify →'}
      </button>
    </div>
  )
}