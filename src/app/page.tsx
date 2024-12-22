'use client'
import React from 'react';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { 
  MessageSquare, 
  Database, 
  LineChart, 
  Shield, 
  FileCode2, 
  ArrowRight, 
  GithubIcon,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from 'next/link';

const LandingPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-full"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Talk to Your Database in
            <span className="text-primary"> Plain English</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your database interactions with AI-powered natural language queries. 
            No SQL expertise required.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
             <Link href= '/sign-in'>
             Get Started 
             </Link>
            </Button>
            <Button size="lg" variant="outline">
              <GithubIcon className="mr-2 h-5 w-5" /> View on GitHub
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Chat History</h3>
                </div>
                <p className="text-muted-foreground">
                  Keep track of all your queries and results with persistent chat history and multiple conversations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                    <Database className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Natural Language Queries</h3>
                </div>
                <p className="text-muted-foreground">
                  Ask questions about your data in plain English and get instant SQL queries and results.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20">
                    <LineChart className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Data Analysis</h3>
                </div>
                <p className="text-muted-foreground">
                  Coming soon: Advanced analytics and visualizations to gain deeper insights from your data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-yellow-500/10 dark:bg-yellow-500/20">
                    <Shield className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Role-Based Access</h3>
                </div>
                <p className="text-muted-foreground">
                  Coming soon: Granular access control and permissions for team collaboration.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-pink-500/10 dark:bg-pink-500/20">
                    <FileCode2 className="h-6 w-6 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Template System</h3>
                </div>
                <p className="text-muted-foreground">
                  Coming soon: Save and reuse common queries with customizable templates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24 border-t border-border">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Simplify Your Database Queries?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join developers who are already using our platform to interact with their databases more efficiently.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;