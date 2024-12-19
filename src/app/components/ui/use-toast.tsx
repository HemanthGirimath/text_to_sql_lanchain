import { useState } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'

interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  altText?: string // Add this line
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  return {
    toast: (options: ToastProps) => {
      setToast(options)
    },
    Toaster: () => (
      <ToastPrimitive.Provider>
        <ToastPrimitive.Root
          className="bg-background p-4 rounded-md border shadow-lg z-50 w-full max-w-md"
          open={toast !== null}
          onOpenChange={() => setToast(null)}
        >
          <ToastPrimitive.Title className="font-bold">
            {toast?.title}
          </ToastPrimitive.Title>
          <ToastPrimitive.Description>
            {toast?.description}
          </ToastPrimitive.Description>
          <ToastPrimitive.Action
            altText={toast?.altText || "Close"} // Add altText here
            className={`mt-2 rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              toast?.variant === 'destructive'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            Close
          </ToastPrimitive.Action>
        </ToastPrimitive.Root>
        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 p-6 z-50 w-full md:w-auto flex flex-col gap-4 max-h-screen overflow-y-auto" />
      </ToastPrimitive.Provider>
    )
  }
}

