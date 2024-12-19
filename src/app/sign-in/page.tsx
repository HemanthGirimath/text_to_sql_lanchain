// sign-in/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signInWithEmail, isAuthenticated } from '../auth/supabase-client'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import Link from "next/link"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"

export default function SignIn() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertContent, setAlertContent] = useState({
        title: '',
        description: '',
        isError: false
    })

    useEffect(() => {
        const checkAuthStatus = async () => {
            const authenticated = await isAuthenticated()
            setIsUserAuthenticated(authenticated)
            if (authenticated) {
                showMessage(
                    "Already signed in",
                    "You are already signed in.",
                    
                )
            }
        }
        checkAuthStatus()
    }, [router])

    const showMessage = (title: string, description: string, isError: boolean = false) => {
        setAlertContent({ title, description, isError })
        setShowAlert(true)
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const { error } = await signInWithEmail({ email, password })

        if (error) {
            showMessage(
                "Login Failed",
                error.message || "Unable to log in. Please try again.",
                true
            )
            setIsLoading(false)
            return
        }

        showMessage(
            "Success",
            "Logged in successfully! Redirecting...",
            false
        )

        // Redirect after a short delay
        setTimeout(() => {
            router.push('/chat')
        }, 2000)
    }

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2">
            <div className="hidden bg-muted lg:block">
                {/* <img
                    alt="Login background"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                /> */}
            </div>

            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSignIn} className="grid gap-4">
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
                            {isLoading ? "Signing in..." : 
                             isUserAuthenticated ? "Already signed in" : 
                             "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <Link href="/sign-up" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className={alertContent.isError ? "text-destructive" : "text-primary"}>
                            {alertContent.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertContent.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlert(false)}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}