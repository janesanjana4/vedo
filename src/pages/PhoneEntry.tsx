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
    <div className="flex flex-col min-h-screen bg-white px-5 pb-10">
      <div className="h-1 bg-gray-100">
        <div className="h-1 bg-primary w-4 rounded" />
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
          what's your<br />email address?
        </h1>
        <p className="text-xs text-gray-600 mb-7">
          we'll send you a one-time code to verify it's you.
        </p>

        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="your@email.com"
            autoComplete="email"
            className={`w-full px-4 py-3.5 border rounded-xl text-sm text-primary outline-none bg-white transition-colors ${
              email.length > 0 ? 'border-primary' : 'border-border'
            }`}
          />
        </div>

        {error && (
          <p className="text-xs text-error mb-3">
            {error}
          </p>
        )}

        <p className="text-xs text-gray-400">
          by continuing you agree to our{' '}
          <span className="underline cursor-pointer">terms</span>
          {' '}&{' '}
          <span className="underline cursor-pointer">privacy policy</span>
        </p>
      </div>

      <button
        onClick={handleSend}
        disabled={!isValid || loading}
        className={`w-full px-4 py-4 border-none rounded-full text-sm font-medium transition-colors ${
          isValid && !loading
            ? 'bg-primary text-white cursor-pointer hover:bg-gray-900'
            : 'bg-gray-200 text-gray-400 cursor-default'
        }`}
      >
        {loading ? 'sending...' : 'send code →'}
      </button>
    </div>
  )
}