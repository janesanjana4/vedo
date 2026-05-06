import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import VedoLogo from '../components/VedoLogo'

const MOCK_PROFILES = [
  {
    id: 1, name: 'Arjun Mehta', age: 24, university: 'Northeastern',
    zone: 'Allston · Mission Hill', state: 'Maharashtra',
    bio: 'CS grad student, early riser. Love cooking South Indian food on weekends.',
    budget: '$900–1,200/mo', room: 'private room',
    prefs: [{ emoji: '🥦', label: 'veg kitchen' }, { emoji: '🚭', label: 'non-smoker' }, { emoji: '🌙', label: 'early sleeper' }, { emoji: '🐾', label: 'no pets' }],
    kitchen: { persona: 'the chef', diet: 'strictly veg kitchen' },
    bg: '#EEEDFE', avatarBg: '#534AB7', avatarText: '#CECBF6', initials: 'AM',
    isGroup: false, verified: true,
  },
  {
    id: 2, name: 'Priya & Neha', age: null, university: 'NYU',
    zone: 'Greenwich Village · LES', state: 'Maharashtra',
    bio: 'Two friends from Mumbai looking for a 3rd roommate for a 3BR in Astoria.',
    budget: '$1,000–1,400/mo', room: 'private room',
    prefs: [{ emoji: '🐱', label: 'cats ok' }, { emoji: '🍷', label: 'social drinker' }, { emoji: '🛁', label: '2 bathrooms' }, { emoji: '✨', label: 'aesthetic' }],
    kitchen: { persona: 'the cook', diet: 'non-veg ok' },
    bg: '#FBEAF0', avatarBg: '#993556', avatarText: '#F4C0D1', initials: 'P+N',
    isGroup: false, verified: true,
  },
  {
    id: 3, name: 'Rohan Iyer', age: 22, university: 'BU',
    zone: 'Allston · Brookline', state: 'Karnataka',
    bio: 'MBA student. Into cricket and finding a calm place after classes.',
    budget: '$800–1,100/mo', room: 'shared ok',
    prefs: [{ emoji: '🥗', label: 'veg preferred' }, { emoji: '🚭', label: 'non-smoker' }, { emoji: '📚', label: 'study-friendly' }, { emoji: '🌙', label: 'night owl' }],
    kitchen: { persona: 'the cook', diet: 'veg only' },
    bg: '#E1F5EE', avatarBg: '#0F6E56', avatarText: '#9FE1CB', initials: 'RI',
    isGroup: false, verified: true,
  },
  {
    id: 4, name: 'Kavya Reddy', age: 25, university: 'MIT',
    zone: 'Cambridge · Somerville', state: 'Andhra Pradesh',
    bio: 'PhD data science. Loves plants, chai, and quiet evenings.',
    budget: '$1,200–1,600/mo', room: 'private room',
    prefs: [{ emoji: '🌿', label: 'plant lover' }, { emoji: '🚭', label: 'no smoking' }, { emoji: '🥦', label: 'veg kitchen' }, { emoji: '🐾', label: 'no pets' }],
    kitchen: { persona: 'the chai person', diet: '' },
    bg: '#FAEEDA', avatarBg: '#854F0B', avatarText: '#FAC775', initials: 'KR',
    isGroup: false, verified: true,
  },
  {
    id: 5, name: 'Siddharth Nair', age: 23, university: 'Columbia',
    zone: 'Morningside Heights · Harlem', state: 'Kerala',
    bio: 'Finance student. Early riser, clean freak, great at making sambhar.',
    budget: '$1,100–1,500/mo', room: 'private room',
    prefs: [{ emoji: '🥦', label: 'veg kitchen' }, { emoji: '🌅', label: 'early riser' }, { emoji: '🚭', label: 'non-smoker' }, { emoji: '🐾', label: 'no pets' }],
    kitchen: { persona: 'the chef', diet: 'strictly veg kitchen' },
    bg: '#E6F1FB', avatarBg: '#185FA5', avatarText: '#B5D4F4', initials: 'SN',
    isGroup: false, verified: true,
  },
]

