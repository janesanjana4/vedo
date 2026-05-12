import { useState } from 'react'

interface ProfileTypeProps {
  onNext: (type: 'individual' | 'group', name: string, university: string) => void
  onBack: () => void
}

export default function ProfileType({ onNext, onBack }: ProfileTypeProps) {
  const [selected, setSelected] = useState<'individual' | 'group' | null>(null)
  const [name, setName] = useState('')
  const [university, setUniversity] = useState('')

  const isValid = selected && name.trim().length > 1 && university.trim().length > 1

  return (
    <div className="flex flex-col min-h-screen bg-white px-5 pb-10">
      <div className="h-1 bg-gray-100">
        <div className="h-1 bg-primary w-12 rounded" />
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
          who's looking<br />for a place?
        </h1>
        <p className="text-xs text-gray-600 mb-6">
          this shapes how your profile appears to others.
        </p>

        <div className="flex gap-2.5 mb-6">
          {[
            { key: 'individual' as const, label: 'just me', sub: 'individual profile', icon: (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="10" r="5" stroke="#1a1a1a" strokeWidth="1.3" fill="none" />
                <path d="M5 24c0-5 4-8 9-8s9 3 9 8" stroke="#1a1a1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              </svg>
            )},
            { key: 'group' as const, label: 'my group', sub: '2–4 friends', icon: (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="10" cy="10" r="4" stroke="#1a1a1a" strokeWidth="1.3" fill="none" />
                <circle cx="19" cy="10" r="4" stroke="#1a1a1a" strokeWidth="1.3" fill="none" />
                <path d="M3 24c0-4 3-6 7-6s7 2 7 6" stroke="#1a1a1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                <path d="M19 18c3 0 6 2 6 6" stroke="#1a1a1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              </svg>
            )},
          ].map(opt => (
            <div
              key={opt.key}
              onClick={() => setSelected(opt.key)}
              className={`flex-1 border-2 rounded-2xl p-4 cursor-pointer text-center transition-all ${
                selected === opt.key
                  ? 'border-primary bg-bg'
                  : 'border-border bg-white'
              }`}
            >
              <div className="flex justify-center mb-2">
                {opt.icon}
              </div>
              <div className="text-xs font-medium text-primary">
                {opt.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {opt.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-3.5">
          <div className="text-xs text-gray-600 mb-1.5">your name</div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Arjun Mehta"
            className="w-full px-3.5 py-2.5 border border-border rounded-xl text-xs text-primary outline-none bg-white"
          />
        </div>

        <div className="mb-3.5">
          <div className="text-xs text-gray-600 mb-1.5">neighborhood/city</div>
          <input
            type="text"
            value={university}
            onChange={e => setUniversity(e.target.value)}
            placeholder="e.g. Lower East Side, Williamsburg..."
            className="w-full px-3.5 py-2.5 border border-border rounded-xl text-xs text-primary outline-none bg-white"
          />
        </div>

        <div className="mb-3.5">
          <div className="text-xs text-gray-600 mb-1.5">photo</div>
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 bg-bg flex items-center justify-center cursor-pointer flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="3.5" stroke="#CCCCCC" strokeWidth="1.2" />
                <path d="M3 8.5V16a2 2 0 002 2h12a2 2 0 002-2V8.5a2 2 0 00-2-2h-1.5l-1.5-2h-5L7.5 6.5H6a2 2 0 00-2 2z" stroke="#CCCCCC" strokeWidth="1.2" fill="none" />
              </svg>
            </div>
            <div className="text-xs text-gray-400 leading-relaxed">
              clear face photo required<br />used for ID verification
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => isValid && onNext(selected!, name, university)}
        className={`w-full px-4 py-4 border-none rounded-full text-sm font-medium transition-colors ${
          isValid
            ? 'bg-primary text-white cursor-pointer hover:bg-gray-900'
            : 'bg-gray-200 text-gray-400 cursor-default'
        }`}
      >
        continue
      </button>
    </div>
  )
}