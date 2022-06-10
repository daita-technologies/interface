import { AugmentCustomMethodParamValue } from "reduxes/customAugmentation/type";

export interface SamplePreviewImageElementProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  isShowResolution?: boolean;
  selectedSupperResolutionParamValue?: AugmentCustomMethodParamValue;
  isOriginalSampleImage: boolean;
}

export type ImageSizeType = {
  width: number;
  height: number;
};
