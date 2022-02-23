import { RootState } from "reduxes";

export const selectorIsGeneratingImages = (state: RootState) =>
  state.generateReducer.isGeneratingImages;
export const selectorIsGenerateImagesPreprocessing = (state: RootState) =>
  state.generateReducer.isGenerateImagesPreprocessing;
export const selectorIsGenerateImagesAugmenting = (state: RootState) =>
  state.generateReducer.isGenerateImagesAugmenting;
