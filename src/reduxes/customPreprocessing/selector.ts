import { RootState } from "reduxes";

export const selectorReferencePreprocessImage = (state: RootState) =>
  state.customPreprocessing.referencePreprocessImage;
export const selectorIsPreprocessingExpertMode = (state: RootState) =>
  state.customPreprocessing.isPreprocessingExpertMode;
export const selectorImagesPreprocessingExpertMode = (state: RootState) =>
  state.customPreprocessing.images;
export const selectorReferenceSeletectorDialog = (state: RootState) =>
  state.customPreprocessing.referenceSeletectorDialog;
