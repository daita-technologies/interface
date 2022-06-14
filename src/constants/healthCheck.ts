import { DataHealthCheckSelectedAttribute } from "routes/HealthCheckPage/HealthCheckMainContent/type";
import { HealthCheckFields } from "services/healthCheckApi";

export const FILE_NAME_HEALTH_CHECK_FIELD = {
  value: "file_name" as keyof HealthCheckFields,
  label: "File Name",
  description: "",
  unit: "",
};
export const STN_GREEN_HEALTH_CHECK_FIELD = {
  value: "signal_to_noise_green_channel" as keyof HealthCheckFields,
  label: "Signal-to-Noise Ratio (SnR) - Green Channel",
  description:
    "Measures the signal-to-noise ratio (SnR) of the green channel in an RGB image.",
  unit: "SnR",
};
export const STN_RED_HEALTH_CHECK_FIELD = {
  value: "signal_to_noise_red_channel" as keyof HealthCheckFields,
  label: "Signal-to-Noise Ratio (SnR) - Red Channel",
  description:
    "Measures the signal-to-noise ratio (SnR) of the red channel in an RGB image.",
  unit: "SnR",
};
export const STN_BLUE_HEALTH_CHECK_FIELD = {
  value: "signal_to_noise_blue_channel" as keyof HealthCheckFields,
  label: "Signal-to-Noise Ratio (SnR) - Blue Channel",
  description:
    "Measures the signal-to-noise ratio (SnR) of the blue channel in an RGB image.",
  unit: "SnR",
};
export const SHARPNESS_HEALTH_CHECK_FIELD = {
  value: "sharpness" as keyof HealthCheckFields,
  label: "Sharpness",
  description: "Measures the sharpness of an image.",
  unit: "S",
};
export const LUMINANCE_HEALTH_CHECK_FIELD = {
  value: "luminance" as keyof HealthCheckFields,
  label: "Luminance",
  description: "Measures the brightness of an image.",
  unit: "L",
};
export const WIDTH_HEALTH_CHECK_FIELD = {
  value: "width" as keyof HealthCheckFields,
  label: "Width",
  description: "Measures the width of an image.",
  unit: "px",
};
export const HEIGHT_HEALTH_CHECK_FIELD = {
  value: "height" as keyof HealthCheckFields,
  label: "Height",
  description: "Measures the height of an image.",
  unit: "px",
};
export const ASPECT_RATIO_HEALTH_CHECK_FIELD = {
  value: "aspect_ratio" as keyof HealthCheckFields,
  label: "Aspect Ratio",
  description: "Measures the ratio between height and width of an image.",
  unit: "H/W",
};
export const FILE_SIZE_HEALTH_CHECK_FIELD = {
  value: "file_size" as keyof HealthCheckFields,
  label: "File Size",
  description: "Measures the size of an image.",
  unit: "MB",
};
export const EXTENSION_HEALTH_CHECK_FIELD = {
  value: "extension" as keyof HealthCheckFields,
  label: "File Extension",
  description: "Lists the used file extensions.",
  unit: "",
};
export const CONTRAST_HEALTH_CHECK_FIELD = {
  value: "contrast" as keyof HealthCheckFields,
  label: "Contrast",
  description: "Measures the contrast of an image.",
  unit: "C",
};
export const MEAN_RED_CHANNEL_HEALTH_CHECK_FIELD = {
  value: "mean_red_channel" as keyof HealthCheckFields,
  label: "Mean Red Channel",
  description: "Measures the mean value of the red channel in an RGB image.",
  unit: "M",
};
export const MEAN_BLUE_CHANNEL_HEALTH_CHECK_FIELD = {
  value: "mean_blue_channel" as keyof HealthCheckFields,
  label: "Mean Blue Channel",
  description: "Measures the mean value of the blue channel in an RGB image.",
  unit: "M",
};
export const MEAN_GREEN_CHANNEL_HEALTH_CHECK_FIELD = {
  value: "mean_green_channel" as keyof HealthCheckFields,
  label: "Mean Green Channel",
  description: "Measures the mean value of the green channel in an RGB image.",
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
