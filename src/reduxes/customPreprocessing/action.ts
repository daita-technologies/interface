import {
  CHANGE_PREPROCESSING_EXPERT_MODE,
  CHANGE_REFERENCE_PREPROCESSING_IMAGE,
  SET_REFERENCE_SELECTOR_DIALOG,
} from "./constants";
import {
  ChangePreprocessingExpertModePayload,
  ReferenceImageInfoProps,
  ReferenceSeletectorDialog,
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
