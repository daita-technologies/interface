import {
  CHANGE_AUGMENTATION_EXPERT_MODE,
  CHANGE_REFERENCE_AUGMENTATION_IMAGE,
  SET_REFERENCE_AUGMENTATION_SELECTOR_DIALOG,
} from "./constants";
import {
  ChangeAugmentationxpertModePayload,
  ReferenceAugmentationImageInfoProps,
  ReferenceAugmentationSeletectorDialog,
} from "./type";

export const changeAugmentationExpertMode = (
  payload: ChangeAugmentationxpertModePayload
) => ({
  type: CHANGE_AUGMENTATION_EXPERT_MODE,
  payload,
});

export const setReferenceSeletectorDialog = (
  payload: ReferenceAugmentationSeletectorDialog
) => ({
  type: SET_REFERENCE_AUGMENTATION_SELECTOR_DIALOG,
  payload,
});

export const setReferenceAugmentationImage = (
  payload: ReferenceAugmentationImageInfoProps
) => ({
  type: CHANGE_REFERENCE_AUGMENTATION_IMAGE,
  payload,
});
