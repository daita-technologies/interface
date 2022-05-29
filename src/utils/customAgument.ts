import { AugmentCustomMethodParamValue } from "reduxes/customAugmentation/type";

export const getMatchIndexOfSaveParamByMethod = (
  paramName: string,
  localParamValue?: AugmentCustomMethodParamValue
) =>
  localParamValue
    ? localParamValue.params.findIndex(
        (saveParamObject) => saveParamObject.paramName === paramName
      )
    : -1;

export const emptyFunc = () => null;
