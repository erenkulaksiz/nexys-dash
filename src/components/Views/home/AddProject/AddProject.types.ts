import type { ProjectTypes } from "@/types";

export interface AddProjectProps {
  onAddProject: (project: ProjectTypes) => void;
  loading?: boolean;
}

export interface AddProjectTypes {
  name: string;
  domain: string;
  errors: {
    name: string;
    domain: string;
    project: string;
  }
}

export enum AddProjectActionType {
  SET_NAME = "SET_NAME",
  SET_DOMAIN = "SET_DOMAIN",
  SET_NAME_ERROR = "SET_NAME_ERROR",
  SET_DOMAIN_ERROR = "SET_DOMAIN_ERROR",
  SET_PROJECT_ERROR = "SET_PROJECT_ERROR",
}

export interface ProjectAction {
  type: AddProjectActionType;
  payload?: any;
}
