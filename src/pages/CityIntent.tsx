import { useState } from 'react'

interface CityIntentProps {
  onNext: (city: string, intent: string[], timeline: string) => void
  onBack: () => void
}
export default function CityIntent({ onNext, onBack }: CityIntentProps) {
  const [city, setCity] = useState<'nyc' | 'boston' | null>(null)
  const [intent, setIntent] = useState<string[]>([])
  const [timeline, setTimeline] = useState<string | null>(null)

  const toggleIntent = (val: string) => {
    setIntent(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val])
  }

  const isValid = city && intent.length > 0 && timeline

  const cities = [
    { key: 'nyc' as const, name: 'New York City', sub: 'Manhattan · Brooklyn · Queens · Astoria' },
    { key: 'boston' as const, name: 'Boston', sub: 'Allston · Brighton · Back Bay · Fenway' },
  ]

  const intents = ['find a room', 'find a roommate', 'list my place']
  const timelines = ['ASAP', '1–2 months', '3+ months']

  return (
    <div className="flex flex-col min-h-screen bg-white px-5 pb-10">
      <div className="h-1 bg-gray-100">
        <div className="h-1 bg-primary w-16 rounded" />
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
          where are you<br />headed?
        </h1>
        <p className="text-xs text-gray-600 mb-6">
          we'll show you people in the same city.
        </p>

        {cities.map(c => (
          <div
            key={c.key}
            onClick={() => setCity(c.key)}
            className={`border-2 rounded-2xl p-3.5 cursor-pointer mb-2.5 flex justify-between items-center transition-all ${
              city === c.key
                ? 'border-primary bg-bg'
                : 'border-border bg-white'
            }`}
          >
            <div>
              <div className="text-sm font-medium text-primary">{c.name}</div>
              <div className="text-xs text-gray-600 mt-0.5">{c.sub}</div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                city === c.key
                  ? 'border-primary bg-primary'
                  : 'border-border bg-transparent'
              }`}
            />
          </div>
        ))}

        <div className="mt-5 mb-2">
          <div className="text-xs text-gray-500 mb-2">i am looking to...</div>
          <div className="flex gap-2 flex-wrap">
            {intents.map(i => (
              <div
                key={i}
                onClick={() => toggleIntent(i)}
                className={`px-3.5 py-2 rounded-full border text-xs cursor-pointer transition-all ${
                  intent.includes(i)
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-secondary'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 mb-2">
          <div className="text-xs text-gray-500 mb-2">move-in timeline</div>
          <div className="flex gap-2 flex-wrap">
            {timelines.map(t => (
              <div
                key={t}
                onClick={() => setTimeline(t)}
                className={`px-3.5 py-2 rounded-full border text-xs cursor-pointer transition-all ${
                  timeline === t
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-secondary'
                }`}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => isValid && onNext(city!, intent, timeline!)}
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