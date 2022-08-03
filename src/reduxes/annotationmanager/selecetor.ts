import { RootState } from "reduxes";

export const selectorAnnotationManagerImages = (state: RootState) =>
  state.annotationManagerReducer.images;
export const selectorCurrentPreviewImageName = (state: RootState) =>
  state.annotationManagerReducer.currentPreviewImageName;
export const selectorCurrentAnnotationFile = (state: RootState) => {
  if (state.annotationManagerReducer.currentPreviewImageName) {
    return state.annotationManagerReducer.images[
      state.annotationManagerReducer.currentPreviewImageName
    ];
  }
  return null;
};
export const selectorIdDrawObjectByImageName = (state: RootState) =>
  state.annotationManagerReducer.idDrawObjectByImageName;
