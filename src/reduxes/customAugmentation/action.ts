import {
  CHANGE_AUGMENTATION_EXPERT_MODE,
  CHANGE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE,
  CHANGE_REFERENCE_AUGMENTATION_IMAGE,
  GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO,
  SET_AUGMENTATION_SELECTED_METHOD,
  SET_REFERENCE_AUGMENTATION_SELECTOR_DIALOG,
} from "./constants";
import {
  ChangeAugmentationxpertModePayload,
  ChangeAugmentCustomMethodParamValueActionPayload,
  GetAugmentCustomMethodPreviewImageInfoRequestActionPayload,
  GetAugmentCustomMethodPreviewImageInfoSucceededActionPayload,
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

export const getAugmentCustomMethodPreviewImageInfo = (
  payload: GetAugmentCustomMethodPreviewImageInfoRequestActionPayload
) => ({
  type: GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO.REQUESTED,
  payload,
});

export const getAugmentCustomMethodPreviewImageInfoSucceeded = (
  payload: GetAugmentCustomMethodPreviewImageInfoSucceededActionPayload
) => ({
  type: GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO.SUCCEEDED,
  payload,
});

export const changeAugmentCustomMethodParamValue = (
  payload: ChangeAugmentCustomMethodParamValueActionPayload
) => ({
  type: CHANGE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE,
  payload,
});
