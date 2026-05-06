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
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: '#ffffff', padding: '0 20px 40px',
    }}>
      <div style={{ height: 3, background: '#F0F0F0' }}>
        <div style={{ height: 3, background: '#1a1a1a', width: '60%', borderRadius: 2 }} />
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

      <div style={{ flex: 1, paddingTop: 24, overflowY: 'auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.25, marginBottom: 8, fontFamily: 'inherit' }}>
          where are you<br />headed?
        </h1>
        <p style={{ fontSize: 13, color: '#999999', marginBottom: 24, fontFamily: 'inherit' }}>
          we'll show you people in the same city.
        </p>

        {/* City cards */}
        {cities.map(c => (
          <div
            key={c.key}
            onClick={() => setCity(c.key)}
            style={{
              border: `1.5px solid ${city === c.key ? '#1a1a1a' : '#E8E8E8'}`,
              borderRadius: 14, padding: '14px 16px',
              background: city === c.key ? '#FAFAFA' : '#ffffff',
              cursor: 'pointer', marginBottom: 10,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.15s',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>{c.name}</div>
              <div style={{ fontSize: 11, color: '#999999', marginTop: 2, fontFamily: 'inherit' }}>{c.sub}</div>
            </div>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              border: `1.5px solid ${city === c.key ? '#1a1a1a' : '#E8E8E8'}`,
              background: city === c.key ? '#1a1a1a' : 'transparent',
              flexShrink: 0,
            }} />
          </div>
        ))}

        {/* Intent pills */}
        <div style={{ marginTop: 20, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: '#AAAAAA', marginBottom: 8, fontFamily: 'inherit' }}>i am looking to...</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {intents.map(i => (
              <div
                key={i}
                onClick={() => toggleIntent(i)}
                style={{
                  padding: '8px 14px', borderRadius: 30,
                  border: `1px solid ${intent.includes(i) ? '#1a1a1a' : '#E8E8E8'}`,
                  background: intent.includes(i) ? '#1a1a1a' : '#ffffff',
                  color: intent.includes(i) ? '#ffffff' : '#888888',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline pills */}
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: '#AAAAAA', marginBottom: 8, fontFamily: 'inherit' }}>move-in timeline</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {timelines.map(t => (
              <div
                key={t}
                onClick={() => setTimeline(t)}
                style={{
                  padding: '8px 14px', borderRadius: 30,
                  border: `1px solid ${timeline === t ? '#1a1a1a' : '#E8E8E8'}`,
                  background: timeline === t ? '#1a1a1a' : '#ffffff',
                  color: timeline === t ? '#ffffff' : '#888888',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => isValid && onNext(city!, intent, timeline!)}
        style={{
          width: '100%', padding: '16px',
          background: isValid ? '#1a1a1a' : '#E0E0E0',
          color: isValid ? '#ffffff' : '#AAAAAA',
          border: 'none', borderRadius: 30,
          fontSize: 15, fontWeight: 500,
          cursor: isValid ? 'pointer' : 'default',
          fontFamily: 'inherit', transition: 'background 0.2s',
          marginTop: 20,
        }}
      >
        continue
      </button>
    </div>
  )
}