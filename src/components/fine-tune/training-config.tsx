"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFineTuneWizardStore } from "@/lib/store";
import { MODEL_CATALOG, getRecommendedConfig, estimateTrainingCost } from "@/lib/model-catalog";
import { formatCurrency } from "@/lib/utils";
import { Info, Sparkles, Settings2 } from "lucide-react";

export function TrainingConfig() {
  const { modelId, config, setSimpleConfig, setAdvancedConfig, setUseAdvanced } = useFineTuneWizardStore();
  const [datasetSize] = useState(2547); // Mock dataset size

  const model = MODEL_CATALOG.find((m) => m.id === modelId);
  const recommended = model ? getRecommendedConfig(model, datasetSize, config.simple.qualityPreset) : null;
  const costEstimate = model && recommended
    ? estimateTrainingCost(model, datasetSize, { epochs: recommended.epochs, batchSize: recommended.batchSize })
    : null;

  useEffect(() => {
    if (recommended && !config.advanced) {
      setAdvancedConfig({
        epochs: recommended.epochs,
        learningRate: recommended.learningRate,
        batchSize: recommended.batchSize,
        warmupRatio: recommended.warmupRatio,
        gradientCheckpointing: recommended.gradientCheckpointing,
        packing: recommended.packing,
        fineTuneType: recommended.fineTuneType as "full" | "lora" | "qlora",
        loraRank: recommended.loraRank,
        loraAlpha: recommended.loraAlpha,
        quantizationBits: recommended.quantizationBits as 4 | 8 | undefined,
      });
    }
  }, [recommended?.epochs]);

  if (!model) {
    return <div>Please select a model first.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
        <div className="flex items-center gap-3">
          <Settings2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Advanced Mode</p>
            <p className="text-sm text-muted-foreground">
              Fine-tune individual hyperparameters
            </p>
          </div>
        </div>
        <Switch
          checked={config.useAdvanced}
          onCheckedChange={setUseAdvanced}
        />
      </div>

      {!config.useAdvanced ? (
        /* Simple Mode */
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Budget */}
            <div className="space-y-4">
              <Label>Training Budget</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Max Cost (USD)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 50"
                    value={config.simple.maxCostUsd || ""}
                    onChange={(e) =>
                      setSimpleConfig({
                        ...config.simple,
                        maxCostUsd: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">or</div>
                <div>
                  <Label className="text-sm text-muted-foreground">Max Hours</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 4"
                    value={config.simple.maxHours || ""}
                    onChange={(e) =>
                      setSimpleConfig({
                        ...config.simple,
                        maxHours: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Quality Preset */}
            <div className="space-y-4">
              <Label>Quality vs Speed</Label>
              <div className="space-y-3">
                {(["low", "medium", "high"] as const).map((preset) => (
                  <div
                    key={preset}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      config.simple.qualityPreset === preset
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSimpleConfig({ ...config.simple, qualityPreset: preset })}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{preset}</span>
                      <Badge variant={preset === "high" ? "default" : "secondary"}>
                        {preset === "low" && "~1 epoch, fast"}
                        {preset === "medium" && "~3 epochs, balanced"}
                        {preset === "high" && "~5 epochs, thorough"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {preset === "low" && "Quick training for rapid iteration"}
                      {preset === "medium" && "Good balance of quality and speed"}
                      {preset === "high" && "Best quality, longer training time"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Output Style */}
          <div className="space-y-3">
            <Label>Output Style</Label>
            <Select
              value={config.simple.outputStyle}
              onValueChange={(value: "instruction" | "chat" | "classification") =>
                setSimpleConfig({ ...config.simple, outputStyle: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instruction">Instruction-tuned (single turn)</SelectItem>
                <SelectItem value="chat">Chat-tuned (multi-turn)</SelectItem>
                <SelectItem value="classification">Classification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Computed Defaults */}
          {recommended && (
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Recommended Configuration</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Epochs:</span>{" "}
                  <span className="font-medium">{recommended.epochs}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Learning Rate:</span>{" "}
                  <span className="font-medium">{recommended.learningRate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Batch Size:</span>{" "}
                  <span className="font-medium">{recommended.batchSize}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fine-tune Type:</span>{" "}
                  <span className="font-medium uppercase">{recommended.fineTuneType}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Advanced Mode */
        <div className="space-y-6">
          <Accordion type="single" collapsible defaultValue="training">
            <AccordionItem value="training">
              <AccordionTrigger>Training Parameters</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2 pt-2">
                  <div className="space-y-2">
                    <Label>Epochs</Label>
                    <Input
                      type="number"
                      value={config.advanced?.epochs || 3}
                      onChange={(e) =>
                        setAdvancedConfig({
                          ...config.advanced!,
                          epochs: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Steps (optional)</Label>
                    <Input
                      type="number"
                      placeholder="Leave empty for auto"
                      value={config.advanced?.maxSteps || ""}
                      onChange={(e) =>
                        setAdvancedConfig({
                          ...config.advanced!,
                          maxSteps: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Learning Rate</Label>
                    <Input
                      type="number"
                      step="0.00001"
                      value={config.advanced?.learningRate || 0.00001}
                      onChange={(e) =>
                        setAdvancedConfig({
                          ...config.advanced!,
                          learningRate: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Batch Size</Label>
                    <Input
                      type="number"
                      value={config.advanced?.batchSize || 4}
                      onChange={(e) =>
                        setAdvancedConfig({
                          ...config.advanced!,
                          batchSize: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Warmup Ratio: {(config.advanced?.warmupRatio || 0.1) * 100}%</Label>
                    <Slider
                      value={[(config.advanced?.warmupRatio || 0.1) * 100]}
                      onValueChange={([value]) =>
                        setAdvancedConfig({
                          ...config.advanced!,
                          warmupRatio: value / 100,
                        })
                      }
                      min={0}
                      max={30}
                      step={1}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="peft">
              <AccordionTrigger>PEFT / LoRA Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Fine-tune Type</Label>
                    <Select
                      value={config.advanced?.fineTuneType || "lora"}
                      onValueChange={(value: "full" | "lora" | "qlora") =>
                        setAdvancedConfig({
                          ...config.advanced!,
                          fineTuneType: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {model.supportedFineTuneTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(config.advanced?.fineTuneType === "lora" ||
                    config.advanced?.fineTuneType === "qlora") && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>LoRA Rank</Label>
                        <Input
                          type="number"
                          value={config.advanced?.loraRank || 16}
                          onChange={(e) =>
                            setAdvancedConfig({
                              ...config.advanced!,
                              loraRank: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>LoRA Alpha</Label>
                        <Input
                          type="number"
                          value={config.advanced?.loraAlpha || 32}
                          onChange={(e) =>
                            setAdvancedConfig({
                              ...config.advanced!,
                              loraAlpha: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {config.advanced?.fineTuneType === "qlora" && (
                    <div className="space-y-2">
                      <Label>Quantization Bits</Label>
                      <Select
                        value={String(config.advanced?.quantizationBits || 4)}
                        onValueChange={(value) =>
                          setAdvancedConfig({
                            ...config.advanced!,
                            quantizationBits: Number(value) as 4 | 8,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4-bit</SelectItem>
                          <SelectItem value="8">8-bit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="optimization">
              <AccordionTrigger>Optimization</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Gradient Checkpointing</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduces memory usage at cost of speed
                      </p>
                    </div>
                    <Switch
                      checked={config.advanced?.gradientCheckpointing ?? true}
                      onCheckedChange={(checked) =>
                        setAdvancedConfig({
                          ...config.advanced!,
                          gradientCheckpointing: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Packing</Label>
                      <p className="text-sm text-muted-foreground">
                        Pack multiple examples into one sequence
                      </p>
                    </div>
                    <Switch
                      checked={config.advanced?.packing ?? false}
                      onCheckedChange={(checked) =>
                        setAdvancedConfig({
                          ...config.advanced!,
                          packing: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Cost Estimate */}
      {costEstimate && (
        <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Estimated Cost</h4>
              <p className="text-sm text-blue-800 mt-1">
                {formatCurrency(costEstimate.minCost)} - {formatCurrency(costEstimate.maxCost)}
                {" · "}
                ~{costEstimate.estimatedHours} hours on {model.recommendedInstance}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
