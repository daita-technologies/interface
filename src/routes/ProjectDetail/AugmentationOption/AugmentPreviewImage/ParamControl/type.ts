import { SliderProps } from "@mui/material";
// import { AugmentCustomMethodParamValue } from "reduxes/customAugmentation/type";

export interface SliderControlProps extends SliderProps {
  // localSpecificSavedAugmentCustomMethodParamValue?: AugmentCustomMethodParamValue;
  // setLocalSpecificSavedAugmentCustomMethodParamValue: (
  //   value: AugmentCustomMethodParamValue
  // ) => void;
  paramName: string;
  methodId: string;
  min: number;
  max: number;

  step: number;
  forceValue?: number;
  onChangeSlider: (newParamValue: number) => void;
}