const UNI_COLORS: any = {
  'Northeastern': { bg: '#EEEDFE', avatar: '#534AB7', text: '#CECBF6' },
  'Northeastern University': { bg: '#EEEDFE', avatar: '#534AB7', text: '#CECBF6' },
  'BU': { bg: '#E1F5EE', avatar: '#0F6E56', text: '#9FE1CB' },
  'Boston University': { bg: '#E1F5EE', avatar: '#0F6E56', text: '#9FE1CB' },
  'MIT': { bg: '#FAEEDA', avatar: '#854F0B', text: '#FAC775' },
  'Harvard': { bg: '#FBEAF0', avatar: '#993556', text: '#F4C0D1' },
  'Harvard University': { bg: '#FBEAF0', avatar: '#993556', text: '#F4C0D1' },
  'NYU': { bg: '#FAECE7', avatar: '#993C1D', text: '#F5C4B3' },
  'Columbia': { bg: '#E6F1FB', avatar: '#185FA5', text: '#B5D4F4' },
  'Columbia University': { bg: '#E6F1FB', avatar: '#185FA5', text: '#B5D4F4' },
}

const UNI_FILTERS = ['all nearby', 'Northeastern', 'BU', 'MIT', 'Harvard', 'NYU', 'Columbia']

type Profile = typeof MOCK_PROFILES[0]

