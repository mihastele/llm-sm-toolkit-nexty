import axios from "axios";
import type {
  User,
  Project,
  ModelConfig,
  Dataset,
  DatasetValidation,
  TrainingRun,
  TrainingConfig,
  Endpoint,
  EndpointConfig,
  InferenceRequest,
  InferenceResponse,
  EvaluationRun,
  ResearchSession,
  AssistantMessage,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth APIs
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },
  
  register: async (email: string, password: string, name: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    const { data } = await api.post("/auth/register", { email, password, name });
    return data;
  },
  
  logout: async (): Promise<ApiResponse<void>> => {
    const { data } = await api.post("/auth/logout");
    return data;
  },
  
  getProfile: async (): Promise<ApiResponse<User>> => {
    const { data } = await api.get("/auth/profile");
    return data;
  },
  
  updateProfile: async (updates: Partial<User>): Promise<ApiResponse<User>> => {
    const { data } = await api.patch("/auth/profile", updates);
    return data;
  },
};

// Project APIs
export const projectApi = {
  list: async (page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<Project>>> => {
    const { data } = await api.get(`/projects?page=${page}&pageSize=${pageSize}`);
    return data;
  },
  
  get: async (id: string): Promise<ApiResponse<Project>> => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },
  
  create: async (project: Omit<Project, "id" | "userId" | "createdAt" | "updatedAt">): Promise<ApiResponse<Project>> => {
    const { data } = await api.post("/projects", project);
    return data;
  },
  
  update: async (id: string, updates: Partial<Project>): Promise<ApiResponse<Project>> => {
    const { data } = await api.patch(`/projects/${id}`, updates);
    return data;
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  },
};

// Model Catalog APIs
export const modelApi = {
  list: async (filters?: {
    source?: string;
    minContextLength?: number;
    maxCost?: number;
    fineTuneType?: string;
  }): Promise<ApiResponse<ModelConfig[]>> => {
    const { data } = await api.get("/models", { params: filters });
    return data;
  },
  
  get: async (id: string): Promise<ApiResponse<ModelConfig>> => {
    const { data } = await api.get(`/models/${id}`);
    return data;
  },
};

// Dataset APIs
export const datasetApi = {
  list: async (projectId: string): Promise<ApiResponse<Dataset[]>> => {
    const { data } = await api.get(`/projects/${projectId}/datasets`);
    return data;
  },
  
  get: async (projectId: string, datasetId: string): Promise<ApiResponse<Dataset>> => {
    const { data } = await api.get(`/projects/${projectId}/datasets/${datasetId}`);
    return data;
  },
  
  getUploadUrl: async (projectId: string, filename: string): Promise<ApiResponse<{ uploadUrl: string; s3Path: string }>> => {
    const { data } = await api.post(`/projects/${projectId}/datasets/upload-url`, { filename });
    return data;
  },
  
  validate: async (projectId: string, s3Path: string, format: string): Promise<ApiResponse<DatasetValidation>> => {
    const { data } = await api.post(`/projects/${projectId}/datasets/validate`, { s3Path, format });
    return data;
  },
  
  create: async (projectId: string, dataset: Omit<Dataset, "id" | "projectId" | "createdAt">): Promise<ApiResponse<Dataset>> => {
    const { data } = await api.post(`/projects/${projectId}/datasets`, dataset);
    return data;
  },
  
  delete: async (projectId: string, datasetId: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/projects/${projectId}/datasets/${datasetId}`);
    return data;
  },
};

// Training APIs
export const trainingApi = {
  list: async (projectId: string): Promise<ApiResponse<TrainingRun[]>> => {
    const { data } = await api.get(`/projects/${projectId}/fine-tunes`);
    return data;
  },
  
  get: async (projectId: string, runId: string): Promise<ApiResponse<TrainingRun>> => {
    const { data } = await api.get(`/projects/${projectId}/fine-tunes/${runId}`);
    return data;
  },
  
  create: async (
    projectId: string,
    params: {
      modelId: string;
      datasetId: string;
      config: TrainingConfig;
    }
  ): Promise<ApiResponse<TrainingRun>> => {
    const { data } = await api.post(`/projects/${projectId}/fine-tunes`, params);
    return data;
  },
  
  stop: async (projectId: string, runId: string): Promise<ApiResponse<TrainingRun>> => {
    const { data } = await api.post(`/projects/${projectId}/fine-tunes/${runId}/stop`);
    return data;
  },
  
  duplicate: async (projectId: string, runId: string): Promise<ApiResponse<TrainingRun>> => {
    const { data } = await api.post(`/projects/${projectId}/fine-tunes/${runId}/duplicate`);
    return data;
  },
  
  getLogs: async (projectId: string, runId: string, nextToken?: string): Promise<ApiResponse<{
    logs: string[];
    nextToken?: string;
  }>> => {
    const { data } = await api.get(`/projects/${projectId}/fine-tunes/${runId}/logs`, {
      params: { nextToken },
    });
    return data;
  },
};

// Endpoint APIs
export const endpointApi = {
  list: async (projectId: string): Promise<ApiResponse<Endpoint[]>> => {
    const { data } = await api.get(`/projects/${projectId}/endpoints`);
    return data;
  },
  
  get: async (projectId: string, endpointId: string): Promise<ApiResponse<Endpoint>> => {
    const { data } = await api.get(`/projects/${projectId}/endpoints/${endpointId}`);
    return data;
  },
  
  create: async (
    projectId: string,
    params: {
      trainingRunId: string;
      name: string;
      config: EndpointConfig;
    }
  ): Promise<ApiResponse<Endpoint>> => {
    const { data } = await api.post(`/projects/${projectId}/endpoints`, params);
    return data;
  },
  
  update: async (projectId: string, endpointId: string, config: Partial<EndpointConfig>): Promise<ApiResponse<Endpoint>> => {
    const { data } = await api.patch(`/projects/${projectId}/endpoints/${endpointId}`, config);
    return data;
  },
  
  delete: async (projectId: string, endpointId: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/projects/${projectId}/endpoints/${endpointId}`);
    return data;
  },
  
  invoke: async (projectId: string, endpointId: string, request: Omit<InferenceRequest, "endpointId">): Promise<ApiResponse<InferenceResponse>> => {
    const { data } = await api.post(`/projects/${projectId}/endpoints/${endpointId}/invoke`, request);
    return data;
  },
};

