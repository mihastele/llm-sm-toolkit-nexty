"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/store";
import { 
  Brain, 
  Rocket, 
  Search, 
  Sparkles, 
  ArrowRight,
  Zap,
  Shield,
  BarChart3
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login - in production this would call the API
    setTimeout(() => {
      useAuthStore.getState().setAuth(
        { id: "1", email, name: "Demo User", defaultRegion: "us-east-1", createdAt: new Date().toISOString() },
        "demo-token"
      );
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      useAuthStore.getState().setAuth(
        { id: "1", email, name, defaultRegion: "us-east-1", createdAt: new Date().toISOString() },
        "demo-token"
      );
      setIsLoading(false);
    }, 1000);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">LLM Toolkit</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </nav>
          </div>
        </header>
        
        <main className="container py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Welcome back!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Continue where you left off with your LLM projects.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Open Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">LLM Toolkit</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="container py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                Fine-tune LLMs{" "}
                <span className="text-primary">without the complexity</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                A guided, wizard-like experience for fine-tuning and deploying modern LLMs on AWS SageMaker. 
                Plus a powerful deep research agent for multi-step web research and synthesis.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>No ML expertise required</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span>Real-time monitoring</span>
                </div>
              </div>
            </div>

            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Create an account or sign in to start fine-tuning LLMs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
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
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="features" className="container py-24 sm:py-32 border-t">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything you need to fine-tune LLMs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From model selection to deployment, we guide you through every step.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Sparkles className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Model Catalog</CardTitle>
                <CardDescription>
                  Browse curated models from Meta, Mistral, Google, and more. 
                  Filter by size, cost, and capabilities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Rocket className="h-10 w-10 text-primary mb-4" />
                <CardTitle>One-Click Fine-Tuning</CardTitle>
                <CardDescription>
                  Upload your dataset, choose quality presets, and launch training. 
                  We handle all the AWS complexity.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Real-Time Monitoring</CardTitle>
                <CardDescription>
                  Track training progress, view loss curves, and get cost estimates 
                  as your model trains.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Easy Deployment</CardTitle>
                <CardDescription>
                  Deploy your fine-tuned model with one click. Choose between 
                  dev and production configurations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Deep Research Agent</CardTitle>
                <CardDescription>
                  Multi-step web research and synthesis. Get comprehensive 
                  reports with citations and sources.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-4" />
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  Built-in AI helper explains every step and suggests optimal 
                  settings based on your data.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/50">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-semibold">LLM Toolkit</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 LLM Toolkit. Built for the AI community.
          </p>
        </div>
      </footer>
    </div>
  );
}