export default function SwipeDeck({ onGoMessages, onGoProfile }: { onGoMessages?: () => void, onGoProfile?: () => void }) {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES)
  const [activeFilter, setActiveFilter] = useState('all nearby')
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [activeTab, setActiveTab] = useState('home')
  const startX = useRef(0)

  useEffect(() => {
    const fetchRealUsers = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUserId = session?.user?.id

        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('show_profile', true)
          .limit(20)

        if (data && data.length > 0) {
          const realUsers = data
            .filter((u: any) => u.id !== currentUserId && u.name)
            .map((u: any) => {
              const colors = UNI_COLORS[u.university] || { bg: '#F1EFE8', avatar: '#5F5E5A', text: '#D3D1C7' }
              const initials = u.name ? u.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '??'
              return {
                id: u.id,
                name: u.name,
                age: null,
                university: u.university || 'Unknown',
                zone: u.city === 'nyc' ? 'New York City' : 'Boston',
                state: u.home_state_india || '',
                bio: u.bio || 'Looking for a great flatmate.',
                budget: u.preferences?.[0]?.budget_max ? `Up to $${u.preferences[0].budget_max}/mo` : 'flexible',
                room: u.preferences?.[0]?.room_type || 'private room',
                prefs: [
                  u.preferences?.[0]?.veg_kitchen && { emoji: '🥦', label: 'veg kitchen' },
                  u.preferences?.[0]?.no_smoking && { emoji: '🚭', label: 'non-smoker' },
                  u.preferences?.[0]?.no_pets && { emoji: '🐾', label: 'no pets' },
                  u.preferences?.[0]?.early_sleeper && { emoji: '🌅', label: 'early sleeper' },
                ].filter(Boolean).slice(0, 4),
                kitchen: {
                  persona: u.preferences?.[0]?.kitchen_persona || 'the cook',
                  diet: u.preferences?.[0]?.kitchen_diet || '',
                },
                bg: colors.bg,
                avatarBg: colors.avatar,
                avatarText: colors.text,
                initials,
                isGroup: u.profile_type === 'group',
                verified: u.verified || false,
              }
            })

          if (realUsers.length > 0) {
            setProfiles(realUsers as Profile[])
          }
        }
      } catch (e) {
        console.log('Using mock profiles')
      }
    }
    fetchRealUsers()
  }, [])

  const filtered = activeFilter === 'all nearby'
    ? profiles
    : profiles.filter(p => p.university === activeFilter)

  const top = filtered[0]
  const second = filtered[1]
  const third = filtered[2]

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true)
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragX(x - startX.current)
  }

  const handleDragEnd = () => {
    if (!dragging) return
    setDragging(false)
    if (dragX > 80) handleLike()
    else if (dragX < -80) handlePass()
    setDragX(0)
  }

  const handleLike = () => {
    if (!top) return
    const isMatch = Math.random() > 0.5
    if (isMatch) setMatchProfile(top)
    setProfiles(prev => prev.filter(p => p.id !== top.id))
  }

  const handlePass = () => {
    if (!top) return
    setProfiles(prev => prev.filter(p => p.id !== top.id))
  }

  const rotation = dragX * 0.07
  const likeOpacity = Math.min(1, Math.max(0, (dragX - 40) / 60))
  const nopeOpacity = Math.min(1, Math.max(0, (-dragX - 40) / 60))

  const tabs = [
    { key: 'home', onClick: () => {}, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10L10 3l7 7v7H13v-4H7v4H3z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg> },
    { key: 'discover', onClick: () => {}, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 17c0-3 3-5 7-5s7 2 7 5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg> },
    { key: 'messages', onClick: onGoMessages, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 13c0 .6-.4 1-1 1H6l-3 3V4c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v9z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg> },
    { key: 'profile', onClick: onGoProfile, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#ffffff' }}>

      {/* Top nav */}
      <div style={{ padding: '14px 18px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5F5F5' }}>
        <VedoLogo width={56} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #E8E8E8', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><line x1="2" y1="4" x2="14" y2="4" stroke="#1a1a1a" strokeWidth="1.4" /><line x1="4" y1="8" x2="12" y2="8" stroke="#1a1a1a" strokeWidth="1.4" /><line x1="6" y1="12" x2="10" y2="12" stroke="#1a1a1a" strokeWidth="1.4" /></svg>
          </div>
          <div onClick={onGoProfile} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #E8E8E8', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="3" stroke="#1a1a1a" strokeWidth="1.4" fill="none" /><path d="M3 14c0-3 2.2-5 5-5s5 2 5 5" stroke="#1a1a1a" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 14px', overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid #F5F5F5' }}>
        {UNI_FILTERS.map(f => (
          <div key={f} onClick={() => setActiveFilter(f)} style={{
            padding: '5px 12px', borderRadius: 30, whiteSpace: 'nowrap',
            border: `1px solid ${activeFilter === f ? '#1a1a1a' : '#E8E8E8'}`,
            background: activeFilter === f ? '#1a1a1a' : '#ffffff',
            color: activeFilter === f ? '#ffffff' : '#888888',
            fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}>{f}</div>
        ))}
      </div>

      {/* Card stack */}
      <div style={{ flex: 1, padding: '8px 14px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 415 }}>

          {third && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, transform: 'scale(0.94) translateY(20px)', transformOrigin: 'top center', zIndex: 1 }}>
              <ProfileCard profile={third} />
            </div>
          )}

          {second && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, transform: 'scale(0.97) translateY(10px)', transformOrigin: 'top center', zIndex: 2 }}>
              <ProfileCard profile={second} />
            </div>
          )}

          {top ? (
            <div
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
                transformOrigin: 'top center', zIndex: 3,
                cursor: dragging ? 'grabbing' : 'grab',
                transition: dragging ? 'none' : 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
                userSelect: 'none',
              }}
            >
              <ProfileCard profile={top} likeOpacity={likeOpacity} nopeOpacity={nopeOpacity} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
              <span style={{ fontSize: 32 }}>🎉</span>
              <p style={{ fontSize: 14, color: '#AAAAAA', fontFamily: 'inherit' }}>you've seen everyone nearby</p>
              <p style={{ fontSize: 12, color: '#CCCCCC', fontFamily: 'inherit' }}>check back soon</p>
            </div>
          )}

          {matchProfile && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 20,
              background: 'rgba(255,255,255,0.97)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 12, zIndex: 10, padding: 24, textAlign: 'center',
            }}>
              <p style={{ fontSize: 10, letterSpacing: 2, color: '#BBBBBB', textTransform: 'uppercase', fontFamily: 'inherit' }}>it's a match</p>
              <VedoLogo width={80} />
              <p style={{ fontSize: 22, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>
                you & {matchProfile.name.split(' ')[0]}
              </p>
              <p style={{ fontSize: 12, color: '#AAAAAA', fontFamily: 'inherit' }}>you both swiped right on each other</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 58, height: 58, borderRadius: '50%', background: matchProfile.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 500, color: matchProfile.avatarText, fontFamily: 'inherit' }}>{matchProfile.initials}</div>
                <div style={{ width: 58, height: 58, borderRadius: '50%', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 500, color: '#999999', fontFamily: 'inherit' }}>ME</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {[matchProfile.university, matchProfile.budget, matchProfile.state].filter(Boolean).map(tag => (
                  <span key={tag} style={{ padding: '3px 10px', borderRadius: 20, background: '#E1F5EE', color: '#0F6E56', fontSize: 10, fontFamily: 'inherit' }}>{tag}</span>
                ))}
              </div>
              <button onClick={() => { setMatchProfile(null); onGoMessages?.() }} style={{ width: '100%', padding: '13px', background: '#1a1a1a', color: '#ffffff', border: 'none', borderRadius: 30, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                send a message
              </button>
              <p onClick={() => setMatchProfile(null)} style={{ fontSize: 11, color: '#CCCCCC', cursor: 'pointer', fontFamily: 'inherit' }}>keep swiping</p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, padding: '12px 0' }}>
        <button onClick={handlePass} style={{ width: 50, height: 50, borderRadius: '50%', border: '1px solid #E8E8E8', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="#E24B4A" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <button style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid #E8E8E8', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5l1.4 3 3.3.5-2.4 2.3.6 3.2L7.5 9l-2.9 1.5.6-3.2L2.8 5l3.3-.5z" fill="#D85A30" /></svg>
        </button>
        <button onClick={handleLike} style={{ width: 60, height: 60, borderRadius: '50%', background: '#1a1a1a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 19s-8-5.5-8-11a5 5 0 0114 0c0 5.5-8 11-8 11H11z" fill="#ffffff" /></svg>
        </button>
      </div>

      {/* Bottom nav */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0 16px', borderTop: '1px solid #F0F0F0', background: '#ffffff' }}>
        {tabs.map(tab => (
          <div key={tab.key} onClick={() => { setActiveTab(tab.key); tab.onClick?.() }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer', padding: '2px 12px', color: activeTab === tab.key ? '#1a1a1a' : '#CCCCCC' }}>
            {tab.icon}
            {tab.key === 'messages' && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D85A30' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfileCard({ profile, likeOpacity = 0, nopeOpacity = 0 }: {
  profile: Profile
  likeOpacity?: number
  nopeOpacity?: number
}) {
  return (
    <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #E8E8E8', overflow: 'hidden', height: 415, position: 'relative' }}>
      <div style={{ height: 185, background: profile.bg, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.88)', borderRadius: 20, padding: '3px 8px', fontSize: 9, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>
          {profile.university}
        </div>
        {profile.isGroup && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(26,26,26,0.65)', borderRadius: 20, padding: '3px 8px', fontSize: 9, color: '#ffffff', fontFamily: 'inherit' }}>
            group
          </div>
        )}
        <div style={{ position: 'absolute', bottom: -26, left: 16, width: 60, height: 60, borderRadius: '50%', background: profile.avatarBg, color: profile.avatarText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 500, border: '2.5px solid #ffffff', fontFamily: 'inherit' }}>
          {profile.initials}
        </div>
        {profile.verified && (
          <div style={{ position: 'absolute', bottom: -22, left: 58, width: 17, height: 17, borderRadius: '50%', background: '#1D9E75', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-3.5" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        )}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: likeOpacity, pointerEvents: 'none', fontSize: 24, fontWeight: 500, color: '#1D9E75', border: '2.5px solid #1D9E75', borderRadius: 8, padding: '5px 14px', fontFamily: 'inherit' }}>LIKE</div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: nopeOpacity, pointerEvents: 'none', fontSize: 24, fontWeight: 500, color: '#E24B4A', border: '2.5px solid #E24B4A', borderRadius: 8, padding: '5px 14px', fontFamily: 'inherit' }}>NOPE</div>
      </div>

      <div style={{ padding: '32px 14px 10px' }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>
          {profile.name}{profile.age ? `, ${profile.age}` : ''}
        </div>
        <div style={{ fontSize: 11, color: '#AAAAAA', marginTop: 2, fontFamily: 'inherit' }}>
          {profile.zone}{profile.state ? ` · ${profile.state}` : ''}
        </div>
        <div style={{ fontSize: 11, color: '#888888', marginTop: 7, lineHeight: 1.5, fontFamily: 'inherit', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {profile.bio}
        </div>
        {profile.prefs && profile.prefs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginTop: 9 }}>
            {profile.prefs.slice(0, 4).map((p: any) => (
              <div key={p.label} style={{ background: '#FAFAFA', borderRadius: 8, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 12 }}>{p.emoji}</span>
                <span style={{ fontSize: 10, color: '#888888', fontFamily: 'inherit' }}>{p.label}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 9, background: '#FAFAFA', borderRadius: 10, padding: '8px 10px' }}>
          <span style={{ fontSize: 14 }}>🍽️</span>
          <span style={{ fontSize: 11, fontFamily: 'inherit' }}>
            <strong style={{ color: '#1a1a1a' }}>{profile.kitchen.persona}</strong>
            {profile.kitchen.diet ? <span style={{ color: '#999999' }}> · {profile.kitchen.diet}</span> : null}
          </span>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 14px 12px', borderTop: '1px solid #F5F5F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#0F6E56', background: '#E1F5EE', padding: '3px 10px', borderRadius: 20, fontFamily: 'inherit' }}>
          {profile.budget}
        </span>
        <span style={{ fontSize: 10, color: '#BBBBBB', fontFamily: 'inherit' }}>{profile.room}</span>
      </div>
    </div>
  )
}