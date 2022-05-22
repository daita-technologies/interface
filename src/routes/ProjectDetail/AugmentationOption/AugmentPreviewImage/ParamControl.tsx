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
import { selectorAugmentCustomMethodPreviewImageInfo } from "reduxes/customAugmentation/selector";

import { ParamControlProps } from "./type";

const ParamControl = function ({ methodId, paramName }: ParamControlProps) {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const augmentCustomMethodPreviewImageInfo = useSelector((state: RootState) =>
    selectorAugmentCustomMethodPreviewImageInfo(methodId || "", state)
  );

  const onClickChangeSwitch = () => {
    setIsChecked(!isChecked);
  };

  const onChangeSlider = (event: Event, newParamValue: number | number[]) => {
    if (typeof newParamValue !== "object") {
      debounce(
        () =>
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
          ),
        1500
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
        switch (type) {
          case NUMBER_AUGMENT_CUSTOM_METHOD_PARAM_TYPE: {
            const forceValueArray = valueArray as number[];
            return (
              <Slider
                // defaultValue={valueArray[0]}
                onChange={onChangeSlider}
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
                  <Switch checked={isChecked} onChange={onClickChangeSwitch} />
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
