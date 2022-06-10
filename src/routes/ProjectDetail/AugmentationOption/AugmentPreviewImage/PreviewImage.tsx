import { Box, CircularProgress, Typography } from "@mui/material";
import HideImageIcon from "@mui/icons-material/HideImage";
import {
  AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE,
  AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE,
  ORIGINAL_IMAGE_AUGMENT_CUSTOM_METHOD_LOCAL_PATH,
} from "constants/customMethod";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";
import { changeIsLoadingAugmentCustomMethodPreviewImage } from "reduxes/customAugmentation/action";
import { SUPER_RESOLUTION_ID } from "components/ImageProcessing/type";
import {
  selectorAugmentCustomMethodPreviewImageInfo,
  selectorIsLoadingAugmentCustomMethodPreviewImage,
} from "reduxes/customAugmentation/selector";
import { PreviewImageProps } from "./type";
import SamplePreviewImageElement from "../SamplePreviewImageElement";

const PreviewImage = function ({
  methodId,
  localSpecificSavedAugmentCustomMethodParamValue,
  setLocalSpecificSavedAugmentCustomMethodParamValue,
}: PreviewImageProps) {
  const dispatch = useDispatch();

  const augmentCustomMethodPreviewImageInfo = useSelector((state: RootState) =>
    selectorAugmentCustomMethodPreviewImageInfo(methodId || "", state)
  );

  useEffect(() => {
    dispatch(
      changeIsLoadingAugmentCustomMethodPreviewImage({ isLoading: true })
    );
  }, []);

  const isLoadingAugmentCustomMethodPreviewImage = useSelector(
    selectorIsLoadingAugmentCustomMethodPreviewImage
  );

  const getImageBaseOnSelectedParams = useCallback(() => {
    let targetDictIndex = "";
    if (
      augmentCustomMethodPreviewImageInfo &&
      localSpecificSavedAugmentCustomMethodParamValue
    ) {
      const { params: selectedParams } =
        localSpecificSavedAugmentCustomMethodParamValue;
      const { ls_params_value, dict_aug_img, ls_params_name } =
        augmentCustomMethodPreviewImageInfo;
      ls_params_name.forEach((paramNameOrdered) => {
        const selectedParamIndex = selectedParams.findIndex(
          (selectedParamObj) => selectedParamObj.paramName === paramNameOrdered
        );

        if (selectedParamIndex > -1) {
          const listParamsValueTemplate: number[] | boolean[] =
            ls_params_value[selectedParams[selectedParamIndex].paramName];
          const currentParamMappingIndex = listParamsValueTemplate.findIndex(
            (templateValue: number | boolean) =>
              templateValue === selectedParams[selectedParamIndex].paramValue
          );
          if (currentParamMappingIndex > -1) {
            targetDictIndex += `${currentParamMappingIndex}|`;
          }
        }
      });
      if (targetDictIndex) {
        targetDictIndex = targetDictIndex.slice(0, -1);
        const resultImage = dict_aug_img[targetDictIndex];

        if (resultImage) {
          return resultImage;
        }

        return "";
      }
      return "";
    }
    return "";
  }, [
    localSpecificSavedAugmentCustomMethodParamValue,
    augmentCustomMethodPreviewImageInfo,
    setLocalSpecificSavedAugmentCustomMethodParamValue,
  ]);

  const imageSrc = useMemo(
    () => getImageBaseOnSelectedParams(),
    [
      localSpecificSavedAugmentCustomMethodParamValue,
      augmentCustomMethodPreviewImageInfo,
      setLocalSpecificSavedAugmentCustomMethodParamValue,
    ]
  );

  useEffect(() => {
    dispatch(
      changeIsLoadingAugmentCustomMethodPreviewImage({ isLoading: true })
    );
  }, [imageSrc]);

  if (augmentCustomMethodPreviewImageInfo) {
    const renderImage = () => {
      if (localSpecificSavedAugmentCustomMethodParamValue) {
        return (
          <Box
            position="relative"
            width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
            minHeight={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
          >
            <Box
              sx={{
                backgroundColor: "rgba(0,0,0)",
                transition: "color 0.5s",
                opacity: isLoadingAugmentCustomMethodPreviewImage ? 0.5 : 0,
              }}
              position="absolute"
              width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
              minHeight={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress size={24} />
            </Box>
            {imageSrc ? (
              <SamplePreviewImageElement
                isShowResolution={methodId === SUPER_RESOLUTION_ID}
                isOriginalSampleImage={false}
                selectedSupperResolutionParamValue={
                  localSpecificSavedAugmentCustomMethodParamValue
                }
                width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
                src={imageSrc}
                onLoad={() => {
                  dispatch(
                    changeIsLoadingAugmentCustomMethodPreviewImage({
                      isLoading: false,
                    })
                  );
                }}
                alt="augment method preview"
              />
            ) : (
              <Box
                width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
                minHeight={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <HideImageIcon
                  sx={{ color: "text.secondary", mb: 1 }}
                  fontSize="large"
                />
                <Typography fontStyle="italic" color="text.secondary">
                  Not found image
                </Typography>
              </Box>
            )}
          </Box>
        );
      }

      return (
        <Box
          width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
          minHeight={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <SamplePreviewImageElement
            isShowResolution={methodId === SUPER_RESOLUTION_ID}
            isOriginalSampleImage
            width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
            height={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
            src={ORIGINAL_IMAGE_AUGMENT_CUSTOM_METHOD_LOCAL_PATH}
            onLoad={() => {
              dispatch(
                changeIsLoadingAugmentCustomMethodPreviewImage({
                  isLoading: false,
                })
              );
            }}
            alt="augment method preview"
          />
        </Box>
      );
    };
    return (
      <Box
        width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
        minHeight={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
      >
        {renderImage()}
      </Box>
    );
  }

  return null;
};

export default PreviewImage;
