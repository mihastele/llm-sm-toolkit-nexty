"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useFineTuneWizardStore } from "@/lib/store";
import { MODEL_CATALOG, getRecommendedConfig, estimateTrainingCost } from "@/lib/model-catalog";
import { formatCurrency } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Cpu,
  Database,
  DollarSign,
  Clock,
  Sparkles,
} from "lucide-react";

export function LaunchConfirmation() {
  const [confirmed, setConfirmed] = useState(false);
  const { modelId, datasetId, config } = useFineTuneWizardStore();
  const [datasetSize] = useState(2547); // Mock

  const model = MODEL_CATALOG.find((m) => m.id === modelId);
  const recommended = model
    ? getRecommendedConfig(model, datasetSize, config.simple.qualityPreset)
    : null;
  const costEstimate =
    model && recommended
      ? estimateTrainingCost(model, datasetSize, {
          epochs: config.useAdvanced ? config.advanced?.epochs || 3 : recommended.epochs,
          batchSize: config.useAdvanced ? config.advanced?.batchSize || 4 : recommended.batchSize,
        })
      : null;

  const finalConfig = config.useAdvanced ? config.advanced : recommended;

  if (!model || !finalConfig) {
    return <div>Please complete previous steps first.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Ready to Launch</h3>
        <p className="text-muted-foreground mt-1">
          Review your configuration before starting the training job
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Model */}
        <div className="p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Model</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Model</span>
              <span className="font-medium">{model.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span>{model.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Parameters</span>
              <span>{model.parameterCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Instance</span>
              <span>{model.recommendedInstance}</span>
            </div>
          </div>
        </div>

        {/* Dataset */}
        <div className="p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Dataset</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dataset ID</span>
              <span className="font-medium truncate max-w-[150px]">{datasetId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Examples</span>
              <span>{datasetSize.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Output Style</span>
              <span className="capitalize">{config.simple.outputStyle}</span>
            </div>
          </div>
        </div>

        {/* Training Config */}
        <div className="p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Training Configuration</span>
            <Badge variant="outline" className="ml-auto">
              {config.useAdvanced ? "Advanced" : "Simple"}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Epochs</span>
              <span>{finalConfig.epochs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Learning Rate</span>
              <span>{finalConfig.learningRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch Size</span>
              <span>{finalConfig.batchSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fine-tune Type</span>
              <Badge variant="secondary" className="uppercase text-xs">
                {finalConfig.fineTuneType}
              </Badge>
            </div>
            {(finalConfig.fineTuneType === "lora" || finalConfig.fineTuneType === "qlora") && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LoRA Rank</span>
                  <span>{finalConfig.loraRank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LoRA Alpha</span>
                  <span>{finalConfig.loraAlpha}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cost Estimate */}
        <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Cost Estimate</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-800">Estimated Cost</span>
              <span className="font-semibold text-blue-900">
                {costEstimate && `${formatCurrency(costEstimate.minCost)} - ${formatCurrency(costEstimate.maxCost)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Estimated Duration</span>
              <span className="font-medium text-blue-900">
                {costEstimate && `~${costEstimate.estimatedHours} hours`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Instance Cost</span>
              <span className="text-blue-900">
                {formatCurrency(model.estimatedCostPerHour)}/hour
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Before you start</h4>
            <ul className="mt-2 space-y-1 text-sm text-yellow-800">
              <li>• Training costs are billed by AWS SageMaker directly</li>
              <li>• You can stop training at any time to save costs</li>
              <li>• Model artifacts will be saved to your S3 bucket</li>
              <li>• Training typically takes {costEstimate?.estimatedHours || "a few"} hours</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation */}
      <div className="flex items-center space-x-2 p-4 rounded-lg border">
        <Checkbox
          id="confirm"
          checked={confirmed}
          onCheckedChange={(checked) => setConfirmed(checked === true)}
        />
        <label
          htmlFor="confirm"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          I understand this will incur AWS charges and want to proceed
        </label>
      </div>

      {/* Launch Button */}
      <div className="flex justify-center">
        <Button size="lg" disabled={!confirmed} className="min-w-[200px]">
          <Sparkles className="h-4 w-4 mr-2" />
          Launch Training Job
        </Button>
      </div>
    </div>
  );
}
