"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
  Loader2,
  StopCircle,
} from "lucide-react";

const researchSessions = [
  {
    id: "rs-1",
    question: "What are the latest advances in RLHF for LLMs?",
    status: "completed",
    depth: "in-depth",
    outputFormat: "report",
    sourcesCount: 24,
    createdAt: "2 hours ago",
    completedAt: "1 hour ago",
  },
  {
    id: "rs-2",
    question: "Compare LoRA vs QLoRA for fine-tuning efficiency",
    status: "running",
    depth: "quick",
    outputFormat: "bullets",
    sourcesCount: 8,
    createdAt: "15 minutes ago",
    completedAt: null,
  },
  {
    id: "rs-3",
    question: "Best practices for instruction-tuning datasets",
    status: "completed",
    depth: "quick",
    outputFormat: "faq",
    sourcesCount: 12,
    createdAt: "Yesterday",
    completedAt: "Yesterday",
  },
  {
    id: "rs-4",
    question: "AWS SageMaker vs Azure ML for LLM deployment",
    status: "completed",
    depth: "in-depth",
    outputFormat: "pros-cons",
    sourcesCount: 18,
    createdAt: "3 days ago",
    completedAt: "3 days ago",
  },
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    running: { label: "Running", variant: "default" as const, icon: Loader2 },
    completed: { label: "Completed", variant: "success" as const, icon: CheckCircle2 },
    stopped: { label: "Stopped", variant: "secondary" as const, icon: StopCircle },
  };
  const { label, variant, icon: Icon } = config[status as keyof typeof config] || config.running;

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className={`h-3 w-3 ${status === "running" ? "animate-spin" : ""}`} />
      {label}
    </Badge>
  );
}

export default function ResearchPage() {
  return (
    <AppLayout>
      <Header
        title="Deep Research"
        description="Multi-step research and synthesis powered by AI"
        actions={
          <Link href="/research/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Research
            </Button>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Sessions</CardDescription>
              <CardTitle className="text-3xl">15</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-3xl">1</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Sources Analyzed</CardDescription>
              <CardTitle className="text-3xl">287</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Duration</CardDescription>
              <CardTitle className="text-3xl">12m</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Research Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Research Sessions</CardTitle>
            <CardDescription>Your research history and active sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {researchSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-muted">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{session.question}</h3>
                      <StatusBadge status={session.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {session.depth}
                        </Badge>
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {session.outputFormat}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="text-center px-4">
                    <div className="text-sm font-medium">{session.sourcesCount}</div>
                    <span className="text-xs text-muted-foreground">sources</span>
                  </div>

                  <Link href={`/research/${session.id}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {session.status === "running" ? "View Progress" : "View Report"}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
