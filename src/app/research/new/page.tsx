"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Clock, FileText, MessageSquare, List, Scale, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const depthOptions = [
  {
    id: "quick",
    name: "Quick Scan",
    duration: "5-10 minutes",
    description: "Fast overview with key sources",
    icon: Clock,
  },
  {
    id: "in-depth",
    name: "In-Depth Research",
    duration: "30-60 minutes",
    description: "Comprehensive analysis with multiple passes",
    icon: Search,
  },
];

const outputFormats = [
  { id: "bullets", name: "Bullet Summary", icon: List },
  { id: "report", name: "Long Report", icon: FileText },
  { id: "faq", name: "FAQ Format", icon: MessageSquare },
  { id: "pros-cons", name: "Pros & Cons", icon: Scale },
];

export default function NewResearchPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [depth, setDepth] = useState<string>("quick");
  const [outputFormat, setOutputFormat] = useState<string>("bullets");
  const [includeDomains, setIncludeDomains] = useState("");
  const [excludeDomains, setExcludeDomains] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      router.push("/research/session-123");
    }, 1000);
  };

  return (
    <AppLayout>
      <Header
        title="New Deep Research"
        description="Start a multi-step research and synthesis session"
      />

      <div className="p-6 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Research Question
            </CardTitle>
            <CardDescription>
              Enter your research question or topic. Be specific for better results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Input */}
            <div className="space-y-2">
              <Label htmlFor="question">What would you like to research?</Label>
              <Textarea
                id="question"
                placeholder="e.g., What are the latest advances in RLHF for LLMs? Compare different approaches and their trade-offs."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Include specific aspects you want covered for more focused results.
              </p>
            </div>

            {/* Depth Selection */}
            <div className="space-y-3">
              <Label>Research Depth</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {depthOptions.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "relative p-4 rounded-lg border-2 cursor-pointer transition-all",
                      depth === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setDepth(option.id)}
                  >
                    <div className="flex items-start gap-3">
                      <option.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          {option.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-3">
              <Label>Output Format</Label>
              <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                {outputFormats.map((format) => (
                  <div
                    key={format.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all text-center",
                      outputFormat === format.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setOutputFormat(format.id)}
                  >
                    <format.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium">{format.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4 pt-4 border-t">
              <Label className="text-muted-foreground">
                Advanced Options (optional)
              </Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="include">Include Domains</Label>
                  <Input
                    id="include"
                    placeholder="e.g., arxiv.org, openai.com"
                    value={includeDomains}
                    onChange={(e) => setIncludeDomains(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of preferred domains
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exclude">Exclude Domains</Label>
                  <Input
                    id="exclude"
                    placeholder="e.g., reddit.com, twitter.com"
                    value={excludeDomains}
                    onChange={(e) => setExcludeDomains(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of domains to skip
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!question.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                    Starting Research...
                  </>
                ) : (
                  <>
                    Start Research
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
