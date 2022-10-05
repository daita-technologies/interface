import {
  CLONE_PROJECT_TO_ANNOTATION,
  FETCH_ANNOTATION_AND_FILE_INFO,
  FETCH_ANNOTATION_FILES,
  FETCH_DETAIL_ANNOTATION_PROJECT,
  FETCH_LIST_ANNOTATION_PROJECTS,
  SET_CURRENT_ANNOTATION_PROJECT,
  SHOW_DIALOG_CLONE_PROJECT_TO_ANNOTATION,
} from "./constants";
import {
  CloneProjectToAnnotationProps,
  FetchAnnotationAndFileInfoProps,
  FetchAnnotationFilesProps,
  FetchDetailAnnotationProjectsProps,
  FetchListAnnotationProjectsProps,
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
  payload: FetchListAnnotationProjectsProps
) => ({
  type: FETCH_LIST_ANNOTATION_PROJECTS.REQUESTED,
  payload,
});
export const fetchDetailAnnotationProjects = (
  payload: FetchDetailAnnotationProjectsProps
) => ({
  type: FETCH_DETAIL_ANNOTATION_PROJECT.REQUESTED,
  payload,
});
export const fetchAnnotationAndFileInfo = (
  payload: FetchAnnotationAndFileInfoProps
) => ({
  type: FETCH_ANNOTATION_AND_FILE_INFO.REQUESTED,
  payload,
});
export const fetchAnnotationFiles = (payload: FetchAnnotationFilesProps) => ({
  type: FETCH_ANNOTATION_FILES.REQUESTED,
  payload,
});
