import { Box, CircularProgress, Typography } from "@mui/material";
import HideImageIcon from "@mui/icons-material/HideImage";
import {
  AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE,
  AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE,
} from "constants/customMethod";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";
import { changeIsLoadingAugmentCustomMethodPreviewImage } from "reduxes/customAugmentation/action";
import {
  selectorAugmentCustomMethodPreviewImageInfo,
  selectorIsLoadingAugmentCustomMethodPreviewImage,
} from "reduxes/customAugmentation/selector";
import { PreviewImageProps } from "./type";

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
        dispatch(
          changeIsLoadingAugmentCustomMethodPreviewImage({ isLoading: false })
        );
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

  if (augmentCustomMethodPreviewImageInfo) {
    const renderImage = () => {
      if (localSpecificSavedAugmentCustomMethodParamValue) {
        const imageSrc = getImageBaseOnSelectedParams();
        return (
          <Box
            position="relative"
            minWidth={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
            minHeight={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
          >
            <Box
              sx={{
                backgroundColor: "rgba(0,0,0)",
                transition: "color 0.5s",
                opacity: isLoadingAugmentCustomMethodPreviewImage ? 0.5 : 0,
              }}
              position="absolute"
              height="100%"
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress size={24} />
            </Box>
            {imageSrc ? (
              <img
                style={{ objectFit: "contain" }}
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
                minWidth={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
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
          minWidth={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
          minHeight={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body1" fontStyle="italic" color="text.secondary">
            Make change to view result image
          </Typography>
        </Box>
      );
    };
    return (
      <Box
        minWidth={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
        minHeight={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
      >
        {renderImage()}
      </Box>
    );
  }

  return null;
};

export default PreviewImage;
