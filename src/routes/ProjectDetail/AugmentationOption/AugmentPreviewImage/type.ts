import { AugmentCustomMethodParamValue } from "reduxes/customAugmentation/type";

export interface ParamControlProps {
  methodId: string;
  paramName: string;
  localSpecificSavedAugmentCustomMethodParamValue?: AugmentCustomMethodParamValue;
  setLocalSpecificSavedAugmentCustomMethodParamValue: (
    value: AugmentCustomMethodParamValue
  ) => void;
}

export interface PreviewImageProps {
  methodId: string;
  // paramName: string;
  localSpecificSavedAugmentCustomMethodParamValue?: AugmentCustomMethodParamValue;
  setLocalSpecificSavedAugmentCustomMethodParamValue: (
    value: AugmentCustomMethodParamValue
  ) => void;
}
