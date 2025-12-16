"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Brain, Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_PROMPTS = [
  "What does LoRA rank do?",
  "How do I choose the right model?",
  "Explain learning rate",
  "Best practices for datasets",
];

export function AIAssistant({ open, onOpenChange }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI assistant for LLM Toolkit. I can help you understand fine-tuning concepts, choose the right settings, and troubleshoot issues. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response - in production this would call the API
    setTimeout(() => {
      const responses: Record<string, string> = {
        lora: `**LoRA (Low-Rank Adaptation)** is a parameter-efficient fine-tuning technique that:

1. **Freezes** the original model weights
2. **Adds** small trainable matrices to specific layers
3. **Reduces** memory and compute requirements by 10-100x

**LoRA Rank** controls the size of these adapter matrices:
- **Lower rank (8-16)**: Faster training, less memory, may underfit complex tasks
- **Higher rank (32-128)**: Better capacity, slower training, more memory

**Recommendation**: Start with rank 16-32 for most tasks. Increase if you see underfitting.`,
        model: `**Choosing the right base model** depends on several factors:

1. **Task complexity**:
   - Simple tasks (classification, extraction): Smaller models (2-7B)
   - Complex reasoning/generation: Larger models (13-70B)

2. **Context length needs**:
   - Short inputs (<2K tokens): Any model
   - Long documents: Mistral (32K), Llama 3 (8K)

3. **Budget**:
   - Limited budget: Phi-2, Gemma 2B
   - Production quality: Llama 3 8B, Mistral 7B

4. **License requirements**:
   - Commercial use: Apache 2.0 models (Mistral, Falcon)
   - Research only: Check specific licenses

**My recommendation**: Start with Mistral 7B or Llama 3 8B for a good balance.`,
        "learning rate": `**Learning Rate** controls how much the model weights change during training:

- **Too high**: Model diverges, loss explodes
- **Too low**: Training is slow, may get stuck
- **Just right**: Smooth convergence

**Typical ranges for fine-tuning**:
- Full fine-tune: 1e-5 to 5e-5
- LoRA: 1e-4 to 3e-4
- QLoRA: 2e-4 to 5e-4

**Tips**:
1. Use warmup (10% of steps) to avoid early instability
2. Use cosine decay to reduce LR over time
3. If loss spikes, try 2-3x lower LR`,
        dataset: `**Best practices for fine-tuning datasets**:

1. **Quality over quantity**:
   - 100-1000 high-quality examples often beat 10K noisy ones
   - Manually review a sample for errors

2. **Format consistency**:
   - Use consistent instruction templates
   - Match the format you'll use at inference time

3. **Diversity**:
   - Cover edge cases and variations
   - Include different lengths and complexity levels

4. **Validation split**:
   - Keep 10-20% for evaluation
   - Use similar distribution to training

5. **Token limits**:
   - Most models have 2K-8K context limits
   - Truncate or split long examples

**Common formats**:
\`\`\`json
{"instruction": "...", "input": "...", "output": "..."}
{"messages": [{"role": "user", "content": "..."}, ...]}
\`\`\``,
      };

      let response =
        "I can help you with that! Could you provide more details about what you're trying to accomplish?";

      const lowerInput = userMessage.toLowerCase();
      if (lowerInput.includes("lora") || lowerInput.includes("rank")) {
        response = responses.lora;
      } else if (lowerInput.includes("model") || lowerInput.includes("choose")) {
        response = responses.model;
      } else if (lowerInput.includes("learning") || lowerInput.includes("rate")) {
        response = responses["learning rate"];
      } else if (
        lowerInput.includes("dataset") ||
        lowerInput.includes("data") ||
        lowerInput.includes("best practice")
      ) {
        response = responses.dataset;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Assistant
          </SheetTitle>
          <SheetDescription>
            Ask questions about fine-tuning, models, or get help with settings.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    message.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    "U"
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%]",
                    message.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setInput(prompt);
                }}
              >
                {prompt}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button size="icon" onClick={handleSend} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
