"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/app/auth/supabase-client'
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { LogOut, User } from 'lucide-react'

interface UserMetadata {
  avatar_url: string | null;
  // other properties if needed
}

interface User {
  id: string;
  email: string;
  user_metadata: UserMetadata | null;
}

export default function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email ?? '',
        user_metadata: {
          avatar_url: session.user.user_metadata?.avatar_url || null,
          // other properties from user_metadata if needed
        }
      } : null);
    }
    getInitialSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email ?? '',
        user_metadata: {
          avatar_url: session.user.user_metadata?.avatar_url || null,
          // other properties from user_metadata if needed
        }
      } : null);
    })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.user_metadata?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10">
            {user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-left">
          <span className="text-xs font-medium">{user.email}</span>
          <span className="text-xs text-gray-500">View profile</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-gray-500">Manage your account</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 cursor-pointer focus:text-red-600" 
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}