import { create } from "zustand";
import { Log } from "@/utils";
import type { ProjectTypes } from "@/types";

interface ProjectState {
  currentProject: ProjectTypes | null;
  currentBatch: any;
  logs: any;
  logsLoading: boolean;
  exceptions: any;
  exceptionsLoading: boolean;
  batches: any;
  batchesLoading: boolean;
  loading: boolean;
  notFound: boolean;
  batchLoading: boolean;
  actions: {
    setCurrentProject: (user: any) => void;
    setCurrentBatch: (batch: any) => void;
    setProjectLoading: (loading: boolean) => void;
    setNotFound: (notFound: boolean) => void;
    setLogs: (logs: any) => void;
    setLogsLoading: (logsLoading: boolean) => void;
    setExceptions: (exceptions: any) => void;
    setExceptionsLoading: (exceptionsLoading: boolean) => void;
    setBatches: (batches: any) => void;
    setBatchesLoading: (batchesLoading: boolean) => void;
    setBatchLoading: (batchLoading: boolean) => void;
  };
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  currentBatch: null,
  logs: [],
  logsLoading: true,
  exceptions: [],
  exceptionsLoading: true,
  batches: [],
  batchesLoading: true,
  loading: true,
  notFound: false,
  batchLoading: true,
  actions: {
    setCurrentProject: function (currentProject: ProjectTypes | null) {
      set({ currentProject });
      Log.debug("Current project set to: ", currentProject);
    },
    setCurrentBatch(currentBatch: any) {
      set({ currentBatch });
    },
    setProjectLoading(loading: boolean) {
      set({ loading });
    },
    setNotFound: function (notFound: boolean) {
      set({ notFound });
    },
    setLogs: function (logs: any) {
      set({ logs });
    },
    setLogsLoading: function (logsLoading: boolean) {
      set({ logsLoading });
    },
    setExceptions: function (exceptions: any) {
      set({ exceptions });
    },
    setExceptionsLoading: function (exceptionsLoading: boolean) {
      set({ exceptionsLoading });
    },
    setBatches: function (batches: any) {
      set({ batches });
    },
    setBatchesLoading: function (batchesLoading: boolean) {
      set({ batchesLoading });
    },
    setBatchLoading: function (batchLoading: boolean) {
      set({ batchLoading });
    },
  },
}));

export const setProjectLoading =
  useProjectStore.getState().actions.setProjectLoading;
export const setCurrentProject =
  useProjectStore.getState().actions.setCurrentProject;
export const setNotFound = useProjectStore.getState().actions.setNotFound;
export const setLogs = useProjectStore.getState().actions.setLogs;
export const setLogsLoading = useProjectStore.getState().actions.setLogsLoading;
export const setExceptions = useProjectStore.getState().actions.setExceptions;
export const setExceptionsLoading =
  useProjectStore.getState().actions.setExceptionsLoading;
export const setBatches = useProjectStore.getState().actions.setBatches;
export const setBatchesLoading =
  useProjectStore.getState().actions.setBatchesLoading;
export const setBatchLoading =
  useProjectStore.getState().actions.setBatchLoading;
export const setCurrentBatch =
  useProjectStore.getState().actions.setCurrentBatch;
