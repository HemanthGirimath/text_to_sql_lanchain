'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signUpWithEmail, isAuthenticated } from '../auth/supabase-client'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import Link from "next/link"
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

export default function SignUp() {
    const router = useRouter()
    const { toast } = useToast()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const checkAuthStatus = async () => {
            const authenticated = await isAuthenticated()
            if (authenticated) {
                router.push('/dashboard')
            }
        }
        checkAuthStatus()
    }, [router])

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Removed unused variable error
            const response = await signUpWithEmail({ email, password })
            if (response.error) {
                toast({
                    variant: "destructive",
                    title: "Error signing up",
                    description: response.error.message,
                })
            } else {
                toast({
                    title: "Success",
                    description: "Please check your email to verify your account",
                })
                router.push('/sign-in')
            }
        } catch (error) {
            // Removed unused variable error
            // const error = error; // Uncomment if needed
            console.log(error)
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
                            Join us and start converting your natural language to SQL queries today.
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
                            <CardDescription className="text-center">
                                Enter your email and password to create your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignUp}>
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
                                        Sign Up
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <div className="text-sm text-muted-foreground text-center">
                                Already have an account?{" "}
                                <Link href="/sign-in" className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}