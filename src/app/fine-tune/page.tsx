"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Database,
  TrendingDown,
} from "lucide-react";

const trainingRuns = [
  {
    id: "run-1",
    name: "Customer Support Bot v2",
    model: "Llama 3 8B",
    dataset: "support_tickets.jsonl",
    status: "running",
    progress: 67,
    currentEpoch: 2,
    totalEpochs: 3,
    loss: 0.42,
    startedAt: "2 hours ago",
    estimatedCost: "$12.50",
  },
  {
    id: "run-2",
    name: "Code Assistant",
    model: "Code Llama 7B",
    dataset: "code_samples.jsonl",
    status: "completed",
    progress: 100,
    currentEpoch: 3,
    totalEpochs: 3,
    loss: 0.28,
    startedAt: "Yesterday",
    estimatedCost: "$18.20",
  },
  {
    id: "run-3",
    name: "Legal Document Summarizer",
    model: "Mistral 7B",
    dataset: "legal_docs.jsonl",
    status: "failed",
    progress: 45,
    currentEpoch: 2,
    totalEpochs: 5,
    loss: 2.1,
    startedAt: "3 days ago",
    estimatedCost: "$8.40",
  },
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    running: { label: "Running", variant: "default" as const, icon: Play },
    completed: { label: "Completed", variant: "success" as const, icon: CheckCircle2 },
    failed: { label: "Failed", variant: "destructive" as const, icon: XCircle },
    queued: { label: "Queued", variant: "secondary" as const, icon: Clock },
    stopped: { label: "Stopped", variant: "warning" as const, icon: Pause },
  };
  const { label, variant, icon: Icon } = config[status as keyof typeof config] || config.queued;

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

export default function FineTunePage() {
  return (
    <AppLayout>
      <Header
        title="Fine-Tuning"
        description="Train and manage your custom LLM models"
        actions={
          <Link href="/fine-tune/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Training Job
            </Button>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Jobs</CardDescription>
              <CardTitle className="text-3xl">1</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">12</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Spend</CardDescription>
              <CardTitle className="text-3xl">$156.80</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Hours Trained</CardDescription>
              <CardTitle className="text-3xl">48.5</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Training Runs */}
        <Card>
          <CardHeader>
            <CardTitle>Training Runs</CardTitle>
            <CardDescription>View and manage your fine-tuning jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{run.name}</h3>
                      <StatusBadge status={run.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        {run.model}
                      </span>
                      <span className="flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        {run.dataset}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {run.startedAt}
                      </span>
                    </div>
                  </div>

                  <div className="w-32 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Epoch {run.currentEpoch}/{run.totalEpochs}</span>
                      <span>{run.progress}%</span>
                    </div>
                    <Progress value={run.progress} className="h-2" />
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingDown className="h-3 w-3 text-green-500" />
                      <span className="font-medium">{run.loss}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{run.estimatedCost}</span>
                  </div>

                  <Link href={`/fine-tune/${run.id}`}>
                    <Button variant="outline" size="sm">
                      View
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
