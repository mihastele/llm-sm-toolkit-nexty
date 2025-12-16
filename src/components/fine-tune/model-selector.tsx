"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useFineTuneWizardStore, useModelCatalogStore } from "@/lib/store";
import { MODEL_CATALOG } from "@/lib/model-catalog";
import { formatCurrency } from "@/lib/utils";
import { Search, Check, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ModelSelector() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [maxCost, setMaxCost] = useState<number>(50);
  const { modelId, setModelId } = useFineTuneWizardStore();

  const filteredModels = MODEL_CATALOG.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.provider.toLowerCase().includes(search.toLowerCase()) ||
      model.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesSource = sourceFilter === "all" || model.source === sourceFilter;
    const matchesCost = model.estimatedCostPerHour <= maxCost;
    return matchesSearch && matchesSource && matchesCost;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Label htmlFor="search">Search Models</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name, provider, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="source">Source</Label>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger id="source" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="jumpstart">SageMaker JumpStart</SelectItem>
              <SelectItem value="huggingface">Hugging Face</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Max Cost: {formatCurrency(maxCost)}/hr</Label>
          <Slider
            value={[maxCost]}
            onValueChange={([value]) => setMaxCost(value)}
            min={1}
            max={50}
            step={1}
            className="mt-3"
          />
        </div>
      </div>

      {/* Model Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredModels.map((model) => {
          const isSelected = modelId === model.id;
          return (
            <div
              key={model.id}
              className={cn(
                "relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => setModelId(model.id)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{model.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{model.provider}</p>
                </div>
                <p className="text-sm line-clamp-2">{model.description}</p>
                <div className="flex flex-wrap gap-1">
                  {model.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Size:</span>{" "}
                    <span className="font-medium">{model.parameterCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Context:</span>{" "}
                    <span className="font-medium">{model.contextLength.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost:</span>{" "}
                    <span className="font-medium">{formatCurrency(model.estimatedCostPerHour)}/hr</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">License:</span>{" "}
                    <span className="font-medium truncate">{model.license.split(" ")[0]}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {model.supportedFineTuneTypes.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs uppercase">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No models found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {/* Selected Model Info */}
      {modelId && (
        <div className="p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">
                Selected: {MODEL_CATALOG.find((m) => m.id === modelId)?.name}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Recommended instance: {MODEL_CATALOG.find((m) => m.id === modelId)?.recommendedInstance}
                {" · "}
                Min GPU memory: {MODEL_CATALOG.find((m) => m.id === modelId)?.minGpuMemoryGb}GB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
