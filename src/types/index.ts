// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  organization?: string;
  defaultRegion: string;
  createdAt: string;
}

// Project Types
export type ProjectType = "fine-tune" | "deep-research";

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: ProjectType;
  tags: string[];
  awsRegion: string;
  s3Bucket: string;
  createdAt: string;
  updatedAt: string;
}

// Model Catalog Types
export type FineTuneType = "full" | "lora" | "qlora";
export type ModelSource = "jumpstart" | "huggingface" | "custom";

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  source: ModelSource;
  modelId: string;
  description: string;
  parameterCount: string;
  contextLength: number;
  license: string;
  supportedFineTuneTypes: FineTuneType[];
  recommendedInstance: string;
  minGpuMemoryGb: number;
  estimatedCostPerHour: number;
  tags: string[];
}

// Dataset Types
export type DatasetFormat = "jsonl" | "csv";

export interface DatasetColumn {
  name: string;
  type: "prompt" | "response" | "system" | "context" | "label" | "other";
}

export interface DatasetValidation {
  isValid: boolean;
  totalRows: number;
  estimatedTokens: number;
  errors: string[];
  warnings: string[];
  sampleRows: Record<string, string>[];
}

export interface Dataset {
  id: string;
  projectId: string;
  name: string;
  format: DatasetFormat;
  s3Path: string;
  columnMapping: DatasetColumn[];
  validation: DatasetValidation;
  createdAt: string;
}

// Training Configuration Types
export type QualityPreset = "low" | "medium" | "high";
export type OutputStyle = "instruction" | "chat" | "classification";

export interface SimpleTrainingConfig {
  maxCostUsd?: number;
  maxHours?: number;
  qualityPreset: QualityPreset;
  outputStyle: OutputStyle;
}

export interface AdvancedTrainingConfig {
  epochs: number;
  learningRate: number;
  batchSize: number;
  warmupRatio: number;
  gradientCheckpointing: boolean;
  packing: boolean;
  fineTuneType: FineTuneType;
  loraRank?: number;
  loraAlpha?: number;
  quantizationBits?: 4 | 8;
  maxSteps?: number;
}

export interface TrainingConfig {
  simple: SimpleTrainingConfig;
  advanced?: AdvancedTrainingConfig;
  useAdvanced: boolean;
}

// Training Run Types
export type TrainingStatus =
  | "pending"
  | "starting"
  | "training"
  | "completed"
  | "failed"
  | "stopped";

export interface TrainingMetrics {
  currentStep: number;
  totalSteps: number;
  loss: number;
  learningRate: number;
  epochProgress: number;
  evalLoss?: number;
  evalAccuracy?: number;
}

export interface TrainingRun {
  id: string;
  projectId: string;
  modelId: string;
  datasetId: string;
  config: TrainingConfig;
  computedConfig: AdvancedTrainingConfig;
  instanceType: string;
  status: TrainingStatus;
  metrics?: TrainingMetrics;
  sagemakerJobName?: string;
  s3OutputPath: string;
  estimatedCostUsd: number;
  actualCostUsd?: number;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  createdAt: string;
}

// Endpoint Types
export type EndpointType = "dev" | "prod";
export type EndpointStatus = "creating" | "inservice" | "updating" | "failed" | "deleting";

export interface EndpointConfig {
  type: EndpointType;
  instanceType: string;
  minInstances: number;
  maxInstances: number;
  autoscaling: boolean;
}

export interface Endpoint {
  id: string;
  projectId: string;
  trainingRunId: string;
  name: string;
  config: EndpointConfig;
  status: EndpointStatus;
  sagemakerEndpointName?: string;
  estimatedHourlyCost: number;
  createdAt: string;
  updatedAt: string;
}

// Chat & Inference Types
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface InferenceConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt?: string;
}

export interface InferenceRequest {
  endpointId: string;
  messages: ChatMessage[];
  config: InferenceConfig;
}

export interface InferenceResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}

// Evaluation Types
export type EvalMetric = "accuracy" | "bleu" | "rouge" | "exact_match";

export interface EvalDatasetRow {
  prompt: string;
  expected: string;
  actual?: string;
  score?: number;
}

export interface EvaluationRun {
  id: string;
  endpointId: string;
  datasetId: string;
  metric: EvalMetric;
  status: "pending" | "running" | "completed" | "failed";
  results?: {
    overallScore: number;
    rows: EvalDatasetRow[];
  };
  createdAt: string;
  completedAt?: string;
}

// Deep Research Types
export type ResearchDepth = "quick" | "in-depth";
export type ResearchOutputFormat = "bullets" | "report" | "faq" | "pros-cons";

export interface ResearchConstraints {
  dateRange?: {
    start?: string;
    end?: string;
  };
  includeDomains?: string[];
  excludeDomains?: string[];
}

export interface ResearchStep {
  id: string;
  type: "plan" | "search" | "read" | "note" | "synthesize" | "critique" | "refine";
  status: "pending" | "running" | "completed" | "failed";
  description: string;
  details?: string;
  urls?: string[];
  startedAt?: string;
  completedAt?: string;
}

export interface ResearchSource {
  url: string;
  title: string;
  summary: string;
  relevanceScore: number;
  extractedAt: string;
}

export interface ResearchSession {
  id: string;
  projectId: string;
  question: string;
  depth: ResearchDepth;
  outputFormat: ResearchOutputFormat;
  constraints?: ResearchConstraints;
  status: "pending" | "running" | "completed" | "failed";
  steps: ResearchStep[];
  sources: ResearchSource[];
  result?: {
    summary: string;
    sections: {
      title: string;
      content: string;
      citations: string[];
    }[];
  };
  createdAt: string;
  completedAt?: string;
}

// AI Assistant Types
export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
  context?: {
    step: string;
    formData: Record<string, unknown>;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
