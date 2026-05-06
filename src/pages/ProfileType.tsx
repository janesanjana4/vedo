import { useState } from 'react'

interface ProfileTypeProps {
  onNext: (type: 'individual' | 'group', name: string, university: string) => void
  onBack: () => void
}

export default function ProfileType({ onNext, onBack }: ProfileTypeProps) {
  const [selected, setSelected] = useState<'individual' | 'group' | null>(null)
  const [name, setName] = useState('')
  const [university, setUniversity] = useState('')

  const universities = [
    'Northeastern University', 'Boston University', 'MIT',
    'Harvard University', 'NYU', 'Columbia University', 'Fordham University',
    'Tufts University', 'BU', 'Other'
  ]

  const isValid = selected && name.trim().length > 1 && university.trim().length > 1

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: '#ffffff', padding: '0 20px 40px',
    }}>
      <div style={{ height: 3, background: '#F0F0F0' }}>
        <div style={{ height: 3, background: '#1a1a1a', width: '48%', borderRadius: 2 }} />
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

      <div style={{ flex: 1, paddingTop: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.25, marginBottom: 8, fontFamily: 'inherit' }}>
          who's looking<br />for a place?
        </h1>
        <p style={{ fontSize: 13, color: '#999999', marginBottom: 24, fontFamily: 'inherit' }}>
          this shapes how your profile appears to others.
        </p>

        {/* Type cards */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
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
              style={{
                flex: 1, border: `1.5px solid ${selected === opt.key ? '#1a1a1a' : '#E8E8E8'}`,
                borderRadius: 14, padding: '16px 10px',
                background: selected === opt.key ? '#FAFAFA' : '#ffffff',
                cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                {opt.icon}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>
                {opt.label}
              </div>
              <div style={{ fontSize: 10, color: '#AAAAAA', marginTop: 2, fontFamily: 'inherit' }}>
                {opt.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Name input */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: '#999999', marginBottom: 5, fontFamily: 'inherit' }}>your name</div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Arjun Mehta"
            style={{
              width: '100%', padding: '11px 14px',
              border: '1px solid #E8E8E8', borderRadius: 12,
              fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit',
              outline: 'none', background: '#ffffff',
            }}
          />
        </div>

        {/* University input */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: '#999999', marginBottom: 5, fontFamily: 'inherit' }}>university</div>
          <input
            type="text"
            value={university}
            onChange={e => setUniversity(e.target.value)}
            placeholder="e.g. Northeastern, BU, NYU..."
            list="universities"
            style={{
              width: '100%', padding: '11px 14px',
              border: '1px solid #E8E8E8', borderRadius: 12,
              fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit',
              outline: 'none', background: '#ffffff',
            }}
          />
          <datalist id="universities">
            {universities.map(u => <option key={u} value={u} />)}
          </datalist>
        </div>

        {/* Photo upload */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: '#999999', marginBottom: 5, fontFamily: 'inherit' }}>photo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              border: '1.5px dashed #D0D0D0', background: '#FAFAFA',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="3.5" stroke="#CCCCCC" strokeWidth="1.2" />
                <path d="M3 8.5V16a2 2 0 002 2h12a2 2 0 002-2V8.5a2 2 0 00-2-2h-1.5l-1.5-2h-5L7.5 6.5H6a2 2 0 00-2 2z" stroke="#CCCCCC" strokeWidth="1.2" fill="none" />
              </svg>
            </div>
            <div style={{ fontSize: 11, color: '#BBBBBB', lineHeight: 1.5, fontFamily: 'inherit' }}>
              clear face photo required<br />used for ID verification
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => isValid && onNext(selected!, name, university)}
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