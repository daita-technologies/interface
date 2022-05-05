export interface ImageProcessingProp {
  src: string;
}

export interface ImageProcessingTemplateSetting {
  min: number;
  max: number;
  settingValueFormater: (value: number) => string;
}
export interface ImageProcessingTemplateProp {
  method: AugmentationMethod;
  filter: (value: number) => string;
  setting: ImageProcessingTemplateSetting;
}
export const HIGH_RESOLUTION = "High Resolution";
export const NORMALIZE_HUE = "Normalize Hue";
export const AUTO_ORIENTATION = "Auto Orientation";
export const NORMALIZE_CONTRAST = "Contrast";
export const NORMALIZE_SATURATION = "Normalize Saturation";
export const EQUALIZE_HISTOGRAM = "Equalize Histogram";
export const NORMALIZE_SHARPNESS = "Normalize Sharpness";
export const NORMALIZE_BRIGHTNESS = "Normalize Brightness";

export type PreprocessingMethod =
  | typeof HIGH_RESOLUTION
  | typeof NORMALIZE_HUE
  | typeof AUTO_ORIENTATION
  | typeof NORMALIZE_CONTRAST
  | typeof NORMALIZE_SATURATION
  | typeof EQUALIZE_HISTOGRAM
  | typeof NORMALIZE_SHARPNESS
  | typeof NORMALIZE_BRIGHTNESS;

export const ERASE = "Erase";
export const SUPPER_RESOLUTION = "Super Resolution";
export const SHARPNESS = "Sharpness";
export const BRIGHTNESS = "Brightness";
export const POSTERIZE = "Posterize";
export const CROP = "Crop";
export const SATURATION = "Saturation";
export const VERTICAL_FLIP = "Vertical Flip";
export const SOLARIZE = "Solarize";
export const HUE = "Hue";
export const SCALE = "Scale";
export const CONTRAST = "Contrast";
export const ROTATE = "Rotate";
export const GAUSSIAN_NOISE = "Gaussian Noise";
export const HORIZONTAL_FLIP = "Horizontal Flip";
export const TRANSLATE = "Translate";
export const GAUSSIAN_BLUR = "Gaussian Blur";
export const TITLE = "Tile";

export type AugmentationMethod =
  | typeof ERASE
  | typeof SUPPER_RESOLUTION
  | typeof SHARPNESS
  | typeof BRIGHTNESS
  | typeof POSTERIZE
  | typeof CROP
  | typeof SATURATION
  | typeof VERTICAL_FLIP
  | typeof SOLARIZE
  | typeof HUE
  | typeof SCALE
  | typeof CONTRAST
  | typeof ROTATE
  | typeof GAUSSIAN_NOISE
  | typeof HORIZONTAL_FLIP
  | typeof TRANSLATE
  | typeof GAUSSIAN_BLUR
  | typeof TITLE;
