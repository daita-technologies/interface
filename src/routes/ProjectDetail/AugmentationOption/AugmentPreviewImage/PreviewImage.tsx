import { Box } from "@mui/material";
import {
  AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE,
  ORIGINAL_IMAGE_AUGMENT_CUSTOM_METHOD_LOCAL_PATH,
} from "constants/customMethod";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "reduxes";
import {
  selectorAugmentCustomMethodPreviewImageInfo,
  selectorSavedAugmentCustomMethodParamValue,
} from "reduxes/customAugmentation/selector";
import { PreviewImageProps } from "./type";

const PreviewImage = function ({ methodId }: PreviewImageProps) {
  const savedAugmentCustomMethodParamValue = useSelector((state: RootState) =>
    selectorSavedAugmentCustomMethodParamValue(methodId || "", state)
  );
  const augmentCustomMethodPreviewImageInfo = useSelector((state: RootState) =>
    selectorAugmentCustomMethodPreviewImageInfo(methodId || "", state)
  );

  if (augmentCustomMethodPreviewImageInfo) {
    const renderImage = () => {
      if (savedAugmentCustomMethodParamValue) {
        const { params: selectedParams } = savedAugmentCustomMethodParamValue;

        const { ls_params_value, dict_aug_img, ls_params_name } =
          augmentCustomMethodPreviewImageInfo;

        const getImageBaseOnSelectedParams = useCallback(() => {
          let targetDictIndex = "";
          ls_params_name.forEach((paramNameOrdered) => {
            const selectedParamIndex = selectedParams.findIndex(
              (selectedParamObj) =>
                selectedParamObj.paramName === paramNameOrdered
            );
            const currentParamMappingIndex = ls_params_value[
              selectedParams[selectedParamIndex].paramName
            ].indexOf(selectedParams[selectedParamIndex].paramValue);
            if (currentParamMappingIndex > -1) {
              targetDictIndex += `${currentParamMappingIndex}|`;
            }
          });
          targetDictIndex = targetDictIndex.slice(0, -1);
          return dict_aug_img[targetDictIndex];
        }, [selectedParams, ls_params_value, dict_aug_img, ls_params_name]);

        return (
          <img
            width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
            src={getImageBaseOnSelectedParams()}
            alt="augment method preview"
          />
        );
      }
      return (
        <img
          width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
          src={ORIGINAL_IMAGE_AUGMENT_CUSTOM_METHOD_LOCAL_PATH}
          alt=""
        />
      );
    };
    return <Box>{renderImage()}</Box>;
  }

  return null;
};

export default PreviewImage;
