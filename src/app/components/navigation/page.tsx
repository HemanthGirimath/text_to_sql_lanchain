import Link from 'next/link'
import { Button } from "../../components/ui/button"
import { Session } from '@supabase/supabase-js'

interface NavigationProps {
  currentSession: Session | null;
}


export default function Navigation({currentSession}:NavigationProps) {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            Your Logo
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          {/* <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link> */}
        </div>
      </div>
    </nav>
  )
}