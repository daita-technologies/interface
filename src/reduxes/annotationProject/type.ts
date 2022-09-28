import {
  ApiListProjectsItem,
  GENERATE_PROJECT_STATUS_TYPE,
} from "reduxes/project/type";
import { CLONE_PROJECT_TO_ANNOTATION } from "./constants";

export interface AnnotationProjectReducer {
  listProjects: Array<ApiListAnnotationProjectsItem>;
  dialogCloneProjectToAnnotation: DialogCloneProjectToAnnotation;
  isCloningProjectToAnnotation: boolean;
  currentProjectName: string;
  isFetchingProjects: boolean;
}
export interface ApiListAnnotationProjectsItem {
  project_id: string;
  project_name: string;
  gen_status: GENERATE_PROJECT_STATUS_TYPE;
  created_date: string;
}
export interface DialogCloneProjectToAnnotation {
  isShow: boolean;
  projectName?: string;
}

export interface CloneProjectToAnnotationProps {
  fromProjectName: string;
  annotationProjectName: String;
  annotationProjectDescription: String;
}
export interface SetDialogCloneProjectToAnnotationProps {
  dialogCloneProjectToAnnotation: DialogCloneProjectToAnnotation;
}
export interface SetCurrentAnnotationProjectProps {
  projectName: string;
}
export interface fetchListAnnotationProjectsProps {
  idToken: string | null;
}
