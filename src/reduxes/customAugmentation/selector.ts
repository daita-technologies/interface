import { RootState } from "reduxes";

export const selectorReferenceAugmentationImage = (state: RootState) =>
  state.customAugmentation.referenceAugmentationImage;
export const selectorIssAugmentationExpertMode = (state: RootState) =>
  state.customAugmentation.isAugmentationExpertMode;
export const selectorAugmentCustomMethodDialog = (state: RootState) =>
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

export const selectorSelectedListCustomAugmentMethodId = (
  projectId: string,
  state: RootState
) => {
  if (
    state.customAugmentation.savedAugmentCustomMethodParamValueByProjectId[
      projectId
    ]
  ) {
    return Object.keys(
      state.customAugmentation.savedAugmentCustomMethodParamValueByProjectId[
        projectId
      ]
    );
  }
  return [];
};

export const selectorSpecificSavedAugmentCustomMethodParamValue = (
  projectId: string,
  methodId: string,
  state: RootState
) => {
  if (
    state.customAugmentation.savedAugmentCustomMethodParamValueByProjectId[
      projectId
    ]
  ) {
    return state.customAugmentation
      .savedAugmentCustomMethodParamValueByProjectId[projectId][methodId];
  }
  return undefined;
};

export const selectorSavedAugmentCustomMethodParamValue = (
  projectId: string,
  state: RootState
) =>
  state.customAugmentation.savedAugmentCustomMethodParamValueByProjectId[
    projectId
  ];

export const selectorIsLoadingAugmentCustomMethodPreviewImage = (
  state: RootState
) => state.customAugmentation.isLoadingPreviewImage;

export const selectorIsAbleToRunAgumentationError = (state: RootState) =>
  state.customAugmentation.isAbleToRunAgumentationError;
