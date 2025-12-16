"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/lib/store";
import { User, Key, Bell, CreditCard, Shield } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [organization, setOrganization] = useState(user?.organization || "");
  const [region, setRegion] = useState(user?.defaultRegion || "us-east-1");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [trainingAlerts, setTrainingAlerts] = useState(true);
  const [costAlerts, setCostAlerts] = useState(true);
  const [costThreshold, setCostThreshold] = useState("50");

  return (
    <AppLayout>
      <Header
        title="Settings"
        description="Manage your account and preferences"
      />

      <div className="p-6 max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="aws" className="gap-2">
              <Key className="h-4 w-4" />
              AWS Credentials
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Default AWS Region</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                        <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aws">
            <Card>
              <CardHeader>
                <CardTitle>AWS Credentials</CardTitle>
                <CardDescription>
                  Configure your AWS access for SageMaker and S3
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Security Note</h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        We recommend using IAM roles or temporary credentials. Never share your root account keys.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="access-key">AWS Access Key ID</Label>
                    <Input
                      id="access-key"
                      type="password"
                      placeholder="AKIA..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secret-key">AWS Secret Access Key</Label>
                    <Input
                      id="secret-key"
                      type="password"
                      placeholder="••••••••••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-arn">SageMaker Execution Role ARN</Label>
                    <Input
                      id="role-arn"
                      placeholder="arn:aws:iam::123456789:role/SageMakerRole"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Update Credentials</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what you want to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Training Job Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when training jobs complete or fail
                    </p>
                  </div>
                  <Switch
                    checked={trainingAlerts}
                    onCheckedChange={setTrainingAlerts}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cost Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when spending exceeds threshold
                    </p>
                  </div>
                  <Switch
                    checked={costAlerts}
                    onCheckedChange={setCostAlerts}
                  />
                </div>

                {costAlerts && (
                  <div className="space-y-2 pl-4 border-l-2">
                    <Label htmlFor="threshold">Cost Threshold (USD)</Label>
                    <Input
                      id="threshold"
                      type="number"
                      value={costThreshold}
                      onChange={(e) => setCostThreshold(e.target.value)}
                      className="max-w-[200px]"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Usage</CardTitle>
                <CardDescription>View your usage and manage billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">$156.80</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Last Month</p>
                    <p className="text-2xl font-bold">$203.45</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Total (All Time)</p>
                    <p className="text-2xl font-bold">$1,247.32</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">Note</p>
                  <p className="text-sm">
                    All AWS charges are billed directly through your AWS account.
                    This dashboard shows estimated costs based on your usage within LLM Toolkit.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
