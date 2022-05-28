import {
  Box,
  FormControlLabel,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import {
  BOOLEAN_AUGMENT_CUSTOM_METHOD_PARAM_TYPE,
  NUMBER_AUGMENT_CUSTOM_METHOD_PARAM_TYPE,
} from "constants/customMethod";
import { debounce } from "lodash";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";
import { changeAugmentCustomMethodParamValue } from "reduxes/customAugmentation/action";
import {
  selectorAugmentCustomMethodPreviewImageInfo,
  selectorSpecificSavedAugmentCustomMethodParamValue,
} from "reduxes/customAugmentation/selector";

import { ParamControlProps } from "./type";

const ParamControl = function ({ methodId, paramName }: ParamControlProps) {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const augmentCustomMethodPreviewImageInfo = useSelector((state: RootState) =>
    selectorAugmentCustomMethodPreviewImageInfo(methodId || "", state)
  );
  const specificSavedAugmentCustomMethodParamValue = useSelector(
    (state: RootState) =>
      selectorSpecificSavedAugmentCustomMethodParamValue(methodId || "", state)
  );

  const onClickChangeSwitch = () => {
    setIsChecked(!isChecked);

    dispatch(
      changeAugmentCustomMethodParamValue({
        methodId,
        params: [
          {
            paramName,
            paramValue: !isChecked,
          },
        ],
      })
    );
  };

  const onChangeSlider = (event: Event, newParamValue: number | number[]) => {
    if (typeof newParamValue !== "object") {
      dispatch(
        changeAugmentCustomMethodParamValue({
          methodId,
          params: [
            {
              paramName,
              paramValue: newParamValue,
            },
          ],
        })
      );
    }
  };

  if (augmentCustomMethodPreviewImageInfo) {
    const { ls_param_info, ls_params_value } =
      augmentCustomMethodPreviewImageInfo;

    const { type, step } = ls_param_info[paramName];

    const valueArray = ls_params_value[paramName];

    if (valueArray.length > 0) {
      const renderControl = () => {
        const matchIndexOfSaveParamByMethod =
          specificSavedAugmentCustomMethodParamValue
            ? specificSavedAugmentCustomMethodParamValue.params.findIndex(
                (saveParamObject) => saveParamObject.paramName === paramName
              )
            : -1;

        switch (type) {
          case NUMBER_AUGMENT_CUSTOM_METHOD_PARAM_TYPE: {
            const forceValueArray = valueArray as number[];
            return (
              <Slider
                defaultValue={
                  specificSavedAugmentCustomMethodParamValue &&
                  matchIndexOfSaveParamByMethod > -1
                    ? (specificSavedAugmentCustomMethodParamValue.params[
                        matchIndexOfSaveParamByMethod
                      ].paramValue as number)
                    : undefined
                }
                onChange={debounce(onChangeSlider, 500)}
                valueLabelDisplay="auto"
                step={Number(step.toFixed(2)) || 0}
                marks
                min={forceValueArray[0]}
                max={forceValueArray[forceValueArray.length - 1]}
              />
            );
          }
          case BOOLEAN_AUGMENT_CUSTOM_METHOD_PARAM_TYPE:
            return (
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked={
                      specificSavedAugmentCustomMethodParamValue &&
                      matchIndexOfSaveParamByMethod > -1
                        ? (specificSavedAugmentCustomMethodParamValue.params[
                            matchIndexOfSaveParamByMethod
                          ].paramValue as boolean)
                        : undefined
                    }
                    checked={isChecked}
                    onChange={debounce(onClickChangeSwitch, 100)}
                  />
                }
                label="Active?"
              />
            );
          default:
            return null;
        }
      };
      return (
        <Box>
          <Typography textTransform="capitalize">{paramName}</Typography>
          {renderControl()}
        </Box>
      );
    }
    return null;
  }

  return null;
};

export default ParamControl;
