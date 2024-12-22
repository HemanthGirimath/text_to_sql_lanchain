'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../auth/useAuthContext'
import { isAuthenticated } from '../auth/supabase-client'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { currentSession } = useAuthContext()

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        router.push('/sign-in')
      }
    }
    checkAuth()
  }, [router, currentSession])

  return <>{children}</>
}
