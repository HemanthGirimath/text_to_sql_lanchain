'use client'
import { useEffect, useState } from 'react'
import { getSupabaseClient, getCurrentSession, } from './supabase-client'
import { Session } from '@supabase/supabase-js'

export function useAuthContext() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null)

  useEffect(() => {
    const refreshSession = async () => {
      const supabase = getSupabaseClient()
      const { data } = await supabase.auth.getSession()
      if (data.session && data.session.expires_at && data.session.expires_at * 1000 < Date.now() + 60 * 1000) {
        // Session is about to expire, refresh it
        await supabase.auth.refreshSession()
      }
    }

    const interval = setInterval(refreshSession, 60 * 1000) // Check every 60 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getSession = async () => {
      const session = await getCurrentSession()
      setCurrentSession(session)
    }
    getSession()
  }, [])

  return { currentSession }
}