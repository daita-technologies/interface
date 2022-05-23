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
  selectorSavedAugmentCustomMethodParamValue,
} from "reduxes/customAugmentation/selector";

import { ParamControlProps } from "./type";

const ParamControl = function ({ methodId, paramName }: ParamControlProps) {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const augmentCustomMethodPreviewImageInfo = useSelector((state: RootState) =>
    selectorAugmentCustomMethodPreviewImageInfo(methodId || "", state)
  );
  const savedAugmentCustomMethodParamValue = useSelector((state: RootState) =>
    selectorSavedAugmentCustomMethodParamValue(methodId || "", state)
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
        const matchIndexOfSaveParamByMethod = savedAugmentCustomMethodParamValue
          ? savedAugmentCustomMethodParamValue.params.findIndex(
              (saveParamObject) => saveParamObject.paramName === paramName
            )
          : -1;

        switch (type) {
          case NUMBER_AUGMENT_CUSTOM_METHOD_PARAM_TYPE: {
            const forceValueArray = valueArray as number[];
            return (
              <Slider
                defaultValue={
                  savedAugmentCustomMethodParamValue &&
                  matchIndexOfSaveParamByMethod > -1
                    ? (savedAugmentCustomMethodParamValue.params[
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
                      savedAugmentCustomMethodParamValue &&
                      matchIndexOfSaveParamByMethod > -1
                        ? (savedAugmentCustomMethodParamValue.params[
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
