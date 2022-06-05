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

export const RANDOM_SCALE_ID = "AUG-001";
export const RANDOM_TRANSLATE_ID = "AUG-002";
export const HORIZONTAL_FLIP_ID = "AUG-003";
export const VERTICAL_FLIP_ID = "AUG-004";
export const RANDOM_CROP_ID = "AUG-005";
export const RANDOM_TILE_ID = "AUG-006";
export const RANDOM_ERASE_ID = "AUG-007";
export const RANDOM_GAUSSIAN_NOISE_ID = "AUG-008";
export const RANDOM_GAUSSIAN_BLUR_ID = "AUG-009";
export const RANDOM_SHARPNESS_ID = "AUG-010";
export const RANDOM_BRIGHTNESS_ID = "AUG-011";
export const RANDOM_HUE_ID = "AUG-012";
export const RANDOM_SATURATION_ID = "AUG-013";
export const RANDOM_CONTRAST_ID = "AUG-014";
export const RANDOM_SOLARIZE_ID = "AUG-015";
export const RANDOM_POSTERIZE_ID = "AUG-016";
export const SUPER_RESOLUTION_ID = "AUG-017";

export const RANDOM_ERASE = "RANDOM_ERASE";
export const RANDOM_SATURATION = "RANDOM_SATURATION";
export const RANDOM_ROTATE = "RANDOM_ROTATE";
export const SUPER_RESOLUTION = "SUPER_RESOLUTION";
export const VERTICAL_FLIP = "VERTICAL_FLIP";
export const RANDOM_GAUSSIAN_NOISE = "RANDOM_GAUSSIAN_NOISE";
export const RANDOM_SHARPNESS = "RANDOM_SHARPNESS";
export const RANDOM_SOLARIZE = "RANDOM_SOLARIZE";
export const HORIZONTAL_FLIP = "HORIZONTAL_FLIP";
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
  | typeof VERTICAL_FLIP
  | typeof RANDOM_GAUSSIAN_NOISE
  | typeof RANDOM_SHARPNESS
  | typeof RANDOM_SOLARIZE
  | typeof HORIZONTAL_FLIP
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
  RANDOM_SCALE_ID: { method: RANDOM_SCALE },
  RANDOM_TRANSLATE_ID: { method: RANDOM_TRANSLATE },
  HORIZONTAL_FLIP_ID: { method: HORIZONTAL_FLIP },
  VERTICAL_FLIP_ID: { method: VERTICAL_FLIP },
  RANDOM_CROP_ID: { method: RANDOM_CROP },
  RANDOM_TILE_ID: { method: RANDOM_TILE },
  RANDOM_ERASE_ID: { method: RANDOM_ERASE },
  RANDOM_GAUSSIAN_NOISE_ID: { method: RANDOM_GAUSSIAN_NOISE },
  RANDOM_GAUSSIAN_BLUR_ID: { method: RANDOM_GAUSSIAN_BLUR },
  RANDOM_SHARPNESS_ID: { method: RANDOM_SHARPNESS },
  RANDOM_BRIGHTNESS_ID: { method: RANDOM_BRIGHTNESS },
  RANDOM_HUE_ID: { method: RANDOM_HUE },
  RANDOM_SATURATION_ID: { method: RANDOM_SATURATION },
  RANDOM_CONTRAST_ID: { method: RANDOM_CONTRAST },
  RANDOM_SOLARIZE_ID: { method: RANDOM_SOLARIZE },
  RANDOM_POSTERIZE_ID: { method: RANDOM_POSTERIZE },
  SUPER_RESOLUTION_ID: { method: SUPER_RESOLUTION },
};
