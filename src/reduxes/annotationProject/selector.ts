import { RootState } from "reduxes";

export const selectorAnnotationListProjects = (state: RootState) =>
  state.annotationProjectReducer.listProjects;
export const selectorAnnotationCurrentProjectName = (state: RootState) =>
  state.annotationProjectReducer.currentProjectName;
export const selectorDialogCloneProjectToAnnotation = (state: RootState) =>
  state.annotationProjectReducer.dialogCloneProjectToAnnotation;
export const selectorAnnotationCurrentProject = (state: RootState) =>
  state.annotationProjectReducer.listProjects.find(
    (t) => t.project_name == state.annotationProjectReducer.currentProjectName
  );
