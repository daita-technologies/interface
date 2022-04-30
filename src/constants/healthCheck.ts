import { DataHealthCheckSelectedAttribute } from "routes/HealthCheckPage/HealthCheckMainContent/type";
import { HealthCheckFields } from "services/healthCheckApi";

export const FILE_NAME_HEALTH_CHECK_FIELD = {
  value: "file_name" as keyof HealthCheckFields,
  label: "File name",
  description: "",
  unit: "",
};
export const STN_GREEN_HEALTH_CHECK_FIELD = {
  value: "signal_to_noise_green_channel" as keyof HealthCheckFields,
  label: "Signal to noise green channel",
  description:
    "Measure the signal to noise value of only green channel in RGB image",
  unit: "SNR",
};
export const STN_RED_HEALTH_CHECK_FIELD = {
  value: "signal_to_noise_red_channel" as keyof HealthCheckFields,
  label: "Signal to noise red channel",
  description:
    "Measure the signal to noise value of only red channel in RGB image",
  unit: "SNR",
};
export const STN_BLUE_HEALTH_CHECK_FIELD = {
  value: "signal_to_noise_blue_channel" as keyof HealthCheckFields,
  label: "Signal to noise blue channel",
  description:
    "Measure the signal to noise value of only  blue channel in RGB image",
  unit: "SNR",
};
export const SHARPNESS_HEALTH_CHECK_FIELD = {
  value: "sharpness" as keyof HealthCheckFields,
  label: "Sharpness",
  description: "Measure the sharpness of image",
  unit: "S",
};

export const LUMINANCE_HEALTH_CHECK_FIELD = {
  value: "luminance" as keyof HealthCheckFields,
  label: "Luminance",
  description: "Measure the brightness of image",
  unit: "L",
};
export const WIDTH_HEALTH_CHECK_FIELD = {
  value: "width" as keyof HealthCheckFields,
  label: "Width",
  description: "Width of image",
  unit: "pixels",
};
export const HEIGHT_HEALTH_CHECK_FIELD = {
  value: "height" as keyof HealthCheckFields,
  label: "Height",
  description: "Height of image",
  unit: "pixels",
};
export const ASPECT_RATIO_HEALTH_CHECK_FIELD = {
  value: "aspect_ratio" as keyof HealthCheckFields,
  label: "Aspect ratio",
  description: "Measure the ratio between height and width of image",
  unit: "H/W",
};
export const FILE_SIZE_HEALTH_CHECK_FIELD = {
  value: "file_size" as keyof HealthCheckFields,
  label: "File size",
  description: "Size of image",
  unit: "Megabytes",
};
export const EXTENSION_HEALTH_CHECK_FIELD = {
  value: "extension" as keyof HealthCheckFields,
  label: "Extension",
  description: "Extension of image",
  unit: "",
};
export const CONTRAST_HEALTH_CHECK_FIELD = {
  value: "contrast" as keyof HealthCheckFields,
  label: "Contrast",
  description: "Measure the contrast of image",
  unit: "C",
};
export const MEAN_RED_CHANNEL_HEALTH_CHECK_FIELD = {
  value: "mean_red_channel" as keyof HealthCheckFields,
  label: "Mean red channel",
  description: "Measure the mean value of only red channel in RGB image",
  unit: "M",
};
export const MEAN_BLUE_CHANNEL_HEALTH_CHECK_FIELD = {
  value: "mean_blue_channel" as keyof HealthCheckFields,
  label: "Mean blue channel",
  description: "Measure the mean value of only blue channel in RGB image",
  unit: "M",
};
export const MEAN_GREEN_CHANNEL_HEALTH_CHECK_FIELD = {
  value: "mean_green_channel" as keyof HealthCheckFields,
  label: "Mean green channel",
  description: "Measure the mean value of only green channel in RGB image",
  unit: "M",
};

export const HEALTH_CHECK_ATTRIBUTES_ARRAY: DataHealthCheckSelectedAttribute[] =
  [
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
