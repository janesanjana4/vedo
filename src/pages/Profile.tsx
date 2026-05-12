import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import VedoLogo from '../components/VedoLogo'

interface ProfilePageProps {
  onBack: () => void
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showProfile, setShowProfile] = useState(true)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('users').select('*').eq('id', session.user.id).single().then(({ data }) => {
          if (data) setProfile(data)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const getInitials = (name: string) => {
    if (!name) return 'ME'
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const uniColors: any = {
    'Northeastern': { bg: '#EEEDFE', avatar: '#534AB7' },
    'Northeastern University': { bg: '#EEEDFE', avatar: '#534AB7' },
    'BU': { bg: '#E1F5EE', avatar: '#0F6E56' },
    'Boston University': { bg: '#E1F5EE', avatar: '#0F6E56' },
    'MIT': { bg: '#FAEEDA', avatar: '#854F0B' },
    'Harvard': { bg: '#FBEAF0', avatar: '#993556' },
    'Harvard University': { bg: '#FBEAF0', avatar: '#993556' },
    'NYU': { bg: '#FAECE7', avatar: '#993C1D' },
    'Columbia': { bg: '#E6F1FB', avatar: '#185FA5' },
    'Columbia University': { bg: '#E6F1FB', avatar: '#185FA5' },
  }

  const colors = uniColors[profile?.university] || { bg: '#F1EFE8', avatar: '#5F5E5A' }

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <p className="text-gray-600 text-sm">loading...</p>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-white overflow-y-auto">

      {/* Header */}
      <div className="px-4 py-4 pb-3.5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="w-13.5 h-13.5 rounded-full border border-gray-200 flex items-center justify-center text-lg font-medium"
            style={{ background: colors.bg, color: colors.avatar }}
          >
            {getInitials(profile?.name || '')}
          </div>
          <div className="flex-1">
            <div className="text-base font-medium text-primary">
              {profile?.name || 'Your Profile'}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {profile?.university || ''}{profile?.city ? ` · ${profile.city === 'nyc' ? 'New York City' : 'Boston'}` : ''}
            </div>
          </div>
          <div className="px-3 py-1.5 border border-gray-200 rounded-full text-xs text-primary cursor-pointer hover:bg-gray-50">
            edit
          </div>
        </div>

        {/* Status tags */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-900 text-xs flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2 2 5-4" stroke="#0F6E56" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {profile?.verified ? 'ID verified' : 'not verified'}
          </span>
          {profile?.preferences?.room_type && (
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 text-xs">
              {profile.preferences.room_type}
            </span>
          )}
          {profile?.city && (
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-secondary text-xs">
              {profile.city === 'nyc' ? 'NYC' : 'Boston'}
            </span>
          )}
        </div>
      </div>

      {/* Settings sections */}
      <div className="flex-1">

        {/* Account */}
        <div className="px-4 pt-2.5 pb-1">
          <span className="text-xs text-gray-400 tracking-wide uppercase">Account</span>
        </div>
        {[
          { icon: '👤', label: 'edit profile', sub: '' },
          { icon: '⭐', label: 'preferences', sub: 'budget, room type, lifestyle' },
          { icon: '✅', label: 'ID verification', sub: profile?.verified ? 'verified' : 'not verified yet' },
        ].map((row, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3.25 border-b border-gray-50 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-base">
                {row.icon}
              </div>
              <div>
                <div className="text-sm text-primary">{row.label}</div>
                {row.sub && <div className={`text-xs mt-0.25 ${row.sub === 'verified' ? 'text-green-600' : 'text-gray-400'}`}>{row.sub}</div>}
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="#CCCCCC" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </div>
        ))}

        {/* Discovery */}
        <div className="px-4 pt-2 pb-1 mt-2">
          <span className="text-xs text-gray-400 tracking-wide uppercase">Discovery</span>
        </div>
        {[
          { label: 'show my profile', value: showProfile, toggle: () => setShowProfile(!showProfile) },
          { label: 'notifications', value: notifications, toggle: () => setNotifications(!notifications) },
        ].map((row, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3.25 border-b border-gray-50">
            <span className="text-sm text-primary">{row.label}</span>
            <div
              onClick={row.toggle}
              className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-colors ${
                row.value ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all ${
                  row.value ? 'left-5' : 'left-0.5'
                }`}
              />
            </div>
          </div>
        ))}

        {/* Support */}
        <div className="px-4 pt-2 pb-1 mt-2">
          <span className="text-xs text-gray-400 tracking-wide uppercase">Support</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3.25 border-b border-gray-50 cursor-pointer hover:bg-gray-50">
          <span className="text-sm text-primary">help & safety</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="#CCCCCC" strokeWidth="1.3" strokeLinecap="round" /></svg>
        </div>

        {/* Sign out */}
        <div className="p-4 mt-2">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3.5 bg-white text-red-500 border-1.5 border-red-50 rounded-full text-sm font-medium cursor-pointer hover:bg-red-50"
          >
            sign out
          </button>
        </div>

        <div className="px-4 pb-8 text-center">
          <VedoLogo width={40} />
          <p className="text-xs text-gray-400 mt-1.5">vedo · find your people, find your place</p>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-around py-2.5 pb-4 border-t border-gray-100 bg-white sticky bottom-0">
        {[
          { key: 'home', onClick: onBack, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10L10 3l7 7v7H13v-4H7v4H3z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg> },
          { key: 'discover', onClick: onBack, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 17c0-3 3-5 7-5s7 2 7 5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg> },
          { key: 'messages', onClick: onBack, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 13c0 .6-.4 1-1 1H6l-3 3V4c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v9z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg> },
          { key: 'profile', onClick: () => {}, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg> },
        ].map(tab => (
          <div key={tab.key} onClick={tab.onClick} className="flex flex-col items-center gap-0.75 cursor-pointer px-3 py-0.5" style={{ color: tab.key === 'profile' ? '#1a1a1a' : '#CCCCCC' }}>
            {tab.icon}
          </div>
        ))}
      </div>
    </div>
  )
}