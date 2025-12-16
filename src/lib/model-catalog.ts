import type { ModelConfig } from "@/types";

export const MODEL_CATALOG: ModelConfig[] = [
  {
    id: "llama-3-8b",
    name: "Llama 3 8B",
    provider: "Meta",
    source: "jumpstart",
    modelId: "meta-textgeneration-llama-3-8b",
    description: "Meta's latest open LLM, excellent for instruction following and chat applications.",
    parameterCount: "8B",
    contextLength: 8192,
    license: "Llama 3 Community License",
    supportedFineTuneTypes: ["full", "lora", "qlora"],
    recommendedInstance: "ml.g5.2xlarge",
    minGpuMemoryGb: 24,
    estimatedCostPerHour: 1.21,
    tags: ["chat", "instruction", "general-purpose"],
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    source: "jumpstart",
    modelId: "meta-textgeneration-llama-3-70b",
    description: "Larger Llama 3 variant with superior reasoning and knowledge capabilities.",
    parameterCount: "70B",
    contextLength: 8192,
    license: "Llama 3 Community License",
    supportedFineTuneTypes: ["lora", "qlora"],
    recommendedInstance: "ml.p4d.24xlarge",
    minGpuMemoryGb: 140,
    estimatedCostPerHour: 32.77,
    tags: ["chat", "instruction", "reasoning", "enterprise"],
  },
  {
    id: "mistral-7b-v02",
    name: "Mistral 7B v0.2",
    provider: "Mistral AI",
    source: "jumpstart",
    modelId: "huggingface-llm-mistral-7b-v0-2",
    description: "Efficient 7B model with sliding window attention for longer context.",
    parameterCount: "7B",
    contextLength: 32768,
    license: "Apache 2.0",
    supportedFineTuneTypes: ["full", "lora", "qlora"],
    recommendedInstance: "ml.g5.2xlarge",
    minGpuMemoryGb: 16,
    estimatedCostPerHour: 1.21,
    tags: ["chat", "instruction", "long-context", "efficient"],
  },
  {
    id: "mistral-7b-instruct-v02",
    name: "Mistral 7B Instruct v0.2",
    provider: "Mistral AI",
    source: "jumpstart",
    modelId: "huggingface-llm-mistral-7b-instruct-v0-2",
    description: "Instruction-tuned Mistral model, optimized for following instructions.",
    parameterCount: "7B",
    contextLength: 32768,
    license: "Apache 2.0",
    supportedFineTuneTypes: ["full", "lora", "qlora"],
    recommendedInstance: "ml.g5.2xlarge",
    minGpuMemoryGb: 16,
    estimatedCostPerHour: 1.21,
    tags: ["instruction", "efficient", "production-ready"],
  },
  {
    id: "codellama-7b",
    name: "Code Llama 7B",
    provider: "Meta",
    source: "jumpstart",
    modelId: "meta-textgeneration-llama-codellama-7b",
    description: "Specialized coding model fine-tuned from Llama 2 for code generation.",
    parameterCount: "7B",
    contextLength: 16384,
    license: "Llama 2 Community License",
    supportedFineTuneTypes: ["full", "lora", "qlora"],
    recommendedInstance: "ml.g5.2xlarge",
    minGpuMemoryGb: 16,
    estimatedCostPerHour: 1.21,
    tags: ["code", "programming", "technical"],
  },
  {
    id: "codellama-13b",
    name: "Code Llama 13B",
    provider: "Meta",
    source: "jumpstart",
    modelId: "meta-textgeneration-llama-codellama-13b",
    description: "Larger Code Llama with improved code understanding and generation.",
    parameterCount: "13B",
    contextLength: 16384,
    license: "Llama 2 Community License",
    supportedFineTuneTypes: ["lora", "qlora"],
    recommendedInstance: "ml.g5.4xlarge",
    minGpuMemoryGb: 32,
    estimatedCostPerHour: 2.03,
    tags: ["code", "programming", "technical"],
  },
  {
    id: "falcon-7b",
    name: "Falcon 7B",
    provider: "TII",
    source: "jumpstart",
    modelId: "huggingface-llm-falcon-7b-bf16",
    description: "Efficient open model trained on high-quality web data.",
    parameterCount: "7B",
    contextLength: 2048,
    license: "Apache 2.0",
    supportedFineTuneTypes: ["full", "lora", "qlora"],
    recommendedInstance: "ml.g5.2xlarge",
    minGpuMemoryGb: 16,
    estimatedCostPerHour: 1.21,
    tags: ["general-purpose", "efficient"],
  },
  {
    id: "falcon-40b",
    name: "Falcon 40B",
    provider: "TII",
    source: "jumpstart",
    modelId: "huggingface-llm-falcon-40b-bf16",
    description: "Large open model with strong performance across benchmarks.",
    parameterCount: "40B",
    contextLength: 2048,
    license: "Apache 2.0",
    supportedFineTuneTypes: ["lora", "qlora"],
    recommendedInstance: "ml.g5.12xlarge",
    minGpuMemoryGb: 80,
    estimatedCostPerHour: 7.09,
    tags: ["general-purpose", "enterprise"],
  },
  {
    id: "phi-2",
    name: "Phi-2",
    provider: "Microsoft",
    source: "huggingface",
    modelId: "microsoft/phi-2",
    description: "Small but powerful 2.7B model with strong reasoning capabilities.",
    parameterCount: "2.7B",
    contextLength: 2048,
    license: "MIT",
    supportedFineTuneTypes: ["full", "lora", "qlora"],
    recommendedInstance: "ml.g5.xlarge",
    minGpuMemoryGb: 8,
    estimatedCostPerHour: 0.84,
    tags: ["small", "efficient", "reasoning", "educational"],
  },
  {
    id: "gemma-2b",
    name: "Gemma 2B",
    provider: "Google",
    source: "huggingface",
    modelId: "google/gemma-2b",
    description: "Google's lightweight open model, optimized for efficiency.",
    parameterCount: "2B",
    contextLength: 8192,
    license: "Gemma License",
    supportedFineTuneTypes: ["full", "lora", "qlora"],
    recommendedInstance: "ml.g5.xlarge",
    minGpuMemoryGb: 8,
    estimatedCostPerHour: 0.84,
    tags: ["small", "efficient", "google"],
  },
  {
    id: "gemma-7b",
    name: "Gemma 7B",
    provider: "Google",
    source: "huggingface",
    modelId: "google/gemma-7b",
    description: "Google's 7B open model with strong instruction-following capabilities.",
    parameterCount: "7B",
    contextLength: 8192,
    license: "Gemma License",
    supportedFineTuneTypes: ["full", "lora", "qlora"],
    recommendedInstance: "ml.g5.2xlarge",
    minGpuMemoryGb: 16,
    estimatedCostPerHour: 1.21,
    tags: ["instruction", "chat", "google"],
  },
  {
    id: "zephyr-7b-beta",
    name: "Zephyr 7B Beta",
    provider: "Hugging Face",
    source: "huggingface",
    modelId: "HuggingFaceH4/zephyr-7b-beta",
    description: "Fine-tuned Mistral model optimized for helpful assistant behavior.",
    parameterCount: "7B",
    contextLength: 32768,
    license: "MIT",
    supportedFineTuneTypes: ["full", "lora", "qlora"],
    recommendedInstance: "ml.g5.2xlarge",
    minGpuMemoryGb: 16,
    estimatedCostPerHour: 1.21,
    tags: ["chat", "assistant", "aligned", "helpful"],
  },
];

