import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import {
  BOOLEAN_AUGMENT_CUSTOM_METHOD_PARAM_TYPE,
  NUMBER_AUGMENT_CUSTOM_METHOD_PARAM_TYPE,
} from "constants/customMethod";
import { debounce } from "lodash";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";
import { selectorAugmentCustomMethodPreviewImageInfo } from "reduxes/customAugmentation/selector";
import { changeIsLoadingAugmentCustomMethodPreviewImage } from "reduxes/customAugmentation/action";

import {
  getDefaultParamValueForCustomMethodAugment,
  getMatchIndexOfSaveParamByMethod,
  mergeParamValueForCustomMethodAugment,
} from "utils/customAugment";
import SliderControl from "./SliderControl";
import { ParamControlProps } from "../type";

const ParamControl = function ({
  methodId,
  paramName,
  localSpecificSavedAugmentCustomMethodParamValue,
  setLocalSpecificSavedAugmentCustomMethodParamValue,
}: ParamControlProps) {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const augmentCustomMethodPreviewImageInfo = useSelector((state: RootState) =>
    selectorAugmentCustomMethodPreviewImageInfo(methodId || "", state)
  );

  useEffect(() => {
    // NOTE: set default value for boolean param
    if (localSpecificSavedAugmentCustomMethodParamValue) {
      if (augmentCustomMethodPreviewImageInfo) {
        const { ls_param_info } = augmentCustomMethodPreviewImageInfo;

        const { type } = ls_param_info[paramName];
        if (type === BOOLEAN_AUGMENT_CUSTOM_METHOD_PARAM_TYPE) {
          const matchIndexOfSaveParamByMethod =
            getMatchIndexOfSaveParamByMethod(
              paramName,
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
    dispatch(
      changeIsLoadingAugmentCustomMethodPreviewImage({ isLoading: true })
    );
    if (augmentCustomMethodPreviewImageInfo) {
      setLocalSpecificSavedAugmentCustomMethodParamValue({
        methodId,
        params: mergeParamValueForCustomMethodAugment(
          [
            {
              paramName,
              paramValue: !isChecked,
            },
          ],
          getDefaultParamValueForCustomMethodAugment(
            augmentCustomMethodPreviewImageInfo
          )
        ),
      });
    }
  };

  const onChangeSlider = (newParamValue: number) => {
    if (augmentCustomMethodPreviewImageInfo) {
      dispatch(
        changeIsLoadingAugmentCustomMethodPreviewImage({ isLoading: true })
      );
      const defaultParamValue = getDefaultParamValueForCustomMethodAugment(
        augmentCustomMethodPreviewImageInfo
      );
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
          params: mergeParamValueForCustomMethodAugment(
            cloneSelectedMethodParams,
            defaultParamValue
          ),
        });
      } else {
        setLocalSpecificSavedAugmentCustomMethodParamValue({
          methodId,
          params: mergeParamValueForCustomMethodAugment(
            [
              {
                paramName,
                paramValue: newParamValue,
              },
            ],
            defaultParamValue
          ),
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
          paramName,
          localSpecificSavedAugmentCustomMethodParamValue
        );

        switch (type) {
          case NUMBER_AUGMENT_CUSTOM_METHOD_PARAM_TYPE: {
            const forceValueArray = valueArray as number[];
            return (
              <SliderControl
                forceValue={
                  localSpecificSavedAugmentCustomMethodParamValue &&
                  matchIndexOfSaveParamByMethod > -1
                    ? (localSpecificSavedAugmentCustomMethodParamValue.params[
                        matchIndexOfSaveParamByMethod
                      ].paramValue as number)
                    : undefined
                }
                methodId={methodId}
                paramName={paramName}
                onChangeSlider={onChangeSlider}
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