// Evaluation APIs
export const evaluationApi = {
  list: async (projectId: string, endpointId: string): Promise<ApiResponse<EvaluationRun[]>> => {
    const { data } = await api.get(`/projects/${projectId}/endpoints/${endpointId}/evaluations`);
    return data;
  },
  
  create: async (
    projectId: string,
    endpointId: string,
    params: {
      datasetId: string;
      metric: string;
    }
  ): Promise<ApiResponse<EvaluationRun>> => {
    const { data } = await api.post(`/projects/${projectId}/endpoints/${endpointId}/evaluations`, params);
    return data;
  },
  
  get: async (projectId: string, endpointId: string, evalId: string): Promise<ApiResponse<EvaluationRun>> => {
    const { data } = await api.get(`/projects/${projectId}/endpoints/${endpointId}/evaluations/${evalId}`);
    return data;
  },
};

// Research APIs
export const researchApi = {
  list: async (projectId: string): Promise<ApiResponse<ResearchSession[]>> => {
    const { data } = await api.get(`/projects/${projectId}/research`);
    return data;
  },
  
  get: async (projectId: string, sessionId: string): Promise<ApiResponse<ResearchSession>> => {
    const { data } = await api.get(`/projects/${projectId}/research/${sessionId}`);
    return data;
  },
  
  create: async (
    projectId: string,
    params: {
      question: string;
      depth: string;
      outputFormat: string;
      constraints?: object;
    }
  ): Promise<ApiResponse<ResearchSession>> => {
    const { data } = await api.post(`/projects/${projectId}/research`, params);
    return data;
  },
  
  followUp: async (projectId: string, sessionId: string, question: string): Promise<ApiResponse<ResearchSession>> => {
    const { data } = await api.post(`/projects/${projectId}/research/${sessionId}/follow-up`, { question });
    return data;
  },
};

// AI Assistant APIs
export const assistantApi = {
  chat: async (messages: AssistantMessage[]): Promise<ApiResponse<{ response: string }>> => {
    const { data } = await api.post("/assistant/chat", { messages });
    return data;
  },
  
  explain: async (topic: string, context?: object): Promise<ApiResponse<{ explanation: string }>> => {
    const { data } = await api.post("/assistant/explain", { topic, context });
    return data;
  },
  
  suggest: async (step: string, formData: object): Promise<ApiResponse<{ suggestions: Record<string, unknown> }>> => {
    const { data } = await api.post("/assistant/suggest", { step, formData });
    return data;
  },
};

// Set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
