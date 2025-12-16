"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ModelSelector } from "@/components/fine-tune/model-selector";
import { DatasetUploader } from "@/components/fine-tune/dataset-uploader";
import { TrainingConfig } from "@/components/fine-tune/training-config";
import { LaunchConfirmation } from "@/components/fine-tune/launch-confirmation";
import { useFineTuneWizardStore } from "@/lib/store";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const steps = [
  { id: 0, name: "Select Model", description: "Choose a base model to fine-tune" },
  { id: 1, name: "Upload Dataset", description: "Upload and validate your training data" },
  { id: 2, name: "Configure Training", description: "Set training parameters" },
  { id: 3, name: "Launch", description: "Review and start training" },
];

export default function NewFineTunePage() {
  const router = useRouter();
  const { step, setStep, modelId, datasetId, reset } = useFineTuneWizardStore();

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!modelId;
      case 1:
        return !!datasetId;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleCancel = () => {
    reset();
    router.push("/dashboard");
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <AppLayout>
      <Header
        title="Fine-Tune New Model"
        description="Create a custom model by fine-tuning on your data"
      />

      <div className="p-6 max-w-5xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      i < step
                        ? "bg-primary border-primary text-primary-foreground"
                        : i === step
                        ? "border-primary text-primary"
                        : "border-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{i + 1}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`text-sm font-medium ${
                        i <= step ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s.name}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      i < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[step].name}</CardTitle>
            <CardDescription>{steps[step].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 0 && <ModelSelector />}
            {step === 1 && <DatasetUploader />}
            {step === 2 && <TrainingConfig />}
            {step === 3 && <LaunchConfirmation />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button disabled={!canProceed()}>
                Launch Training
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
