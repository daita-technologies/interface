import {
  AugmentCustomMethodParamValue,
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
