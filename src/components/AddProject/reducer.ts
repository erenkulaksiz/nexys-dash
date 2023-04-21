import {
  ProjectAction,
  AddProjectActionType,
  AddProjectTypes,
} from "./AddProject.types";

export function reducer(
  state: AddProjectTypes,
  action: ProjectAction
): AddProjectTypes {
  switch (action.type) {
    case AddProjectActionType.SET_NAME:
      return { ...state, name: action.payload };

    case AddProjectActionType.SET_DOMAIN:
      return { ...state, domain: action.payload };

    case AddProjectActionType.SET_NAME_ERROR:
      return { ...state, errors: {...state.errors, name: action.payload} };

    case AddProjectActionType.SET_DOMAIN_ERROR:
      return { ...state, errors: {...state.errors, domain: action.payload} };

    case AddProjectActionType.SET_PROJECT_ERROR:
      return { ...state, errors: {...state.errors, project: action.payload} };

    default:
      return state;
  }
}
