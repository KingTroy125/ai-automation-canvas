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

export async function forceCreateProfile(): Promise<{ data: Profile | null, error: any }> {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No user logged in");
      return { data: null, error: 'No user logged in' };
    }
    
    console.log("Attempting to create profile for user:", user.id);
    
    // Try to delete any existing profile first to avoid conflicts
    await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);
      
    // Create a new profile with direct insert
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.name || '',
          last_name: '',
          job_title: '',
          company: '',
          bio: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error("Error creating profile:", error);
      return { data: null, error };
    }
    
    console.log("Profile created successfully:", data);
    return { data: data[0], error: null };
  } catch (err) {
    console.error("Unexpected error in forceCreateProfile:", err);
    return { data: null, error: err };
  }
} 