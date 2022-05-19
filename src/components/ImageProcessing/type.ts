export interface ImageProcessingProp {
  src: string;
}

export interface ImageProcessingTemplateSetting {
  min: number;
  max: number;
  settingValueFormater: (value: number) => string;
}
export interface ImageProcessingTemplateProp {
  filter: (value: number) => string;
  setting?: ImageProcessingTemplateSetting;
}

export interface ImageProcessingSourceProps {
  methodId: string;
  src: string;
}
export interface AugmentationMethodInfo {
  method: AugmentationMethod;
}
export const RANDOM_ERASE = "RANDOM_ERASE";
export const RANDOM_SATURATION = "RANDOM_SATURATION";
export const RANDOM_ROTATE = "RANDOM_ROTATE";
export const SUPER_RESOLUTION = "SUPER_RESOLUTION";
export const RANDOM_VERTICAL_FLIP = "RANDOM_VERTICAL_FLIP";
export const RANDOM_GAUSSIAN_NOISE = "RANDOM_GAUSSIAN_NOISE";
export const RANDOM_SHARPNESS = "RANDOM_SHARPNESS";
export const RANDOM_SOLARIZE = "RANDOM_SOLARIZE";
export const RANDOM_HORIZONTAL_FLIP = "RANDOM_HORIZONTAL_FLIP";
export const RANDOM_BRIGHTNESS = "RANDOM_BRIGHTNESS";
export const RANDOM_HUE = "RANDOM_HUE";
export const RANDOM_TRANSLATE = "RANDOM_TRANSLATE";
export const RANDOM_POSTERIZE = "RANDOM_POSTERIZE";
export const RANDOM_SCALE = "RANDOM_SCALE";
export const RANDOM_GAUSSIAN_BLUR = "RANDOM_GAUSSIAN_BLUR";
export const RANDOM_CROP = "RANDOM_CROP";
export const RANDOM_CONTRAST = "RANDOM_CONTRAST";
export const RANDOM_TILE = "RANDOM_TILE";

export type AugmentationMethod =
  | typeof RANDOM_ERASE
  | typeof RANDOM_SATURATION
  | typeof RANDOM_ROTATE
  | typeof SUPER_RESOLUTION
  | typeof RANDOM_VERTICAL_FLIP
  | typeof RANDOM_GAUSSIAN_NOISE
  | typeof RANDOM_SHARPNESS
  | typeof RANDOM_SOLARIZE
  | typeof RANDOM_HORIZONTAL_FLIP
  | typeof RANDOM_BRIGHTNESS
  | typeof RANDOM_HUE
  | typeof RANDOM_TRANSLATE
  | typeof RANDOM_POSTERIZE
  | typeof RANDOM_SCALE
  | typeof RANDOM_GAUSSIAN_BLUR
  | typeof RANDOM_CROP
  | typeof RANDOM_CONTRAST
  | typeof RANDOM_TILE;

export const METHODID_AUGMENTMETHOD: Record<string, AugmentationMethodInfo> = {
  "AUG-001": { method: RANDOM_SCALE },
  "AUG-002": { method: RANDOM_TRANSLATE },
  "AUG-003": { method: RANDOM_HORIZONTAL_FLIP },
  "AUG-004": { method: RANDOM_VERTICAL_FLIP },
  "AUG-005": { method: RANDOM_CROP },
  "AUG-006": { method: RANDOM_TILE },
  "AUG-007": { method: RANDOM_ERASE },
  "AUG-008": { method: RANDOM_GAUSSIAN_NOISE },
  "AUG-009": { method: RANDOM_GAUSSIAN_BLUR },
  "AUG-010": { method: RANDOM_SHARPNESS },
  "AUG-011": { method: RANDOM_BRIGHTNESS },
  "AUG-012": { method: RANDOM_HUE },
  "AUG-013": { method: RANDOM_SATURATION },
  "AUG-014": { method: RANDOM_CONTRAST },
  "AUG-015": { method: RANDOM_SOLARIZE },
  "AUG-016": { method: RANDOM_POSTERIZE },
  "AUG-017": { method: SUPER_RESOLUTION },
};
