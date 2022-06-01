import { Slider } from "@mui/material";
import { NUMBER_AUGMENT_CUSTOM_METHOD_PARAM_TYPE } from "constants/customMethod";
import { debounce } from "lodash";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "reduxes";
import {
  selectorAugmentCustomMethodPreviewImageInfo,
  selectorAugmentCustomMethodDialog,
} from "reduxes/customAugmentation/selector";
import { SliderControlProps } from "./type";

const SliderControl = function ({
  forceValue,
  methodId,
  paramName,
  onChangeSlider,
  min,
  max,
  step,
}: SliderControlProps) {
  const [value, setValue] = useState<number>();
  const augmentCustomMethodPreviewImageInfo = useSelector((state: RootState) =>
    selectorAugmentCustomMethodPreviewImageInfo(methodId || "", state)
  );
  const { isShow } = useSelector(selectorAugmentCustomMethodDialog);

  const callParentOnChange = useCallback(
    (newParamValue: number) => {
      if (onChangeSlider) {
        onChangeSlider(newParamValue);
      }
    },
    [onChangeSlider]
  );

  const debounceOnChangeFunc = useMemo(
    () => debounce(callParentOnChange, 500),
    [callParentOnChange]
  );

  const handleOnChange = (event: Event, newParamValue: number | number[]) => {
    if (typeof newParamValue !== "object") {
      debounceOnChangeFunc(newParamValue);
      setValue(newParamValue);
    }
  };

  useEffect(() => {
    if (!isShow) {
      // NOTE: close custom method on augment dialog so value is reset
      setValue(undefined);
    }
  });

  useEffect(() => {
    // NOTE: set default value for boolean param

    if (forceValue && typeof value === "undefined") {
      if (augmentCustomMethodPreviewImageInfo) {
        const { ls_param_info } = augmentCustomMethodPreviewImageInfo;

        const { type } = ls_param_info[paramName];
        if (type === NUMBER_AUGMENT_CUSTOM_METHOD_PARAM_TYPE) {
          setValue(forceValue);
        }
      }
    }
  }, [forceValue]);

  return (
    <Slider
      value={value || min}
      onChange={handleOnChange}
      valueLabelDisplay="auto"
      step={step}
      marks
      min={min}
      max={max}
    />
  );
};

export default SliderControl;
