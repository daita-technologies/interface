import {
  AugmentCustomMethodParamValue,
  SavedAugmentCustomMethodParamValueType,
  SelectedParamAugmentCustomMethod,
} from "reduxes/customAugmentation/type";
import { GetAugmentCustomMethodPreviewImageResponse } from "services/customMethodApi";

export const getMatchIndexOfSaveParamByMethod = (
  paramName: string,
  localParamValue?: AugmentCustomMethodParamValue
) =>
  localParamValue
    ? localParamValue.params.findIndex(
        (saveParamObject) => saveParamObject.paramName === paramName
      )
    : -1;

export const getDefaultParamValueForCustomMethodAugment = (
  augmentCustomMethodPreviewImageInfo: GetAugmentCustomMethodPreviewImageResponse
): SelectedParamAugmentCustomMethod[] => {
  if (augmentCustomMethodPreviewImageInfo) {
    const { ls_params_name, ls_params_value } =
      augmentCustomMethodPreviewImageInfo;
    return ls_params_name.map((sampleParamName) => ({
      paramName: sampleParamName,
      paramValue: ls_params_value[sampleParamName][0],
    }));
  }
  return [];
};

export const mergeParamValueForCustomMethodAugment = (
  targetParamValue: SelectedParamAugmentCustomMethod[],
  defaultParamValue: SelectedParamAugmentCustomMethod[]
) =>
  defaultParamValue.map((defaultParamObject) => {
    const { paramName: inspectingParamName } = defaultParamObject;
    const matchIndexOfTargetParamObject = targetParamValue.findIndex(
      (targetParamObject) => inspectingParamName === targetParamObject.paramName
    );
    if (matchIndexOfTargetParamObject > -1) {
      return {
        paramName: inspectingParamName,
        paramValue: targetParamValue[matchIndexOfTargetParamObject].paramValue,
      };
    }
    return defaultParamObject;
  });

export const isSelectedMethodWhenRunExpertAugment = (
  savedAugmentCustomMethodParamValue: SavedAugmentCustomMethodParamValueType
) => {
  if (savedAugmentCustomMethodParamValue) {
    const methodIdList = Object.keys(savedAugmentCustomMethodParamValue);
    if (methodIdList && methodIdList.length > 0) {
      return true;
    }

    return false;
  }
  return false;
};

export const isFilledParamWhenRunExpertAugment = (
  savedAugmentCustomMethodParamValue: SavedAugmentCustomMethodParamValueType,
  verifyMethodId?: string
) => {
  if (savedAugmentCustomMethodParamValue) {
    const methodIdList = Object.keys(savedAugmentCustomMethodParamValue);
    if (methodIdList && methodIdList.length > 0) {
      if (!verifyMethodId) {
        // NOTE: check all methods
        return !methodIdList.some(
          (inspectingMethodId: string) =>
            savedAugmentCustomMethodParamValue[inspectingMethodId] === undefined
        );
      }
      return !!savedAugmentCustomMethodParamValue[verifyMethodId];
    }

    return false;
  }

  return false;
};

export const isAbleToRunExpertAugmentation = (
  savedAugmentCustomMethodParamValue: SavedAugmentCustomMethodParamValueType
) =>
  isSelectedMethodWhenRunExpertAugment(savedAugmentCustomMethodParamValue) &&
  isFilledParamWhenRunExpertAugment(savedAugmentCustomMethodParamValue);
