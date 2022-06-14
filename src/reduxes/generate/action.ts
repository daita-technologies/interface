import { CHANGE_ACTIVE_GENERATE_TAB, GENERATE_IMAGES } from "./constants";
import { ChangeActiveGenerateTabIdPayload, GenerateImagePayload } from "./type";

export const generateImages = (payload: GenerateImagePayload) => ({
  type: GENERATE_IMAGES.REQUESTED,
  payload,
});

export const generateImages2 = (payload: GenerateImagePayload) => ({
  type: GENERATE_IMAGES.REQUESTED,
  payload,
});

export const changeActiveGenerateTab = (
  payload: ChangeActiveGenerateTabIdPayload
) => ({
  type: CHANGE_ACTIVE_GENERATE_TAB,
  payload,
});
