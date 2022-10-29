import { SetIsOpenDeleteConfirmPayload } from "reduxes/project/type";
import {
  CLONE_PROJECT_TO_ANNOTATION,
  DELETE_ANNOTATION_PROJECT,
  FETCH_ANNOTATION_AND_FILE_INFO,
  FETCH_ANNOTATION_FILES,
  FETCH_DETAIL_ANNOTATION_PROJECT,
  FETCH_LIST_ANNOTATION_PROJECTS,
  SET_ANNOTATION_FILES,
  SET_CURRENT_ANNOTATION_PROJECT,
  SET_IS_OPEN_DELETE_ANNOTATION_PROJECT_CONFIRM,
  SHOW_DIALOG_CLONE_PROJECT_TO_ANNOTATION,
} from "./constants";
import {
  CloneProjectToAnnotationProps,
  DeleteAnnotationProjectProps,
  FetchAnnotationAndFileInfoProps,
  FetchAnnotationFilesProps,
  FetchDetailAnnotationProjectsProps,
  FetchListAnnotationProjectsProps,
  SetAnnotationFilesProps,
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
export const deleteAnnotatonProject = (
  payload: DeleteAnnotationProjectProps
) => ({
  type: DELETE_ANNOTATION_PROJECT.REQUESTED,
  payload,
});
export const setIsOpenDeleteProject = (
  payload: null | SetIsOpenDeleteConfirmPayload
) => ({
  type: SET_IS_OPEN_DELETE_ANNOTATION_PROJECT_CONFIRM,
  payload,
});
export const setAnnotationFiles = (
  payload: null | SetAnnotationFilesProps
) => ({
  type: SET_ANNOTATION_FILES,
  payload,
});
