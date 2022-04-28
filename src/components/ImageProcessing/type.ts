export interface ImageProcessingProp {
  src: string;
}

export interface ImageProcessingTemplateSetting {
  min: number;
  max: number;
  settingValueFormater: (value: number) => string;
}
export interface ImageProcessingTemplateProp {
  processingMethod: PreprocessingMedthod;
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

export type PreprocessingMedthod =
  | typeof HIGH_RESOLUTION
  | typeof NORMALIZE_HUE
  | typeof AUTO_ORIENTATION
  | typeof NORMALIZE_CONTRAST
  | typeof NORMALIZE_SATURATION
  | typeof EQUALIZE_HISTOGRAM
  | typeof NORMALIZE_SHARPNESS
  | typeof NORMALIZE_BRIGHTNESS;
