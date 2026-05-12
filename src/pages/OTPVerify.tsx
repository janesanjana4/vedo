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
    <div className="flex flex-col min-h-screen bg-white px-5 pb-10">
      <div className="h-1 bg-gray-100">
        <div className="h-1 bg-primary w-8 rounded" />
      </div>

      <div className="pt-3.5">
        <button onClick={onBack} className="w-8.5 h-8.5 rounded-full border border-border bg-white cursor-pointer flex items-center justify-center hover:bg-gray-50">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex-1 pt-6">
        <h1 className="text-xl font-medium text-primary leading-tight mb-2">
          enter the code<br />we sent you
        </h1>
        <p className="text-xs text-gray-600 mb-8">
          sent to {phone}{' '}
          <span onClick={onBack} className="text-primary underline cursor-pointer hover:text-gray-900">
            change
          </span>
        </p>

        <div className="flex gap-1.5 justify-center mb-6 flex-wrap">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-11 h-14 border-2 rounded-lg text-center text-lg font-medium text-primary outline-none bg-white transition-colors ${
                digit ? 'border-primary' : 'border-border'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-error text-center mb-3">
            {error}
          </p>
        )}

        <p className="text-center text-xs text-gray-500">
          {countdown > 0 ? (
            <>didn't get it? resend in 0:{countdown.toString().padStart(2, '0')}</>
          ) : (
            <span
              onClick={() => { sendOTP(phone); setCountdown(45) }}
              className="text-primary underline cursor-pointer hover:text-gray-900"
            >
              resend code
            </span>
          )}
        </p>
      </div>

      <button
        onClick={handleVerify}
        disabled={!isComplete || loading}
        className={`w-full px-4 py-4 border-none rounded-full text-sm font-medium transition-colors ${
          isComplete && !loading
            ? 'bg-primary text-white cursor-pointer hover:bg-gray-900'
            : 'bg-gray-200 text-gray-400 cursor-default'
        }`}
      >
        {loading ? 'verifying...' : 'verify →'}
      </button>
    </div>
  )
}