import { ReferenceImagesParams } from "services/customMethodApi";
import {
  CHANGE_PREPROCESSING_EXPERT_MODE,
  CHANGE_REFERENCE_PREPROCESSING_IMAGE,
  FETCH_REFERENCE_IMAGE_INFO,
  GENERATE_REFERENCE_IMAGES,
  RESET_STATE_GENERATE_REFERENCE_IMAGE,
  SET_REFERENCE_SELECTOR_DIALOG,
  SET_SELECTED_METHODS,
  UPDATE_IS_ABLE_TO_RUN_PREPROCESS_ERROR,
} from "./constants";
import {
  ChangePreprocessingExpertModePayload,
  GenerateReferenceImagesProps,
  ReferenceImageInfoProps,
  ReferenceInfoApiFields,
  ReferenceSeletectorDialog,
  ResetGenerateReferenceImageProps,
  SelectedMethodProps,
  UpdateIsAbleToRunPreprocessErrorActionPayload,
} from "./type";

export const changePreprocessingExpertMode = (
  payload: ChangePreprocessingExpertModePayload
) => ({
  type: CHANGE_PREPROCESSING_EXPERT_MODE,
  payload,
});

export const setReferenceSeletectorDialog = (
  payload: ReferenceSeletectorDialog
) => ({
  type: SET_REFERENCE_SELECTOR_DIALOG,
  payload,
});

export const setReferencePreprocessImage = (
  payload: ReferenceImageInfoProps
) => ({
  type: CHANGE_REFERENCE_PREPROCESSING_IMAGE,
  payload,
});
export const setSelectedMethods = (payload: SelectedMethodProps) => ({
  type: SET_SELECTED_METHODS,
  payload,
});
export const resetStateGenerateReferenceImage = (
  payload: ResetGenerateReferenceImageProps
) => ({
  type: RESET_STATE_GENERATE_REFERENCE_IMAGE,
  payload,
});
export const generateReferenceImages = (
  payload: GenerateReferenceImagesProps
) => ({
  type: GENERATE_REFERENCE_IMAGES.REQUESTED,
  payload,
});

export const fetchReferenceImageInfo = (payload: ReferenceImagesParams) => ({
  type: FETCH_REFERENCE_IMAGE_INFO.REQUESTED,
  payload,
});

export const fetchReferenceImageInfoSuccess = (
  payload: ReferenceInfoApiFields[]
) => ({
  type: FETCH_REFERENCE_IMAGE_INFO.SUCCEEDED,
  payload,
});
export const updateIsAbleToRunPreprocessError = (
  payload: UpdateIsAbleToRunPreprocessErrorActionPayload
) => ({
  type: UPDATE_IS_ABLE_TO_RUN_PREPROCESS_ERROR,
  payload,
});
