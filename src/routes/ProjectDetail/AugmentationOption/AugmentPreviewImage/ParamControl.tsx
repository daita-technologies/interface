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
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "reduxes";
import { selectorAugmentCustomMethodPreviewImageInfo } from "reduxes/customAugmentation/selector";
import { AugmentCustomMethodParamValue } from "reduxes/customAugmentation/type";

import { ParamControlProps } from "./type";

const ParamControl = function ({
  methodId,
  paramName,
  localSpecificSavedAugmentCustomMethodParamValue,
  setLocalSpecificSavedAugmentCustomMethodParamValue,
}: ParamControlProps) {
  const [isChecked, setIsChecked] = useState(false);
  const augmentCustomMethodPreviewImageInfo = useSelector((state: RootState) =>
    selectorAugmentCustomMethodPreviewImageInfo(methodId || "", state)
  );

  const getMatchIndexOfSaveParamByMethod = (
    locaParamValue?: AugmentCustomMethodParamValue
  ) =>
    locaParamValue
      ? locaParamValue.params.findIndex(
          (saveParamObject) => saveParamObject.paramName === paramName
        )
      : -1;

  useEffect(() => {
    // NOTE: set default value for boolean param
    if (localSpecificSavedAugmentCustomMethodParamValue) {
      if (augmentCustomMethodPreviewImageInfo) {
        const { ls_param_info } = augmentCustomMethodPreviewImageInfo;

        const { type } = ls_param_info[paramName];
        if (type === BOOLEAN_AUGMENT_CUSTOM_METHOD_PARAM_TYPE) {
          const matchIndexOfSaveParamByMethod =
            getMatchIndexOfSaveParamByMethod(
              localSpecificSavedAugmentCustomMethodParamValue
            );
          if (matchIndexOfSaveParamByMethod > -1) {
            setIsChecked(
              localSpecificSavedAugmentCustomMethodParamValue.params[
                matchIndexOfSaveParamByMethod
              ].paramValue as boolean
            );
          }
        }
      }
    }
  }, [localSpecificSavedAugmentCustomMethodParamValue]);

  const onClickChangeSwitch = () => {
    setIsChecked(!isChecked);
    setLocalSpecificSavedAugmentCustomMethodParamValue({
      methodId,
      params: [
        {
          paramName,
          paramValue: !isChecked,
        },
      ],
    });
  };

  const onChangeSlider = (event: Event, newParamValue: number | number[]) => {
    if (typeof newParamValue !== "object") {
      if (localSpecificSavedAugmentCustomMethodParamValue) {
        const cloneSelectedMethodParams = [
          ...localSpecificSavedAugmentCustomMethodParamValue.params,
        ];

        const indexOfExistParam = cloneSelectedMethodParams.findIndex(
          (inspectingParam) => inspectingParam.paramName === paramName
        );
        if (indexOfExistParam > -1) {
          cloneSelectedMethodParams[indexOfExistParam].paramValue =
            newParamValue;
        } else {
          cloneSelectedMethodParams.push({
            paramName,
            paramValue: newParamValue,
          });
        }

        setLocalSpecificSavedAugmentCustomMethodParamValue({
          methodId,
          params: cloneSelectedMethodParams,
        });
      } else {
        setLocalSpecificSavedAugmentCustomMethodParamValue({
          methodId,
          params: [
            {
              paramName,
              paramValue: newParamValue,
            },
          ],
        });
      }
    }
  };

  if (augmentCustomMethodPreviewImageInfo) {
    const { ls_param_info, ls_params_value } =
      augmentCustomMethodPreviewImageInfo;

    const { type, step } = ls_param_info[paramName];

    const valueArray = ls_params_value[paramName];

    if (valueArray.length > 0) {
      const renderControl = () => {
        const matchIndexOfSaveParamByMethod = getMatchIndexOfSaveParamByMethod(
          localSpecificSavedAugmentCustomMethodParamValue
        );

        switch (type) {
          case NUMBER_AUGMENT_CUSTOM_METHOD_PARAM_TYPE: {
            const forceValueArray = valueArray as number[];
            return (
              <Slider
                defaultValue={
                  localSpecificSavedAugmentCustomMethodParamValue &&
                  matchIndexOfSaveParamByMethod > -1
                    ? (localSpecificSavedAugmentCustomMethodParamValue.params[
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
