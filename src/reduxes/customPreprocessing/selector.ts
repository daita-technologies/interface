import { RootState } from "reduxes";

export const selectorReferencePreprocessImage = (state: RootState) =>
  state.customPreprocessing.referencePreprocessImage;
export const selectorIsPreprocessingExpertMode = (state: RootState) =>
  state.customPreprocessing.isPreprocessingExpertMode;
export const selectorReferenceSeletectorDialog = (state: RootState) =>
  state.customPreprocessing.referenceSeletectorDialog;
export const selectorSelectedMethods = (state: RootState) =>
  state.customPreprocessing.selectedMethods;
export const selectorIsGenerating = (state: RootState) =>
  state.customPreprocessing.isGenerating;
export const selectorIsGenerateReferenceRequesting = (state: RootState) =>
  state.customPreprocessing.isGenerateReferenceRequesting;
