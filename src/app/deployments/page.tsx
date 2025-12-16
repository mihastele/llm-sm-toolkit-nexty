"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Play,
  Square,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  BarChart3,
  Clock,
  Cpu,
} from "lucide-react";

const endpoints = [
  {
    id: "ep-1",
    name: "Customer Support Bot",
    model: "llama-3-8b-support-v2",
    status: "inservice",
    instanceType: "ml.g5.xlarge",
    instanceCount: 1,
    requests24h: 1247,
    latencyP50: "145ms",
    createdAt: "3 days ago",
    costPerHour: 1.21,
  },
  {
    id: "ep-2",
    name: "Code Assistant API",
    model: "codellama-7b-custom",
    status: "inservice",
    instanceType: "ml.g5.2xlarge",
    instanceCount: 2,
    requests24h: 856,
    latencyP50: "210ms",
    createdAt: "1 week ago",
    costPerHour: 2.42,
  },
  {
    id: "ep-3",
    name: "Document Analyzer (Staging)",
    model: "mistral-7b-docs-v1",
    status: "updating",
    instanceType: "ml.g5.xlarge",
    instanceCount: 1,
    requests24h: 0,
    latencyP50: "-",
    createdAt: "2 hours ago",
    costPerHour: 1.21,
  },
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    inservice: { label: "In Service", variant: "success" as const, icon: CheckCircle2 },
    creating: { label: "Creating", variant: "default" as const, icon: Clock },
    updating: { label: "Updating", variant: "warning" as const, icon: AlertCircle },
    failed: { label: "Failed", variant: "destructive" as const, icon: AlertCircle },
    deleting: { label: "Deleting", variant: "secondary" as const, icon: Square },
  };
  const { label, variant, icon: Icon } = config[status as keyof typeof config] || config.creating;

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

export default function DeploymentsPage() {
  return (
    <AppLayout>
      <Header
        title="Deployments"
        description="Manage your deployed model endpoints"
        actions={
          <Link href="/deployments/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Deploy Model
            </Button>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Endpoints</CardDescription>
              <CardTitle className="text-3xl">3</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Requests (24h)</CardDescription>
              <CardTitle className="text-3xl">2,103</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Latency</CardDescription>
              <CardTitle className="text-3xl">178ms</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Cost/Hour</CardDescription>
              <CardTitle className="text-3xl">$4.84</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>Endpoints</CardTitle>
            <CardDescription>Your deployed model inference endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.id}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{endpoint.name}</h3>
                      <StatusBadge status={endpoint.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        {endpoint.instanceType} × {endpoint.instanceCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {endpoint.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="text-center px-4">
                    <div className="flex items-center gap-1 text-sm">
                      <BarChart3 className="h-3 w-3" />
                      <span className="font-medium">{endpoint.requests24h.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">requests/24h</span>
                  </div>

                  <div className="text-center px-4">
                    <div className="text-sm font-medium">{endpoint.latencyP50}</div>
                    <span className="text-xs text-muted-foreground">p50 latency</span>
                  </div>

                  <div className="text-right px-4">
                    <div className="text-sm font-medium">${endpoint.costPerHour}/hr</div>
                    <span className="text-xs text-muted-foreground">running cost</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/deployments/${endpoint.id}/playground`}>
                      <Button variant="outline" size="sm" disabled={endpoint.status !== "inservice"}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </Link>
                    <Link href={`/deployments/${endpoint.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
