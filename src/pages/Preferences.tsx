import { useState } from 'react'

interface PreferencesProps {
  onNext: (prefs: any) => void
  onBack: () => void
}
export default function Preferences({ onNext, onBack }: PreferencesProps) {
  const [budget, setBudget] = useState(1200)
  const [roomType, setRoomType] = useState<string | null>(null)
  const [lifestyle, setLifestyle] = useState<string[]>([])
  const [aesthetic, setAesthetic] = useState<string[]>([])
  const [bathrooms, setBathrooms] = useState<string | null>(null)

  const toggleLifestyle = (val: string, pair?: string) => {
    setLifestyle(prev => {
      const filtered = pair ? prev.filter(i => i !== pair) : prev
      return filtered.includes(val) ? filtered.filter(i => i !== val) : [...filtered, val]
    })
  }

  const toggleAesthetic = (val: string) => {
    setAesthetic(prev =>
      prev.includes(val)
        ? prev.filter(i => i !== val)
        : prev.length < 2 ? [...prev, val] : prev
    )
  }

  const isValid = roomType && bathrooms

  return (
    <div className="flex flex-col min-h-screen bg-white px-5 pb-10">
      <div className="h-1 bg-gray-100">
        <div className="h-1 bg-primary w-3/4 rounded" />
      </div>

      <div className="pt-3.5">
        <button onClick={onBack} className="w-8.5 h-8.5 rounded-full border border-border bg-white cursor-pointer flex items-center justify-center hover:bg-gray-50">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex-1 pt-6 overflow-y-auto">
        <h1 className="text-xl font-medium text-primary leading-tight mb-2">
          your living<br />preferences
        </h1>
        <p className="text-xs text-gray-600 mb-6">
          helps us find the best matches for you.
        </p>

        {/* Budget slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-500">monthly budget</span>
            <span className="text-sm font-medium text-primary">${budget.toLocaleString()}/mo</span>
          </div>
          <input
            type="range" min={400} max={3500} step={50}
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">$400</span>
            <span className="text-xs text-gray-400">$3,500</span>
          </div>
        </div>

        {/* Room type */}
        <div className="mb-5">
          <div className="text-xs text-gray-500 mb-2">room type</div>
          <div className="flex gap-2 flex-wrap">
            {['private room', 'shared room ok', 'full apartment'].map(r => (
              <div key={r} onClick={() => setRoomType(r)} className={`px-3.5 py-2 rounded-full border text-xs cursor-pointer transition-all ${
                roomType === r
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-secondary'
              }`}>{r}</div>
            ))}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="mb-5">
          <div className="text-xs text-gray-500 mb-2">lifestyle</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: 'veg kitchen', pair: 'non-veg ok', emoji: '🥦' },
              { val: 'non-veg ok', pair: 'veg kitchen', emoji: '🍗' },
              { val: 'no smoking', pair: 'smoking ok', emoji: '🚭' },
              { val: 'smoking ok', pair: 'no smoking', emoji: '🚬' },
              { val: 'early sleeper', pair: 'night owl', emoji: '🌅' },
              { val: 'night owl', pair: 'early sleeper', emoji: '🌙' },
              { val: 'pets ok', pair: 'no pets', emoji: '🐾' },
              { val: 'no pets', pair: 'pets ok', emoji: '🙅' },
            ].map(item => (
              <div
                key={item.val}
                onClick={() => toggleLifestyle(item.val, item.pair)}
                className={`border rounded-lg p-3 cursor-pointer flex items-center gap-2 transition-all ${
                  lifestyle.includes(item.val)
                    ? 'border-primary bg-gray-50'
                    : 'border-border bg-white'
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                <span className={`text-xs ${
                  lifestyle.includes(item.val)
                    ? 'text-primary font-medium'
                    : 'text-secondary'
                }`}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aesthetic */}
        <div className="mb-5">
          <div className="text-xs text-gray-500 mb-2">room aesthetic (pick up to 2)</div>
          <div className="flex gap-2 flex-wrap">
            {['minimal', 'cozy', 'modern', 'desi vibes', 'aesthetic'].map(a => (
              <div key={a} onClick={() => toggleAesthetic(a)} className={`px-3.5 py-2 rounded-full border text-xs cursor-pointer transition-all ${
                aesthetic.includes(a)
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-secondary'
              }`}>{a}</div>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div className="mb-6">
          <div className="text-xs text-gray-500 mb-2">bathrooms</div>
          <div className="flex gap-2">
            {['1', '2', '2+'].map(b => (
              <div key={b} onClick={() => setBathrooms(b)} className={`px-5 py-2 rounded-full border text-xs cursor-pointer transition-all ${
                bathrooms === b
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-secondary'
              }`}>{b}</div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mb-4">
          you can update these anytime in settings
        </p>
      </div>

      <button
        onClick={() => isValid && onNext({ budget_min: budget - 200, budget_max: budget, room_type: roomType, aesthetic, bathrooms, no_smoking: lifestyle.includes('no smoking'), veg_kitchen: lifestyle.includes('veg kitchen'), non_veg_ok: lifestyle.includes('non-veg ok'), early_sleeper: lifestyle.includes('early sleeper'), night_owl: lifestyle.includes('night owl'), pets_ok: lifestyle.includes('pets ok'), no_pets: lifestyle.includes('no pets') })}
        className={`w-full px-4 py-4 border-none rounded-full text-sm font-medium transition-colors mt-5 ${
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