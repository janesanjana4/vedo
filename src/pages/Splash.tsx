import VedoLogo from '../components/VedoLogo'

interface SplashProps {
  onGetStarted: () => void
  onSignIn: () => void
}

export default function Splash({ onGetStarted, onSignIn }: SplashProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white px-5 pb-12">
      <div className="flex-1 flex flex-col items-center justify-center pt-[8vh]">
        <VedoLogo width={160} />
        <p className="text-xs text-gray-600 italic mt-3 text-center">
          find your people, find your place
        </p>
        <svg width="220" height="180" viewBox="0 0 220 180" fill="none" className="mt-12">
          <circle cx="70" cy="90" r="44" fill="#EEEDFE" stroke="#AFA9EC" strokeWidth="1" />
          <text x="70" y="97" textAnchor="middle" fontSize="18" fontWeight="500" fill="#534AB7">AK</text>
          <circle cx="150" cy="90" r="44" fill="#E1F5EE" stroke="#9FE1CB" strokeWidth="1" />
          <text x="150" y="97" textAnchor="middle" fontSize="18" fontWeight="500" fill="#0F6E56">PR</text>
          <path d="M110 55 Q110 30 110 55" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="110" cy="48" r="4" fill="#D85A30" />
          <path d="M94 72 Q110 58 126 72" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="w-full">
        <button
          onClick={onGetStarted}
          className="w-full px-4 py-4 bg-primary text-white border-none rounded-full text-sm font-medium cursor-pointer tracking-wider hover:bg-gray-900"
        >
          get started
        </button>
        <p className="text-center mt-4 text-xs text-gray-600">
          already have an account?{' '}
          <span
            onClick={onSignIn}
            className="text-primary underline cursor-pointer hover:text-gray-900"
          >
            sign in
          </span>
        </p>
      </div>
    </div>
  )
}