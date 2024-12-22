'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signInWithEmail, isAuthenticated } from '../auth/supabase-client'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card"
import { Icons } from "@/app/components/ui/icons"
import { useToast } from "@/app/components/ui/use-toast"
import {AnimatedDemo} from '@/app/components/ui/animated-demo' 


export default function SignIn() {
    const router = useRouter()
    const { toast } = useToast()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const checkAuthStatus = async () => {
            const authenticated = await isAuthenticated()
            if (authenticated) {
                router.push('/chat')
            }
        }
        checkAuthStatus()
    }, [router])

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await signInWithEmail({ email, password })
            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error signing in",
                    description: error.message,
                })
            } else {
                router.push('/chat')
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Icons.database className="mr-2 h-6 w-6" />
                    Text to SQL
                </div>
                <div className="relative z-20 flex-grow flex flex-col justify-center">
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 h-[400px]">
                        <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                            <AnimatedDemo />
                        </div>
                    </div>
                    <blockquote className="mt-8">
                        <p className="text-lg text-center">
                            Transform your natural language into SQL queries effortlessly.
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
                            <CardDescription className="text-center">
                                Enter your email and password to sign in
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignIn}>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
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
                                        />
                                    </div>
                                    <Button disabled={isLoading}>
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Sign In
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <div className="text-sm text-muted-foreground text-center">
                                Don't have an account?{" "}
                                <Link href="/sign-up" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}