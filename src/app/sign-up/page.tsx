// sign-up/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signUpWithEmail, isAuthenticated } from '../auth/supabase-client'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import Link from "next/link"
import { useToast } from "@/app/components/ui/use-toast"
import { Toaster } from "@/app/components/ui/toaster"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"

export default function SignUp() {
    const router = useRouter()
    const { toast } = useToast()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
    const [alertContent, setAlertContent] = useState({
        title: '',
        description: '',
        isError: false
    })

    const [showAlert, setShowAlert] = useState(false)
    useEffect(() => {
        const checkAuthStatus = async () => {
            const authenticated = await isAuthenticated()
            setIsUserAuthenticated(authenticated)
            if (authenticated) {
                router.push('/dashboard')
            }
        }
        checkAuthStatus()
    }, [router])

    const showMessage = (title: string, description: string, isError: boolean = false) => {
        setAlertContent({ title, description, isError })
        setShowAlert(true)
    }
    

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
    
        const { error } = await signUpWithEmail({ email, password })
    
        if (error) {
            showMessage(
                "Sign Up Failed",
                error.message || "Unable to sign up. Please try again.",
                true
            )
            setIsLoading(false)
            return
        }
    
        showMessage(
            "Success",
            "Account created successfully! Please check your email to verify your account.",
            false
        )
    
        // Redirect after a short delay
        setTimeout(() => {
            router.push('/auth/verify-email')
        }, 2000)
    }

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2">
            <div className="hidden bg-muted lg:block">
                <img
                    alt="Sign Up background"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>

            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Create Account</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your details to create your account
                        </p>
                    </div>

                    <form onSubmit={handleSignUp} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isUserAuthenticated}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isUserAuthenticated}
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isLoading || isUserAuthenticated}
                        >
                            {isLoading ? "Creating account..." : 
                             isUserAuthenticated ? "Already signed in" : 
                             "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}