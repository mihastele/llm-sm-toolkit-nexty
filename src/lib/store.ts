import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Project, ModelConfig, TrainingRun, Endpoint, ResearchSession } from "@/types";

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);

// Project Store
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
      currentProject:
        state.currentProject?.id === id
          ? { ...state.currentProject, ...updates }
          : state.currentProject,
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject:
        state.currentProject?.id === id ? null : state.currentProject,
    })),
}));

// Model Catalog Store
interface ModelCatalogState {
  models: ModelConfig[];
  selectedModel: ModelConfig | null;
  filters: {
    source?: string;
    minContextLength?: number;
    maxCost?: number;
    fineTuneType?: string;
  };
  setModels: (models: ModelConfig[]) => void;
  setSelectedModel: (model: ModelConfig | null) => void;
  setFilters: (filters: ModelCatalogState["filters"]) => void;
}

export const useModelCatalogStore = create<ModelCatalogState>((set) => ({
  models: [],
  selectedModel: null,
  filters: {},
  setModels: (models) => set({ models }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setFilters: (filters) => set({ filters }),
}));

// Fine-Tune Wizard Store
interface FineTuneWizardState {
  step: number;
  modelId: string | null;
  datasetId: string | null;
  config: {
    simple: {
      maxCostUsd?: number;
      maxHours?: number;
      qualityPreset: "low" | "medium" | "high";
      outputStyle: "instruction" | "chat" | "classification";
    };
    advanced?: {
      epochs: number;
      learningRate: number;
      batchSize: number;
      warmupRatio: number;
      gradientCheckpointing: boolean;
      packing: boolean;
      fineTuneType: "full" | "lora" | "qlora";
      loraRank?: number;
      loraAlpha?: number;
      quantizationBits?: 4 | 8;
      maxSteps?: number;
    };
    useAdvanced: boolean;
  };
  setStep: (step: number) => void;
  setModelId: (id: string | null) => void;
  setDatasetId: (id: string | null) => void;
  setSimpleConfig: (config: FineTuneWizardState["config"]["simple"]) => void;
  setAdvancedConfig: (config: NonNullable<FineTuneWizardState["config"]["advanced"]>) => void;
  setUseAdvanced: (useAdvanced: boolean) => void;
  reset: () => void;
}

const defaultWizardState = {
  step: 0,
  modelId: null,
  datasetId: null,
  config: {
    simple: {
      qualityPreset: "medium" as const,
      outputStyle: "instruction" as const,
    },
    useAdvanced: false,
  },
};

export const useFineTuneWizardStore = create<FineTuneWizardState>((set) => ({
  ...defaultWizardState,
  setStep: (step) => set({ step }),
  setModelId: (id) => set({ modelId: id }),
  setDatasetId: (id) => set({ datasetId: id }),
  setSimpleConfig: (config) =>
    set((state) => ({ config: { ...state.config, simple: config } })),
  setAdvancedConfig: (config) =>
    set((state) => ({ config: { ...state.config, advanced: config } })),
  setUseAdvanced: (useAdvanced) =>
    set((state) => ({ config: { ...state.config, useAdvanced } })),
  reset: () => set(defaultWizardState),
}));

// Training Runs Store
interface TrainingRunsState {
  runs: TrainingRun[];
  currentRun: TrainingRun | null;
  setRuns: (runs: TrainingRun[]) => void;
  setCurrentRun: (run: TrainingRun | null) => void;
  updateRun: (id: string, updates: Partial<TrainingRun>) => void;
}

export const useTrainingRunsStore = create<TrainingRunsState>((set) => ({
  runs: [],
  currentRun: null,
  setRuns: (runs) => set({ runs }),
  setCurrentRun: (run) => set({ currentRun: run }),
  updateRun: (id, updates) =>
    set((state) => ({
      runs: state.runs.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      currentRun:
        state.currentRun?.id === id
          ? { ...state.currentRun, ...updates }
          : state.currentRun,
    })),
}));

// Endpoints Store
interface EndpointsState {
  endpoints: Endpoint[];
  currentEndpoint: Endpoint | null;
  setEndpoints: (endpoints: Endpoint[]) => void;
  setCurrentEndpoint: (endpoint: Endpoint | null) => void;
  addEndpoint: (endpoint: Endpoint) => void;
  updateEndpoint: (id: string, updates: Partial<Endpoint>) => void;
  removeEndpoint: (id: string) => void;
}

export const useEndpointsStore = create<EndpointsState>((set) => ({
  endpoints: [],
  currentEndpoint: null,
  setEndpoints: (endpoints) => set({ endpoints }),
  setCurrentEndpoint: (endpoint) => set({ currentEndpoint: endpoint }),
  addEndpoint: (endpoint) =>
    set((state) => ({ endpoints: [...state.endpoints, endpoint] })),
  updateEndpoint: (id, updates) =>
    set((state) => ({
      endpoints: state.endpoints.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
      currentEndpoint:
        state.currentEndpoint?.id === id
          ? { ...state.currentEndpoint, ...updates }
          : state.currentEndpoint,
    })),
  removeEndpoint: (id) =>
    set((state) => ({
      endpoints: state.endpoints.filter((e) => e.id !== id),
      currentEndpoint:
        state.currentEndpoint?.id === id ? null : state.currentEndpoint,
    })),
}));

// Research Sessions Store
interface ResearchSessionsState {
  sessions: ResearchSession[];
  currentSession: ResearchSession | null;
  setSessions: (sessions: ResearchSession[]) => void;
  setCurrentSession: (session: ResearchSession | null) => void;
  addSession: (session: ResearchSession) => void;
  updateSession: (id: string, updates: Partial<ResearchSession>) => void;
}

export const useResearchSessionsStore = create<ResearchSessionsState>((set) => ({
  sessions: [],
  currentSession: null,
  setSessions: (sessions) => set({ sessions }),
  setCurrentSession: (session) => set({ currentSession: session }),
  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),
  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
      currentSession:
        state.currentSession?.id === id
          ? { ...state.currentSession, ...updates }
          : state.currentSession,
    })),
}));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  assistantOpen: boolean;
  theme: "light" | "dark" | "system";
  setSidebarOpen: (open: boolean) => void;
  setAssistantOpen: (open: boolean) => void;
  setTheme: (theme: UIState["theme"]) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      assistantOpen: false,
      theme: "system",
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setAssistantOpen: (open) => set({ assistantOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "ui-storage" }
  )
);
