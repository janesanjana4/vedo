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
    <div className="flex flex-col min-h-screen bg-white px-5 pb-10">
      <div className="h-1 bg-gray-100">
        <div className="h-1 bg-primary w-11/12 rounded" />
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
          what's your vibe<br />in the kitchen?
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          honest answers make the best matches. no judgement.
        </p>

        {/* Persona grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {personas.map(p => (
            <div
              key={p.key}
              onClick={() => { setPersona(p.key); setDiet(null) }}
              className={`border-2 rounded-2xl p-3.5 text-center cursor-pointer transition-all ${
                persona === p.key
                  ? 'border-primary bg-gray-50'
                  : 'border-border bg-white'
              }`}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-2.5 text-lg"
                style={{ background: p.circleBg }}
              >
                {p.emoji}
              </div>
              <div className="text-sm font-medium text-primary mb-1">
                {p.name}
              </div>
              <div className="text-xs text-gray-600 leading-snug">
                {p.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Diet section — slides in */}
        {needsDiet && (
          <div className="mb-5">
            <div className="text-xs text-gray-500 mb-2.5">
              and your kitchen preference?
            </div>
            {dietOptions.map(d => (
              <div
                key={d.key}
                onClick={() => setDiet(d.key)}
                className={`border-2 rounded-lg p-3 mb-2 flex items-center gap-3 cursor-pointer transition-all ${
                  diet === d.key
                    ? 'border-primary bg-gray-50'
                    : 'border-border bg-white'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full flex-shrink-0 ${
                    diet === d.key
                      ? 'border-2 border-primary bg-primary'
                      : 'border-2 border-border bg-transparent'
                  }`}
                />
                <div>
                  <div className="text-sm font-medium text-primary">
                    {d.label}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {d.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview box */}
        <div className="bg-gray-50 rounded-lg p-3.5 mb-5 flex items-center gap-2.5">
          {persona && (
            <div
              className="w-7.5 h-7.5 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
              style={{ background: personas.find(p => p.key === persona)?.circleBg }}
            >
              {personas.find(p => p.key === persona)?.emoji}
            </div>
          )}
          <div
            className={`text-xs leading-relaxed ${
              persona ? 'text-primary not-italic' : 'text-gray-500 italic'
            }`}
          >
            {getPreview()}
          </div>
        </div>
      </div>

      <button
        onClick={() => isValid && onNext({ persona: persona!, diet: diet || '' })}
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