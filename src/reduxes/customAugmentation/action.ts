import {
  CHANGE_AUGMENTATION_EXPERT_MODE,
  CHANGE_REFERENCE_AUGMENTATION_IMAGE,
  SET_AUGMENTATION_SELECTED_METHOD,
  SET_REFERENCE_AUGMENTATION_SELECTOR_DIALOG,
} from "./constants";
import {
  ChangeAugmentationxpertModePayload,
  ReferenceAugmentationImage,
  ReferenceSeletectorDialog,
  SelectedMethodProps,
} from "./type";

export const changeAugmentationExpertMode = (
  payload: ChangeAugmentationxpertModePayload
) => ({
  type: CHANGE_AUGMENTATION_EXPERT_MODE,
  payload,
});

export const setReferenceSeletectorDialog = (
  payload: ReferenceSeletectorDialog
) => ({
  type: SET_REFERENCE_AUGMENTATION_SELECTOR_DIALOG,
  payload,
});

export const setReferenceAugmentationImage = (
  payload: ReferenceAugmentationImage
) => ({
  type: CHANGE_REFERENCE_AUGMENTATION_IMAGE,
  payload,
});

export const setSelectedMethods = (payload: SelectedMethodProps) => ({
  type: SET_AUGMENTATION_SELECTED_METHOD,
  payload,
});
