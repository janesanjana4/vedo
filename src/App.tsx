import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Splash from './pages/Splash'
import PhoneEntry from './pages/PhoneEntry'
import OTPVerify from './pages/OTPVerify'
import ProfileType from './pages/ProfileType'
import CityIntent from './pages/CityIntent'
import Preferences from './pages/Preferences'
import Kitchen from './pages/Kitchen'
import SwipeDeck from './pages/SwipeDeck'
import Messages from './pages/Messages'
import ProfilePage from './pages/Profile'

type Screen = 'loading' | 'splash' | 'phone' | 'otp' | 'profiletype' | 'city' | 'preferences' | 'kitchen' | 'swipe' | 'messages' | 'profile'

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [phone, setPhone] = useState('')
  const [onboardingData, setOnboardingData] = useState<any>({})

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (data?.university) {
            setScreen('swipe')
          } else {
            setScreen('profiletype')
          }
        } else {
          setScreen('splash')
        }
      } catch {
        setScreen('splash')
      }
    }
    init()
  }, [])

  const saveToSupabase = async (finalData: any) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const uid = session.user.id
    await supabase.from('users').upsert({
      id: uid,
      ...onboardingData,
      ...finalData,
      updated_at: new Date().toISOString()
    })
    if (finalData.preferences || onboardingData.preferences) {
      await supabase.from('preferences').upsert({
        user_id: uid,
        ...onboardingData.preferences,
        ...finalData.preferences,
      })
    }
  }

  if (screen === 'loading') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#ffffff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit', marginBottom: 8 }}>
          vedo<span style={{ color: '#D85A30' }}>.</span>
        </div>
        <div style={{ fontSize: 13, color: '#CCCCCC', fontFamily: 'inherit' }}>loading...</div>
      </div>
    </div>
  )

  if (screen === 'splash') return (
    <Splash
      onGetStarted={() => setScreen('phone')}
      onSignIn={() => setScreen('phone')}
    />
  )

  if (screen === 'phone') return (
    <PhoneEntry
      onNext={(p) => { setPhone(p); setScreen('otp') }}
      onBack={() => setScreen('splash')}
    />
  )

  if (screen === 'otp') return (
    <OTPVerify
      phone={phone}
      onNext={() => setScreen('profiletype')}
      onBack={() => setScreen('phone')}
    />
  )

  if (screen === 'profiletype') return (
    <ProfileType
      onNext={(type: 'individual' | 'group', name: string, university: string) => {
        setOnboardingData((prev: any) => ({ ...prev, profile_type: type, name, university }))
        setScreen('city')
      }}
      onBack={() => setScreen('otp')}
    />
  )

  if (screen === 'city') return (
    <CityIntent
      onNext={(city: string, intent: string[], timeline: string) => {
        setOnboardingData((prev: any) => ({ ...prev, city, intent, move_in_timeline: timeline }))
        setScreen('preferences')
      }}
      onBack={() => setScreen('profiletype')}
    />
  )

  if (screen === 'preferences') return (
    <Preferences
      onNext={(prefs: any) => {
        setOnboardingData((prev: any) => ({ ...prev, preferences: prefs }))
        setScreen('kitchen')
      }}
      onBack={() => setScreen('city')}
    />
  )

  if (screen === 'kitchen') return (
    <Kitchen
      onNext={async (kitchen: { persona: string, diet: string }) => {
        const finalData = {
          ...onboardingData,
          preferences: {
            ...onboardingData.preferences,
            kitchen_persona: kitchen.persona,
            kitchen_diet: kitchen.diet,
          }
        }
        await saveToSupabase(finalData)
        setScreen('swipe')
      }}
      onBack={() => setScreen('preferences')}
    />
  )

  if (screen === 'swipe') return (
    <SwipeDeck
      onGoMessages={() => setScreen('messages')}
      onGoProfile={() => setScreen('profile')}
    />
  )

  if (screen === 'messages') return (
    <Messages onBack={() => setScreen('swipe')} />
  )

  if (screen === 'profile') return (
    <ProfilePage onBack={() => setScreen('swipe')} />
  )

  return (
    <SwipeDeck
      onGoMessages={() => setScreen('messages')}
      onGoProfile={() => setScreen('profile')}
    />
  )
}