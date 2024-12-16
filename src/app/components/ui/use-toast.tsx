// components/ui/use-toast.ts
import { useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState<{
    title?: string
    description?: string
    variant?: 'default' | 'destructive'
  } | null>(null)

  return {
    toast: (options: {
      title?: string
      description?: string
      variant?: 'default' | 'destructive'
    }) => {
      setToast(options)
      // Optional: Auto-dismiss after a few seconds
      setTimeout(() => setToast(null), 3000)
    },
    Toaster: () => {
      if (!toast) return null
      return (
        <div className="fixed top-4 right-4 z-50">
          <div className={`
            p-4 rounded-lg shadow-lg
            ${toast.variant === 'destructive' 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
            }`}
          >
            <div className="font-bold">{toast.title}</div>
            <div>{toast.description}</div>
          </div>
        </div>
      )
    }
  }
}