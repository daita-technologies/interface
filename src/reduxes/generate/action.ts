import { GENERATE_IMAGES } from "./constants";
import { GenerateImagePayload } from "./type";

export const generateImages = (payload: GenerateImagePayload) => ({
  type: GENERATE_IMAGES.REQUESTED,
  payload,
});

export const generateImages2 = (payload: GenerateImagePayload) => ({
  type: GENERATE_IMAGES.REQUESTED,
  payload,
});
