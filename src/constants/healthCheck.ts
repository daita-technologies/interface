import { HealthCheckFields } from "services/healthCheckApi";

export const FILE_NAME_HEALTH_CHECK_FIELD = {
  value: "file_name" as keyof HealthCheckFields,
  label: "File name",
};
export const STN_GREEN_HEALTH_CHECK_FIELD = {
  value: "signal_to_noise_green_channel" as keyof HealthCheckFields,
  label: "Signal to noise green channel",
};
export const STN_RED_HEALTH_CHECK_FIELD = {
  value: "signal_to_noise_red_channel" as keyof HealthCheckFields,
  label: "Signal to noise red channel",
};
export const STN_BLUE_HEALTH_CHECK_FIELD = {
  value: "signal_to_noise_blue_channel" as keyof HealthCheckFields,
  label: "Signal to noise blue channel",
};
export const SHARPNESS_HEALTH_CHECK_FIELD = {
  value: "sharpness" as keyof HealthCheckFields,
  label: "Sharpness",
};

export const LUMINANCE_HEALTH_CHECK_FIELD = {
  value: "luminance" as keyof HealthCheckFields,
  label: "Luminance",
};
export const WIDTH_HEALTH_CHECK_FIELD = {
  value: "width" as keyof HealthCheckFields,
  label: "Width",
};
export const HEIGHT_HEALTH_CHECK_FIELD = {
  value: "height" as keyof HealthCheckFields,
  label: "Height",
};
export const ASPECT_RATIO_HEALTH_CHECK_FIELD = {
  value: "aspect_ratio" as keyof HealthCheckFields,
  label: "Aspect ratio",
};
export const FILE_SIZE_HEALTH_CHECK_FIELD = {
  value: "file_size" as keyof HealthCheckFields,
  label: "File size",
};
export const EXTENSION_HEALTH_CHECK_FIELD = {
  value: "extension" as keyof HealthCheckFields,
  label: "Extension",
};
export const CONTRAST_HEALTH_CHECK_FIELD = {
  value: "contrast" as keyof HealthCheckFields,
  label: "Contrast",
};
export const MEAN_RED_CHANNEL_HEALTH_CHECK_FIELD = {
  value: "mean_red_channel" as keyof HealthCheckFields,
  label: "Mean red channel",
};
export const MEAN_BLUE_CHANNEL_HEALTH_CHECK_FIELD = {
  value: "mean_blue_channel" as keyof HealthCheckFields,
  label: "Mean blue channel",
};
export const MEAN_GREEN_CHANNEL_HEALTH_CHECK_FIELD = {
  value: "mean_green_channel" as keyof HealthCheckFields,
  label: "Mean green channel",
};

export const HEALTH_CHECK_ATTRIBUTES_ARRAY: {
  label: string;
  value: keyof HealthCheckFields;
}[] = [
  STN_GREEN_HEALTH_CHECK_FIELD,
  STN_RED_HEALTH_CHECK_FIELD,
  STN_BLUE_HEALTH_CHECK_FIELD,
  SHARPNESS_HEALTH_CHECK_FIELD,
  LUMINANCE_HEALTH_CHECK_FIELD,
  WIDTH_HEALTH_CHECK_FIELD,
  HEIGHT_HEALTH_CHECK_FIELD,
  ASPECT_RATIO_HEALTH_CHECK_FIELD,
  FILE_SIZE_HEALTH_CHECK_FIELD,
  EXTENSION_HEALTH_CHECK_FIELD,
  CONTRAST_HEALTH_CHECK_FIELD,
  MEAN_RED_CHANNEL_HEALTH_CHECK_FIELD,
  MEAN_BLUE_CHANNEL_HEALTH_CHECK_FIELD,
  MEAN_GREEN_CHANNEL_HEALTH_CHECK_FIELD,
];