export interface SamplePreviewImageElementProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  isShowResolution?: boolean;
}

export type ImageSizeType = {
  width: number;
  height: number;
};
