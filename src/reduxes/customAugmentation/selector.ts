import { RootState } from "reduxes";

export const selectorReferenceAugmentationImage = (state: RootState) =>
  state.customAugmentation.referenceAugmentationImage;
export const selectorIssAugmentationExpertMode = (state: RootState) =>
  state.customAugmentation.isAugmentationExpertMode;
export const selectorReferenceSeletectorDialog = (state: RootState) =>
  state.customAugmentation.referenceSeletectorDialog;

export const selectorSelectedMethodIds = (state: RootState) =>
  state.customAugmentation.selectedMethodIds;