export const INSTANCE_TYPES = [
  { id: "ml.g5.xlarge", name: "ml.g5.xlarge", gpuMemoryGb: 24, vcpus: 4, costPerHour: 0.84 },
  { id: "ml.g5.2xlarge", name: "ml.g5.2xlarge", gpuMemoryGb: 24, vcpus: 8, costPerHour: 1.21 },
  { id: "ml.g5.4xlarge", name: "ml.g5.4xlarge", gpuMemoryGb: 24, vcpus: 16, costPerHour: 2.03 },
  { id: "ml.g5.8xlarge", name: "ml.g5.8xlarge", gpuMemoryGb: 24, vcpus: 32, costPerHour: 3.67 },
  { id: "ml.g5.12xlarge", name: "ml.g5.12xlarge", gpuMemoryGb: 96, vcpus: 48, costPerHour: 7.09 },
  { id: "ml.g5.24xlarge", name: "ml.g5.24xlarge", gpuMemoryGb: 96, vcpus: 96, costPerHour: 10.18 },
  { id: "ml.g5.48xlarge", name: "ml.g5.48xlarge", gpuMemoryGb: 192, vcpus: 192, costPerHour: 20.36 },
  { id: "ml.p4d.24xlarge", name: "ml.p4d.24xlarge", gpuMemoryGb: 320, vcpus: 96, costPerHour: 32.77 },
];

