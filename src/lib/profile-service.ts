import { supabase } from './supabase'

export type Profile = {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  job_title?: string
  company?: string
  bio?: string
}

export async function getProfile(): Promise<{ data: Profile | null, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: 'User not authenticated' }
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return { data, error }
}

export async function updateProfile(profile: Partial<Profile>): Promise<{ data: any, error: any }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { data: null, error: 'User not authenticated' }
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profile,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
  
  return { data, error }
}

export async function getInitials(profile: Profile | null): Promise<string> {
  if (!profile) return 'U'
  
  const first = profile.first_name ? profile.first_name.charAt(0).toUpperCase() : ''
  const last = profile.last_name ? profile.last_name.charAt(0).toUpperCase() : ''
  
  if (first && last) return `${first}${last}`
  if (first) return first
  if (profile.email) return profile.email.charAt(0).toUpperCase()
  
  return 'U'
} 