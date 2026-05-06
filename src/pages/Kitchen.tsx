import { useState } from 'react'

interface KitchenProps {
  onNext: (kitchen: { persona: string, diet: string }) => void
  onBack: () => void
}

const personas = [
  {
    key: 'chef',
    name: 'the chef',
    desc: 'I cook proper meals. the flat will smell amazing.',
    circleBg: '#E1F5EE',
    iconColor: '#0F6E56',
    emoji: '👨‍🍳',
    showDiet: true,
  },
  {
    key: 'cook',
    name: 'the cook',
    desc: 'I cook for myself most days. nothing fancy.',
    circleBg: '#FAEEDA',
    iconColor: '#854F0B',
    emoji: '🍳',
    showDiet: true,
  },
  {
    key: 'reheater',
    name: 'the reheater',
    desc: "Swiggy is my kitchen. I keep the sink clean.",
    circleBg: '#EEEDFE',
    iconColor: '#534AB7',
    emoji: '📦',
    showDiet: false,
  },
  {
    key: 'chai',
    name: 'the chai person',
    desc: "I make excellent chai. that's my contribution.",
    circleBg: '#FBEAF0',
    iconColor: '#993556',
    emoji: '☕',
    showDiet: false,
  },
]

const dietOptions = [
  { key: 'veg', label: 'strictly veg kitchen', sub: 'no meat cooked at home — ever' },
  { key: 'nonveg', label: 'non-veg is fine', sub: 'cook whatever you want, keep it clean' },
  { key: 'flexible', label: 'flexible — let\'s talk', sub: 'open to discussion with the right flatmate' },
]

export default function Kitchen({ onNext, onBack }: KitchenProps) {
  const [persona, setPersona] = useState<string | null>(null)
  const [diet, setDiet] = useState<string | null>(null)

  const selected = personas.find(p => p.key === persona)
  const needsDiet = selected?.showDiet
  const isValid = persona && (!needsDiet || diet)

  const getPreview = () => {
    if (!persona) return 'your kitchen personality will show on your profile'
    if (persona === 'reheater') return "You order in — you won't cook but you keep the kitchen clean."
    if (persona === 'chai') return "You make excellent chai. That's your kitchen contribution."
    if (persona === 'chef' && diet === 'veg') return "You cook full meals at home and need a strictly veg kitchen."
    if (persona === 'chef' && diet === 'nonveg') return "You cook full meals — non-veg cooking is fine with you."
    if (persona === 'chef' && diet === 'flexible') return "You cook at home and are open to discussing kitchen rules."
    if (persona === 'cook' && diet === 'veg') return "You cook for yourself — strictly veg kitchen only."
    if (persona === 'cook' && diet === 'nonveg') return "You cook for yourself — non-veg cooking is fine."
    if (persona === 'cook' && diet === 'flexible') return "You cook for yourself and are flexible about kitchen rules."
    return 'your kitchen personality will show on your profile'
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: '#ffffff', padding: '0 20px 40px',
    }}>
      <div style={{ height: 3, background: '#F0F0F0' }}>
        <div style={{ height: 3, background: '#1a1a1a', width: '88%', borderRadius: 2 }} />
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
          what's your vibe<br />in the kitchen?
        </h1>
        <p style={{ fontSize: 13, color: '#999999', marginBottom: 24, fontFamily: 'inherit' }}>
          honest answers make the best matches. no judgement.
        </p>

        {/* Persona grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {personas.map(p => (
            <div
              key={p.key}
              onClick={() => { setPersona(p.key); setDiet(null) }}
              style={{
                border: `1.5px solid ${persona === p.key ? '#1a1a1a' : '#E8E8E8'}`,
                borderRadius: 16, padding: '16px 12px 14px',
                background: persona === p.key ? '#FAFAFA' : '#ffffff',
                cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.18s',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: p.circleBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px', fontSize: 20,
              }}>
                {p.emoji}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit', marginBottom: 4 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 10, color: '#999999', fontFamily: 'inherit', lineHeight: 1.4 }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Diet section — slides in */}
        {needsDiet && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#AAAAAA', marginBottom: 10, fontFamily: 'inherit' }}>
              and your kitchen preference?
            </div>
            {dietOptions.map(d => (
              <div
                key={d.key}
                onClick={() => setDiet(d.key)}
                style={{
                  border: `1.5px solid ${diet === d.key ? '#1a1a1a' : '#E8E8E8'}`,
                  borderRadius: 12, padding: '11px 14px',
                  background: diet === d.key ? '#FAFAFA' : '#ffffff',
                  cursor: 'pointer', marginBottom: 8,
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: `1.5px solid ${diet === d.key ? '#1a1a1a' : '#E8E8E8'}`,
                  background: diet === d.key ? '#1a1a1a' : 'transparent',
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: 10, color: '#999999', fontFamily: 'inherit', marginTop: 1 }}>
                    {d.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview box */}
        <div style={{
          background: '#FAFAFA', borderRadius: 12, padding: '12px 14px',
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {persona && (
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: personas.find(p => p.key === persona)?.circleBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>
              {personas.find(p => p.key === persona)?.emoji}
            </div>
          )}
          <div style={{
            fontSize: 12, color: persona ? '#1a1a1a' : '#AAAAAA',
            fontFamily: 'inherit', lineHeight: 1.5,
            fontStyle: persona ? 'normal' : 'italic',
          }}>
            {getPreview()}
          </div>
        </div>
      </div>

      <button
        onClick={() => isValid && onNext({ persona: persona!, diet: diet || '' })}
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