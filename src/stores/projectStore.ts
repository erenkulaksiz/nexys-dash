
import { create } from "zustand";
import { Log } from "@/utils";
import type { ProjectTypes } from '@/types';

interface ProjectState {
  currentProject: ProjectTypes | null;
  notFound: boolean;
  loading: boolean;
  actions: {
    setCurrentProject: (user: any) => void;
    setProjectLoading: (loading: boolean) => void;
    setNotFound: (notFound: boolean) => void;
  };
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  loading: true,
  notFound: false,
  actions: {
    setCurrentProject: function (currentProject: ProjectTypes | null) {
      set({ currentProject });
      Log.debug("Current project set to: ", currentProject)
    },
    setProjectLoading(loading: boolean) {
      set({ loading });
    },
    setNotFound: function (notFound: boolean) {
      set({ notFound });
    }
  },
}));

export const setProjectLoading = useProjectStore.getState().actions.setProjectLoading;
export const setCurrentProject = useProjectStore.getState().actions.setCurrentProject;
export const setNotFound = useProjectStore.getState().actions.setNotFound;