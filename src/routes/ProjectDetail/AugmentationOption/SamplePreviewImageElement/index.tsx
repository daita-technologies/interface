import { Box, Typography } from "@mui/material";
import {
  AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE,
  AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE,
  ORIGINAL_IMAGE_AUGMENT_CUSTOM_METHOD_LOCAL_PATH,
} from "constants/customMethod";
import { useMemo, useRef, useState } from "react";
import { ImageSizeType, SamplePreviewImageElementProps } from "./type";

const SamplePreviewImageElement = function ({
  isShowResolution,
  alt,
  onLoad,
  selectedSupperResolutionParamValue,
  isOriginalSampleImage,
  ...otherProps
}: SamplePreviewImageElementProps) {
  const originalImageRef = useRef<HTMLImageElement>(null);
  const [originalImageSizeInfo, setOriginalImageSizeInfo] =
    useState<ImageSizeType>();

  const handleOnImageLoaded = (
    image: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (onLoad) {
      onLoad(image);
    }
  };

  const handleOnloadOriginalImageSize = () => {
    if (originalImageRef && originalImageRef.current) {
      setOriginalImageSizeInfo({
        width: originalImageRef.current.naturalWidth,
        height: originalImageRef.current.naturalHeight,
      });
    }
  };

  const displayImageSizeInfo = useMemo(() => {
    if (originalImageSizeInfo) {
      if (isOriginalSampleImage || !selectedSupperResolutionParamValue) {
        return originalImageSizeInfo;
      }

      const { params } = selectedSupperResolutionParamValue;

      if (params) {
        return {
          width: Math.floor(
            originalImageSizeInfo.width * Number(params[0].paramValue)
          ),
          height: Math.floor(
            originalImageSizeInfo.height * Number(params[0].paramValue)
          ),
        };
      }

      return undefined;
    }
    return undefined;
  }, [
    isOriginalSampleImage,
    selectedSupperResolutionParamValue,
    originalImageSizeInfo,
  ]);

  return (
    <Box>
      <Box
        width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
        height={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
      >
        <img
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
          alt={alt}
          {...otherProps}
          onLoad={handleOnImageLoaded}
        />
        <img
          ref={originalImageRef}
          src={ORIGINAL_IMAGE_AUGMENT_CUSTOM_METHOD_LOCAL_PATH}
          style={{ display: "none" }}
          alt="hidden original"
          onLoad={handleOnloadOriginalImageSize}
        />
      </Box>
      {isShowResolution && (
        <Box>
          <Typography textAlign="center" mt={2} fontSize={14}>
            W x H: {displayImageSizeInfo?.width || "-"} x{" "}
            {displayImageSizeInfo?.height || "-"} (pixels)
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SamplePreviewImageElement;
