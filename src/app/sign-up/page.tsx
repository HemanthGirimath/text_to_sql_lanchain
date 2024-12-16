'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabaseClientSignup } from '../auth/supabase-client'
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useToast } from "@/app/components/ui/use-toast"
import { Toaster } from "@/app/components/ui/toaster"

export default function SignUp() {
    const router = useRouter()
    const { toast } = useToast()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function signUp(e: React.FormEvent) {
        e.preventDefault(); // Prevent default form submission
        
        // Basic form validation
        if (!email || !password) {
            toast({
                variant: "destructive",
                title: "Sign Up Error",
                description: "Please enter both email and password"
            });
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await supabaseClientSignup(email, password)
            
            if (error) {
                // Handle specific error cases
                toast({
                    variant: "destructive",
                    title: "Sign Up Failed",
                    description: error.message || "Unable to sign up. Please try again."
                });
            } else {
                // Successful sign-up
                toast({
                    title: "Sign Up Successful",
                    description: "You have been signed up successfully"
                });

                // Redirect after a short delay to show the toast
                setTimeout(() => {
                    router.push('/sign-in')
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
                        alt="Sign Up background"
                        className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>

                {/* Right side - Sign Up Form */}
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Sign Up</h1>
                            <p className="text-balance text-muted-foreground">
                                Create your account to get started
                            </p>
                        </div>
                        <form onSubmit={signUp} className="grid gap-4">
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
                                <Label htmlFor="password">Password</Label>
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
                                {isLoading ? "Signing up..." : "Sign up"}
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/sign-in" className="underline">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
}