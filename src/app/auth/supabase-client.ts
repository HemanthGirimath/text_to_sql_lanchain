import { createClient, SupabaseClient, Session, AuthError } from '@supabase/supabase-js'

interface AuthResponse {
  session: Session | null
  error: AuthError | null
}

interface UserCredentials {
  email: string
  password: string
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

let supabaseClient: SupabaseClient | null = null

// Sign In functionality
export async function signInWithEmail(credentials: UserCredentials): Promise<AuthResponse> {
  const supabase = getSupabaseClient()
  try {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })
    console.log(session)
    return { session, error }
  } catch (error) {
    return { session: null, error: error as AuthError }
  }
}

// Sign Up functionality
export async function signUpWithEmail(credentials: UserCredentials): Promise<AuthResponse> {
  const supabase = getSupabaseClient()
  try {
    const { data: { session }, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    return { session, error }
  } catch (error) {
    return { session: null, error: error as AuthError }
  }
}

// Password Reset
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClient()
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  } catch (error) {
    return { error: error as AuthError }
  }
}

// Update Password
export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClient()
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { error }
  } catch (error) {
    return { error: error as AuthError }
  }
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true, // Change this to true if you want to persist across browser sessions
          storage: window.sessionStorage, // Using sessionStorage for session-only persistence
          autoRefreshToken: true,
          detectSessionInUrl: true
        },
      }
    )
  }
  return supabaseClient
}

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = getSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Helper to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession()
  return session !== null
}

// Subscribe to auth changes
export function subscribeToAuthChanges(callback: (session: Session | null) => void) {
  const supabase = getSupabaseClient()
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })

  return subscription
}