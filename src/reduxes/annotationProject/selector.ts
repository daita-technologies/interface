import { RootState } from "reduxes";

export const selectorAnnotationListProjects = (state: RootState) =>
  state.annotationProjectReducer.listProjects;
export const selectorAnnotationCurrentProjectName = (state: RootState) =>
  state.annotationProjectReducer.currentProjectName;
export const selectorDialogCloneProjectToAnnotation = (state: RootState) =>
  state.annotationProjectReducer.dialogCloneProjectToAnnotation;
export const selectorAnnotationCurrentProject = (state: RootState) =>
  state.annotationProjectReducer.currentProjectInfo;
export const selectorIsCloningProjectToAnnotation = (state: RootState) =>
  state.annotationProjectReducer.isCloningProjectToAnnotation;
export const selectorIsFetchingDetailAnnotationProject = (state: RootState) =>
  state.annotationProjectReducer.isFetchingDetailProject;
export const selectorCurrentAnnotationAndFileInfo = (state: RootState) =>
  state.annotationProjectReducer.currentAnnotationAndFileInfo;
export const selectorCurrentAnnotationFiles = (state: RootState) =>
  state.annotationProjectReducer.currentAnnotationFiles;
export const selectorDeleteAnnotationProjectConfirmDialogInfo = (
  state: RootState
) => state.annotationProjectReducer.deleteConfirmDialogInfo;
export const selectorIsFetchingListAnnotationProject = (state: RootState) =>
  state.annotationProjectReducer.isFetchingProjects;
