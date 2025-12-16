"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Sparkles,
  Rocket,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  Cpu,
} from "lucide-react";

const recentRuns = [
  {
    id: "1",
    name: "Customer Support Bot v2",
    model: "Llama 3 8B",
    status: "training",
    progress: 67,
    startedAt: "2 hours ago",
    estimatedCost: "$12.50",
  },
  {
    id: "2",
    name: "Code Assistant",
    model: "Code Llama 13B",
    status: "completed",
    progress: 100,
    startedAt: "Yesterday",
    estimatedCost: "$8.20",
  },
  {
    id: "3",
    name: "Legal Document Analyzer",
    model: "Mistral 7B",
    status: "failed",
    progress: 34,
    startedAt: "2 days ago",
    estimatedCost: "$4.15",
  },
];

const activeEndpoints = [
  {
    id: "1",
    name: "support-bot-prod",
    model: "Llama 3 8B (fine-tuned)",
    status: "inservice",
    requests: "12.5k",
    costToday: "$3.20",
  },
  {
    id: "2",
    name: "code-assistant-dev",
    model: "Code Llama 13B (fine-tuned)",
    status: "inservice",
    requests: "856",
    costToday: "$1.45",
  },
];

const researchSessions = [
  {
    id: "1",
    question: "What are the latest advances in RLHF for LLMs?",
    status: "completed",
    sources: 24,
    createdAt: "3 hours ago",
  },
  {
    id: "2",
    question: "Compare fine-tuning approaches: LoRA vs QLoRA vs full",
    status: "running",
    sources: 12,
    createdAt: "30 minutes ago",
  },
];

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"; icon: React.ReactNode }> = {
    training: { variant: "default", icon: <PlayCircle className="h-3 w-3 mr-1" /> },
    completed: { variant: "success", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    failed: { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" /> },
    pending: { variant: "secondary", icon: <Clock className="h-3 w-3 mr-1" /> },
    inservice: { variant: "success", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    running: { variant: "default", icon: <PlayCircle className="h-3 w-3 mr-1" /> },
  };

  const { variant, icon } = variants[status] || { variant: "secondary" as const, icon: null };

  return (
    <Badge variant={variant} className="capitalize">
      {icon}
      {status}
    </Badge>
  );
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <Header
        title="Dashboard"
        description="Overview of your LLM projects and resources"
        actions={
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Training Jobs</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deployed Endpoints</CardTitle>
              <Rocket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Serving 13.3k requests/day</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month's Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$142.50</div>
              <p className="text-xs text-muted-foreground">-12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">+2.1% improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/fine-tune/new">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Fine-Tune Model</CardTitle>
                    <CardDescription>Start a new fine-tuning job</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/deployments/new">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Deploy Model</CardTitle>
                    <CardDescription>Deploy a trained model</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/research/new">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Deep Research</CardTitle>
                    <CardDescription>Start a research session</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Training Runs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Training Runs</CardTitle>
                <CardDescription>Your latest fine-tuning jobs</CardDescription>
              </div>
              <Link href="/fine-tune">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentRuns.map((run) => (
                <div key={run.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{run.name}</span>
                      <StatusBadge status={run.status} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {run.model} · {run.startedAt} · {run.estimatedCost}
                    </div>
                    {run.status === "training" && (
                      <div className="pt-1">
                        <Progress value={run.progress} className="h-2" />
                        <span className="text-xs text-muted-foreground">{run.progress}% complete</span>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Endpoints */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Endpoints</CardTitle>
                <CardDescription>Your deployed model endpoints</CardDescription>
              </div>
              <Link href="/deployments">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeEndpoints.map((endpoint) => (
                <div key={endpoint.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{endpoint.name}</span>
                      <StatusBadge status={endpoint.status} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {endpoint.model}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Today: </span>
                      <span>{endpoint.requests} requests</span>
                      <span className="text-muted-foreground"> · </span>
                      <span>{endpoint.costToday}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Test
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Research Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Research Sessions</CardTitle>
              <CardDescription>Your deep research activities</CardDescription>
            </div>
            <Link href="/research">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {researchSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.question}</span>
                      <StatusBadge status={session.status} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.sources} sources · {session.createdAt}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
