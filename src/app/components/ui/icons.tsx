import {
  Loader2,
  Terminal,
  LogOut,
  Settings,
  User,
  Database,
  Code,
  type Icon as LucideIcon,
} from "lucide-react"

export type Icon = typeof LucideIcon

export const Icons = {
  logo: Terminal,
  spinner: Loader2,
  logout: LogOut,
  settings: Settings,
  user: User,
  database: Database,
  code: Code,
}