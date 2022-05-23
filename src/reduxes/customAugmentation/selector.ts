import { RootState } from "reduxes";

export const selectorReferenceAugmentationImage = (state: RootState) =>
  state.customAugmentation.referenceAugmentationImage;
export const selectorIssAugmentationExpertMode = (state: RootState) =>
  state.customAugmentation.isAugmentationExpertMode;
export const selectorReferenceSeletectorDialog = (state: RootState) =>
  state.customAugmentation.referenceSeletectorDialog;

export const selectorSelectedMethodIds = (state: RootState) =>
  state.customAugmentation.selectedMethodIds;

export const selectorIsFetchingAugmentCustomMethodPreviewImage = (
  state: RootState
) => state.customAugmentation.isFetchingAugmentCustomMethodPreviewImage;

export const selectorAugmentCustomMethodPreviewImageInfo = (
  methodId: string,
  state: RootState
) =>
  state.customAugmentation.augmentCustomMethodPreviewImageInfo
    ? state.customAugmentation.augmentCustomMethodPreviewImageInfo[methodId]
    : null;

export const selectorSavedAugmentCustomMethodParamValue = (
  methodId: string,
  state: RootState
) => state.customAugmentation.savedAugmentCustomMethodParamValue[methodId];

export const selectorIsLoadingAugmentCustomMethodPreviewImage = (
  state: RootState
) => state.customAugmentation.isLoadingPreviewImage;
