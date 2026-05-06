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
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: '#ffffff', padding: '0 20px 40px',
    }}>
      <div style={{ height: 3, background: '#F0F0F0' }}>
        <div style={{ height: 3, background: '#1a1a1a', width: '75%', borderRadius: 2 }} />
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
          your living<br />preferences
        </h1>
        <p style={{ fontSize: 13, color: '#999999', marginBottom: 24, fontFamily: 'inherit' }}>
          helps us find the best matches for you.
        </p>

        {/* Budget slider */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#AAAAAA', fontFamily: 'inherit' }}>monthly budget</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>${budget.toLocaleString()}/mo</span>
          </div>
          <input
            type="range" min={400} max={3500} step={50}
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#1a1a1a' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#CCCCCC', fontFamily: 'inherit' }}>$400</span>
            <span style={{ fontSize: 10, color: '#CCCCCC', fontFamily: 'inherit' }}>$3,500</span>
          </div>
        </div>

        {/* Room type */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#AAAAAA', marginBottom: 8, fontFamily: 'inherit' }}>room type</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['private room', 'shared room ok', 'full apartment'].map(r => (
              <div key={r} onClick={() => setRoomType(r)} style={{
                padding: '8px 14px', borderRadius: 30,
                border: `1px solid ${roomType === r ? '#1a1a1a' : '#E8E8E8'}`,
                background: roomType === r ? '#1a1a1a' : '#ffffff',
                color: roomType === r ? '#ffffff' : '#888888',
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}>{r}</div>
            ))}
          </div>
        </div>

        {/* Lifestyle */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#AAAAAA', marginBottom: 8, fontFamily: 'inherit' }}>lifestyle</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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
                style={{
                  border: `1px solid ${lifestyle.includes(item.val) ? '#1a1a1a' : '#E8E8E8'}`,
                  borderRadius: 12, padding: '10px 12px',
                  background: lifestyle.includes(item.val) ? '#FAFAFA' : '#ffffff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 16 }}>{item.emoji}</span>
                <span style={{
                  fontSize: 11, fontFamily: 'inherit',
                  color: lifestyle.includes(item.val) ? '#1a1a1a' : '#555555',
                  fontWeight: lifestyle.includes(item.val) ? 500 : 400,
                }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aesthetic */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#AAAAAA', marginBottom: 8, fontFamily: 'inherit' }}>room aesthetic (pick up to 2)</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['minimal', 'cozy', 'modern', 'desi vibes', 'aesthetic'].map(a => (
              <div key={a} onClick={() => toggleAesthetic(a)} style={{
                padding: '8px 14px', borderRadius: 30,
                border: `1px solid ${aesthetic.includes(a) ? '#1a1a1a' : '#E8E8E8'}`,
                background: aesthetic.includes(a) ? '#1a1a1a' : '#ffffff',
                color: aesthetic.includes(a) ? '#ffffff' : '#888888',
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}>{a}</div>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#AAAAAA', marginBottom: 8, fontFamily: 'inherit' }}>bathrooms</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['1', '2', '2+'].map(b => (
              <div key={b} onClick={() => setBathrooms(b)} style={{
                padding: '8px 20px', borderRadius: 30,
                border: `1px solid ${bathrooms === b ? '#1a1a1a' : '#E8E8E8'}`,
                background: bathrooms === b ? '#1a1a1a' : '#ffffff',
                color: bathrooms === b ? '#ffffff' : '#888888',
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}>{b}</div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#AAAAAA', textAlign: 'center', fontFamily: 'inherit', marginBottom: 16 }}>
          you can update these anytime in settings
        </p>
      </div>

      <button
        onClick={() => isValid && onNext({ budget_min: budget - 200, budget_max: budget, room_type: roomType, aesthetic, bathrooms, no_smoking: lifestyle.includes('no smoking'), veg_kitchen: lifestyle.includes('veg kitchen'), non_veg_ok: lifestyle.includes('non-veg ok'), early_sleeper: lifestyle.includes('early sleeper'), night_owl: lifestyle.includes('night owl'), pets_ok: lifestyle.includes('pets ok'), no_pets: lifestyle.includes('no pets') })}
        style={{
          width: '100%', padding: '16px',
          background: isValid ? '#1a1a1a' : '#E0E0E0',
          color: isValid ? '#ffffff' : '#AAAAAA',
          border: 'none', borderRadius: 30,
          fontSize: 15, fontWeight: 500,
          cursor: isValid ? 'pointer' : 'default',
          fontFamily: 'inherit', transition: 'background 0.2s',
        }}
      >
        continue
      </button>
    </div>
  )
}