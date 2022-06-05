import { Box, Typography } from "@mui/material";
import {
  AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE,
  AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE,
} from "constants/customMethod";
import { useRef, useState } from "react";
import { ImageSizeType, SamplePreviewImageElementProps } from "./type";

const SamplePreviewImageElement = function ({
  isShowResolution,
  alt,
  onLoad,
  ...otherProps
}: SamplePreviewImageElementProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSizeInfo, setImageSizeInfo] = useState<ImageSizeType>();
  const handleOnImageLoaded = (
    image: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (onLoad) {
      onLoad(image);
    }
    if (imageRef && imageRef.current) {
      setImageSizeInfo({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  };
  return (
    <Box>
      <Box
        width={AUGMENT_CUSTOM_METHOD_IMAGE_WIDTH_SIZE}
        height={AUGMENT_CUSTOM_METHOD_IMAGE_MIN_HEIGHT_SIZE}
      >
        <img
          ref={imageRef}
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
          alt={alt}
          {...otherProps}
          onLoad={handleOnImageLoaded}
        />
      </Box>
      {isShowResolution && (
        <Box>
          {imageSizeInfo && (
            <Typography textAlign="center" mt={2} fontSize={14}>
              W x H: {imageSizeInfo.width} x {imageSizeInfo.height} (pixels)
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SamplePreviewImageElement;
