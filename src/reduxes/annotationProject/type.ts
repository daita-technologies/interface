import { ApiListProjectsItem } from "reduxes/project/type";
import { CLONE_PROJECT_TO_ANNOTATION } from "./constants";

export interface AnnotationProjectReducer {
  listProjects: Array<ApiListProjectsItem>;
  dialogCloneProjectToAnnotation: DialogCloneProjectToAnnotation;
  isCloningProjectToAnnotation: boolean;
  currentProjectName: string;
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