export const AWS_REGIONS = [
  { id: "us-east-1", name: "US East (N. Virginia)" },
  { id: "us-east-2", name: "US East (Ohio)" },
  { id: "us-west-2", name: "US West (Oregon)" },
  { id: "eu-west-1", name: "Europe (Ireland)" },
  { id: "eu-central-1", name: "Europe (Frankfurt)" },
  { id: "ap-northeast-1", name: "Asia Pacific (Tokyo)" },
  { id: "ap-southeast-1", name: "Asia Pacific (Singapore)" },
];

export function getModelById(id: string): ModelConfig | undefined {
  return MODEL_CATALOG.find((m) => m.id === id);
}

export function getInstanceByType(type: string) {
  return INSTANCE_TYPES.find((i) => i.id === type);
}

export function estimateTrainingCost(
  model: ModelConfig,
  datasetSize: number,
  config: { epochs: number; batchSize: number }
): { minCost: number; maxCost: number; estimatedHours: number } {
  const instance = getInstanceByType(model.recommendedInstance);
  if (!instance) return { minCost: 0, maxCost: 0, estimatedHours: 0 };

  const stepsPerEpoch = Math.ceil(datasetSize / config.batchSize);
  const totalSteps = stepsPerEpoch * config.epochs;
  const estimatedHours = (totalSteps * 2) / 3600; // ~2 seconds per step estimate
  
  const baseCost = estimatedHours * instance.costPerHour;
  
  return {
    minCost: Math.round(baseCost * 0.8 * 100) / 100,
    maxCost: Math.round(baseCost * 1.5 * 100) / 100,
    estimatedHours: Math.round(estimatedHours * 10) / 10,
  };
}

export function getRecommendedConfig(
  model: ModelConfig,
  datasetSize: number,
  qualityPreset: "low" | "medium" | "high"
) {
  const presetMultipliers = {
    low: { epochs: 1, lr: 2e-5, batchSize: 8 },
    medium: { epochs: 3, lr: 1e-5, batchSize: 4 },
    high: { epochs: 5, lr: 5e-6, batchSize: 2 },
  };

  const preset = presetMultipliers[qualityPreset];
  const useQlora = model.parameterCount.includes("70") || model.parameterCount.includes("40");
  
  return {
    epochs: preset.epochs,
    learningRate: preset.lr,
    batchSize: preset.batchSize,
    warmupRatio: 0.1,
    gradientCheckpointing: true,
    packing: datasetSize > 1000,
    fineTuneType: useQlora ? "qlora" : model.supportedFineTuneTypes[0],
    loraRank: useQlora ? 16 : 64,
    loraAlpha: useQlora ? 32 : 128,
    quantizationBits: useQlora ? 4 : undefined,
  };
}
