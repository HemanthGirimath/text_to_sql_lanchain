'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabaseClientLogin } from '../auth/supabase-client'
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useToast } from "@/app/components/ui/use-toast"
import { ToastProvider, ToastViewport } from "@/app/components/ui/toast"
import { Toaster } from '../components/ui/toaster'

export default function SignIn() {
    const router = useRouter()
    const { toast } = useToast()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function logIn(e: React.FormEvent) {
        e.preventDefault(); // Prevent default form submission
        
        // Basic form validation
        if (!email || !password) {
            toast({
                variant: "destructive",
                title: "Login Error",
                description: "Please enter both email and password"
            });
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await supabaseClientLogin(email, password)
            
            if (error) {
                // Handle specific error cases
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: error.message || "Unable to log in. Please try again."
                });
            } else {
                // Successful login
                toast({
                    title: "Login Successful",
                    description: "You have been logged in successfully"
                });

                // Redirect after a short delay to show the toast
                setTimeout(() => {
                    router.push('/')
                }, 1000);
            }
        } catch (err) {
            // Catch any unexpected errors
            toast({
                variant: "destructive",
                title: "Unexpected Error",
                description: "An unexpected error occurred. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2">
                {/* Left side - Background Image */}
                <div className="hidden bg-muted lg:block">
                    <img
                        src="/api/placeholder/600/800"
                        alt="Login background"
                        className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>

                {/* Right side - Login Form */}
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Login</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your email and password to access your account
                            </p>
                        </div>
                        <form onSubmit={logIn} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Don't have an account?{" "}
                            <Link href="/sign-up" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
}