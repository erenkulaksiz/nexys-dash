import { create } from "zustand";
import { Log } from "@/utils";

interface AdminState {
  pageType: "users" | "projects";
  users: any;
  projects: any;
  loading: boolean;
  actions: {
    setPageType: (type: AdminState["pageType"]) => void;
    setUsers: (users: AdminState["users"]) => void;
    setLoading: (loading: AdminState["loading"]) => void;
    setProjects: (projects: AdminState["projects"]) => void;
  };
}

export const useAdminStore = create<AdminState>((set) => ({
  pageType: "users",
  users: null,
  projects: null,
  loading: false,
  actions: {
    setPageType: function (pageType: AdminState["pageType"]) {
      set({ pageType });
      Log.debug("Current admin page type set to: ", pageType);
    },
    setUsers: function (users: AdminState["users"]) {
      set({ users });
      Log.debug("Current admin users set to: ", users);
    },
    setLoading: function (loading: AdminState["loading"]) {
      set({ loading });
      Log.debug("Current admin loading set to: ", loading);
    },
    setProjects: function (projects: AdminState["projects"]) {
      set({ projects });
      Log.debug("Current admin projects set to: ", projects);
    },
  },
}));

export const setLoading = useAdminStore.getState().actions.setLoading;
export const setUsers = useAdminStore.getState().actions.setUsers;
export const setProjects = useAdminStore.getState().actions.setProjects;
export const setPageType = useAdminStore.getState().actions.setPageType;
