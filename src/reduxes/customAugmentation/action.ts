import {
  ADD_AUGMENT_CUSTOM_METHOD_PARAM_VALUE,
  CHANGE_AUGMENTATION_EXPERT_MODE,
  CHANGE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE,
  CHANGE_IS_LOADING_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE,
  CHANGE_REFERENCE_AUGMENTATION_IMAGE,
  GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO,
  REMOVE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE,
  SET_REFERENCE_AUGMENTATION_SELECTOR_DIALOG,
} from "./constants";
import {
  AddAugmentCustomMethodParamValueActionPayload,
  ChangeAugmentationxpertModePayload,
  ChangeAugmentCustomMethodParamValueActionPayload,
  ChangeIsLoadingAugmentCustomMethodPreviewImageRequestActionPayload,
  GetAugmentCustomMethodPreviewImageInfoRequestActionPayload,
  GetAugmentCustomMethodPreviewImageInfoSucceededActionPayload,
  ReferenceAugmentationImage,
  ReferenceSeletectorDialog,
  RemoveAugmentCustomMethodParamValueActionPayload,
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

export const addAugmentCustomMethodParamValue = (
  payload: AddAugmentCustomMethodParamValueActionPayload
) => ({
  type: ADD_AUGMENT_CUSTOM_METHOD_PARAM_VALUE,
  payload,
});

export const removeAugmentCustomMethodParamValue = (
  payload: RemoveAugmentCustomMethodParamValueActionPayload
) => ({
  type: REMOVE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE,
  payload,
});

export const changeIsLoadingAugmentCustomMethodPreviewImage = (
  payload: ChangeIsLoadingAugmentCustomMethodPreviewImageRequestActionPayload
) => ({
  type: CHANGE_IS_LOADING_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE,
  payload,
});
