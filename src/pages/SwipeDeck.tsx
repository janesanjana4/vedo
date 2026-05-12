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
    <div className="flex flex-col h-screen bg-white">

      {/* Top nav */}
      <div className="px-4.5 py-3.5 pb-2.5 flex justify-between items-center border-b border-gray-100">
        <VedoLogo width={56} />
        <div className="flex gap-2">
          <div className="w-8.5 h-8.5 rounded-full border border-border bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><line x1="2" y1="4" x2="14" y2="4" stroke="#1a1a1a" strokeWidth="1.4" /><line x1="4" y1="8" x2="12" y2="8" stroke="#1a1a1a" strokeWidth="1.4" /><line x1="6" y1="12" x2="10" y2="12" stroke="#1a1a1a" strokeWidth="1.4" /></svg>
          </div>
          <div onClick={onGoProfile} className="w-8.5 h-8.5 rounded-full border border-border bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="3" stroke="#1a1a1a" strokeWidth="1.4" fill="none" /><path d="M3 14c0-3 2.2-5 5-5s5 2 5 5" stroke="#1a1a1a" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 px-3.5 py-2.5 overflow-x-auto border-b border-gray-100" style={{ scrollbarWidth: 'none' }}>
        {UNI_FILTERS.map(f => (
          <div key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1 rounded-full whitespace-nowrap border text-xs font-medium cursor-pointer transition-all ${
            activeFilter === f
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-secondary'
          }`}>{f}</div>
        ))}
      </div>

      {/* Card stack */}
      <div className="flex-1 px-3.5 pt-2 relative overflow-hidden">
        <div className="relative h-104">

          {third && (
            <div className="absolute top-0 left-0 right-0" style={{ transform: 'scale(0.94) translateY(20px)', transformOrigin: 'top center', zIndex: 1 }}>
              <ProfileCard profile={third} />
            </div>
          )}

          {second && (
            <div className="absolute top-0 left-0 right-0" style={{ transform: 'scale(0.97) translateY(10px)', transformOrigin: 'top center', zIndex: 2 }}>
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
              className="absolute top-0 left-0 right-0 z-30 select-none"
              style={{
                transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
                transformOrigin: 'top center',
                cursor: dragging ? 'grabbing' : 'grab',
                transition: dragging ? 'none' : 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
            >
              <ProfileCard profile={top} likeOpacity={likeOpacity} nopeOpacity={nopeOpacity} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <span className="text-4xl">🎉</span>
              <p className="text-sm text-gray-500">you've seen everyone nearby</p>
              <p className="text-xs text-gray-400">check back soon</p>
            </div>
          )}

          {matchProfile && (
            <div className="absolute inset-0 rounded-2xl bg-white bg-opacity-97 flex flex-col items-center justify-center gap-3 z-50 p-6 text-center">
              <p className="text-xs tracking-widest text-gray-400 uppercase">it's a match</p>
              <VedoLogo width={80} />
              <p className="text-xl font-medium text-primary">
                you & {matchProfile.name.split(' ')[0]}
              </p>
              <p className="text-xs text-gray-500">you both swiped right on each other</p>
              <div className="flex gap-3">
                <div className="w-14.5 h-14.5 rounded-full flex items-center justify-center text-base font-medium" style={{ background: matchProfile.avatarBg, color: matchProfile.avatarText }}>{matchProfile.initials}</div>
                <div className="w-14.5 h-14.5 rounded-full bg-gray-100 flex items-center justify-center text-base font-medium text-gray-600">ME</div>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {[matchProfile.university, matchProfile.budget, matchProfile.state].filter(Boolean).map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-green-50 text-green-900 text-xs">{tag}</span>
                ))}
              </div>
              <button onClick={() => { setMatchProfile(null); onGoMessages?.() }} className="w-full px-4 py-3.5 bg-primary text-white border-none rounded-full text-sm font-medium cursor-pointer hover:bg-gray-900">
                send a message
              </button>
              <p onClick={() => setMatchProfile(null)} className="text-xs text-gray-400 cursor-pointer">keep swiping</p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center items-center gap-4.5 py-3">
        <button onClick={handlePass} className="w-12.5 h-12.5 rounded-full border border-border bg-white cursor-pointer flex items-center justify-center hover:bg-gray-50">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="#E24B4A" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <button className="w-10.5 h-10.5 rounded-full border border-border bg-white cursor-pointer flex items-center justify-center hover:bg-gray-50">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5l1.4 3 3.3.5-2.4 2.3.6 3.2L7.5 9l-2.9 1.5.6-3.2L2.8 5l3.3-.5z" fill="#D85A30" /></svg>
        </button>
        <button onClick={handleLike} className="w-15 h-15 rounded-full bg-primary border-none cursor-pointer flex items-center justify-center hover:bg-gray-900">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 19s-8-5.5-8-11a5 5 0 0114 0c0 5.5-8 11-8 11H11z" fill="#ffffff" /></svg>
        </button>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-around py-3 pb-4 border-t border-gray-100 bg-white">
        {tabs.map(tab => (
          <div key={tab.key} onClick={() => { setActiveTab(tab.key); tab.onClick?.() }} className="flex flex-col items-center gap-0.75 cursor-pointer px-3 py-0.5" style={{ color: activeTab === tab.key ? '#1a1a1a' : '#CCCCCC' }}>
            {tab.icon}
            {tab.key === 'messages' && <div className="w-1 h-1 rounded-full bg-warning" />}
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
    <div className="bg-white rounded-2xl border border-border overflow-hidden relative h-104">
      <div className="h-46 relative" style={{ background: profile.bg }}>
        <div className="absolute top-2.5 left-2.5 bg-white bg-opacity-88 rounded-2xl px-2 py-0.75 text-xs font-medium text-primary">
          {profile.university}
        </div>
        {profile.isGroup && (
          <div className="absolute top-2.5 right-2.5 bg-gray-900 bg-opacity-65 rounded-2xl px-2 py-0.75 text-xs text-white">
            group
          </div>
        )}
        <div className="absolute -bottom-6.5 left-4 w-15 h-15 rounded-full flex items-center justify-center text-lg font-medium border-4 border-white" style={{ background: profile.avatarBg, color: profile.avatarText }}>
          {profile.initials}
        </div>
        {profile.verified && (
          <div className="absolute -bottom-5.5 left-14.5 w-4.25 h-4.25 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-3.5" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        )}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-2xl font-medium text-emerald-600 border-2.5 border-emerald-600 rounded-lg px-3.5 py-1.25" style={{ opacity: likeOpacity }}>LIKE</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-2xl font-medium text-red-500 border-2.5 border-red-500 rounded-lg px-3.5 py-1.25" style={{ opacity: nopeOpacity }}>NOPE</div>
      </div>

      <div className="px-3.5 pt-8 pb-2.5">
        <div className="text-base font-medium text-primary">
          {profile.name}{profile.age ? `, ${profile.age}` : ''}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {profile.zone}{profile.state ? ` · ${profile.state}` : ''}
        </div>
        <div className="text-xs text-secondary mt-1.75 leading-normal line-clamp-2">
          {profile.bio}
        </div>
        {profile.prefs && profile.prefs.length > 0 && (
          <div className="grid grid-cols-2 gap-1.25 mt-2.25">
            {profile.prefs.slice(0, 4).map((p: any) => (
              <div key={p.label} className="bg-gray-50 rounded-lg p-1.5 flex items-center gap-1.25">
                <span className="text-sm">{p.emoji}</span>
                <span className="text-xs text-secondary">{p.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-2.25 bg-gray-50 rounded-2xl px-2.5 py-2">
          <span className="text-3.5">🍽️</span>
          <span className="text-xs">
            <strong className="text-primary">{profile.kitchen.persona}</strong>
            {profile.kitchen.diet ? <span className="text-gray-600"> · {profile.kitchen.diet}</span> : null}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-3.5 py-3 border-t border-gray-100 flex justify-between items-center bg-white">
        <span className="text-xs font-medium text-green-900 bg-green-50 px-2.5 py-0.75 rounded-full">
          {profile.budget}
        </span>
        <span className="text-xs text-gray-400">{profile.room}</span>
      </div>
    </div>
  )
}