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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#fff' }}>
      <p style={{ color: '#999', fontFamily: 'inherit', fontSize: 14 }}>loading...</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#ffffff', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid #F5F5F5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 54, height: 54, borderRadius: '50%',
            background: colors.bg, border: '1px solid #EEEEEE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 500, color: colors.avatar, fontFamily: 'inherit',
          }}>
            {getInitials(profile?.name || '')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>
              {profile?.name || 'Your Profile'}
            </div>
            <div style={{ fontSize: 12, color: '#BBBBBB', fontFamily: 'inherit', marginTop: 2 }}>
              {profile?.university || ''}{profile?.city ? ` · ${profile.city === 'nyc' ? 'New York City' : 'Boston'}` : ''}
            </div>
          </div>
          <div style={{
            padding: '6px 12px', border: '1px solid #EEEEEE',
            borderRadius: 20, fontSize: 11, color: '#1a1a1a',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            edit
          </div>
        </div>

        {/* Status tags */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 10px', borderRadius: 20, background: '#E1F5EE', color: '#0F6E56', fontSize: 11, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2 2 5-4" stroke="#0F6E56" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {profile?.verified ? 'ID verified' : 'not verified'}
          </span>
          {profile?.preferences?.room_type && (
            <span style={{ padding: '4px 10px', borderRadius: 20, background: '#EEEDFE', color: '#534AB7', fontSize: 11, fontFamily: 'inherit' }}>
              {profile.preferences.room_type}
            </span>
          )}
          {profile?.city && (
            <span style={{ padding: '4px 10px', borderRadius: 20, background: '#F5F5F5', color: '#555555', fontSize: 11, fontFamily: 'inherit' }}>
              {profile.city === 'nyc' ? 'NYC' : 'Boston'}
            </span>
          )}
        </div>
      </div>

      {/* Settings sections */}
      <div style={{ flex: 1 }}>

        {/* Account */}
        <div style={{ padding: '10px 16px 4px' }}>
          <span style={{ fontSize: 10, color: '#BBBBBB', letterSpacing: '0.5px', fontFamily: 'inherit' }}>ACCOUNT</span>
        </div>
        {[
          { icon: '👤', label: 'edit profile', sub: '' },
          { icon: '⭐', label: 'preferences', sub: 'budget, room type, lifestyle' },
          { icon: '✅', label: 'ID verification', sub: profile?.verified ? 'verified' : 'not verified yet' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid #F8F8F8', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                {row.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit' }}>{row.label}</div>
                {row.sub && <div style={{ fontSize: 11, color: row.sub === 'verified' ? '#1D9E75' : '#BBBBBB', fontFamily: 'inherit', marginTop: 1 }}>{row.sub}</div>}
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="#CCCCCC" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </div>
        ))}

        {/* Discovery */}
        <div style={{ padding: '10px 16px 4px', marginTop: 8 }}>
          <span style={{ fontSize: 10, color: '#BBBBBB', letterSpacing: '0.5px', fontFamily: 'inherit' }}>DISCOVERY</span>
        </div>
        {[
          { label: 'show my profile', value: showProfile, toggle: () => setShowProfile(!showProfile) },
          { label: 'notifications', value: notifications, toggle: () => setNotifications(!notifications) },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid #F8F8F8' }}>
            <span style={{ fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit' }}>{row.label}</span>
            <div
              onClick={row.toggle}
              style={{
                width: 40, height: 22, borderRadius: 11,
                background: row.value ? '#1a1a1a' : '#E0E0E0',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: 2,
                left: row.value ? 20 : 2,
                width: 18, height: 18, borderRadius: '50%',
                background: '#ffffff', transition: 'left 0.2s',
              }} />
            </div>
          </div>
        ))}

        {/* Support */}
        <div style={{ padding: '10px 16px 4px', marginTop: 8 }}>
          <span style={{ fontSize: 10, color: '#BBBBBB', letterSpacing: '0.5px', fontFamily: 'inherit' }}>SUPPORT</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid #F8F8F8', cursor: 'pointer' }}>
          <span style={{ fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit' }}>help & safety</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="#CCCCCC" strokeWidth="1.3" strokeLinecap="round" /></svg>
        </div>

        {/* Sign out */}
        <div style={{ padding: 16, marginTop: 8 }}>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', padding: '14px',
              background: '#ffffff', color: '#E24B4A',
              border: '1.5px solid #FCEBEB', borderRadius: 30,
              fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            sign out
          </button>
        </div>

        <div style={{ padding: '0 16px 32px', textAlign: 'center' }}>
          <VedoLogo width={40} />
          <p style={{ fontSize: 10, color: '#CCCCCC', marginTop: 6, fontFamily: 'inherit' }}>vedo · find your people, find your place</p>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0 16px', borderTop: '1px solid #F0F0F0', background: '#ffffff', position: 'sticky', bottom: 0 }}>
        {[
          { key: 'home', onClick: onBack, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10L10 3l7 7v7H13v-4H7v4H3z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg> },
          { key: 'discover', onClick: onBack, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 17c0-3 3-5 7-5s7 2 7 5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg> },
          { key: 'messages', onClick: onBack, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 13c0 .6-.4 1-1 1H6l-3 3V4c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v9z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg> },
          { key: 'profile', onClick: () => {}, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg> },
        ].map(tab => (
          <div key={tab.key} onClick={tab.onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer', padding: '2px 12px', color: tab.key === 'profile' ? '#1a1a1a' : '#CCCCCC' }}>
            {tab.icon}
          </div>
        ))}
      </div>
    </div>
  )
}