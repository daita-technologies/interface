import {
  CLONE_PROJECT_TO_ANNOTATION,
  FETCH_LIST_ANNOTATION_PROJECTS,
  SET_CURRENT_ANNOTATION_PROJECT,
  SHOW_DIALOG_CLONE_PROJECT_TO_ANNOTATION,
} from "./constants";
import {
  CloneProjectToAnnotationProps,
  fetchListAnnotationProjectsProps,
  SetCurrentAnnotationProjectProps,
  SetDialogCloneProjectToAnnotationProps,
} from "./type";

export const cloneProjectToAnnotation = (
  payload: CloneProjectToAnnotationProps
) => ({
  type: CLONE_PROJECT_TO_ANNOTATION.REQUESTED,
  payload,
});

export const setShowDialogCloneProjectToAnnotation = (
  payload: SetDialogCloneProjectToAnnotationProps
) => ({
  type: SHOW_DIALOG_CLONE_PROJECT_TO_ANNOTATION,
  payload,
});

export const setCurrentAnnotationProject = (
  payload: SetCurrentAnnotationProjectProps
) => ({
  type: SET_CURRENT_ANNOTATION_PROJECT,
  payload,
});
export const fetchListAnnotationProjects = (
  payload: fetchListAnnotationProjectsProps
) => ({
  type: FETCH_LIST_ANNOTATION_PROJECTS.REQUESTED,
  payload,
});
