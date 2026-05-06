import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: any
  profile: any
  loading: boolean
  sendOTP: (contact: string) => Promise<{ error: any }>
  verifyOTP: (contact: string, token: string) => Promise<{ error: any }>
  saveProfile: (data: any) => Promise<{ error: any }>
  loadProfile: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,

  sendOTP: async (contact: string) => {
    const email = contact.includes('@')
      ? contact
      : `${contact.replace(/\D/g, '')}@vedo.app`
    const { error } = await supabase.auth.signInWithOtp({ email })
    return { error }
  },

  verifyOTP: async (contact: string, token: string) => {
    const email = contact.includes('@')
      ? contact
      : `${contact.replace(/\D/g, '')}@vedo.app`
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })
    if (data.user) set({ user: data.user })
    return { error }
  },

  saveProfile: async (data: any) => {
    const user = get().user
    if (!user) return { error: 'No user' }
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      ...data,
      updated_at: new Date().toISOString()
    })
    if (!error) set({ profile: data })
    return { error }
  },

  loadProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    set({ user })
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) set({ profile: data })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  }
}))