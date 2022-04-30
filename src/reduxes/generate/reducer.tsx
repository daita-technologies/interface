import {
  AUGMENT_GENERATE_IMAGES_TYPE,
  PREPROCESSING_GENERATE_IMAGES_TYPE,
  PREPROCESS_GENERATE_TAB,
} from "constants/defaultValues";
import { CHANGE_ACTIVE_GENERATE_TAB, GENERATE_IMAGES } from "./constants";
import {
  ChangeActiveGenerateTabIdPayload,
  GenerateImageFailedPayload,
  GenerateImagePayload,
  GenerateImageSucceedPayload,
  GenerateReducer,
} from "./type";

const inititalState: GenerateReducer = {
  isGeneratingImages: null,
  isGenerateImagesPreprocessing: null,
  isGenerateImagesAugmenting: null,
  activeTabId: PREPROCESS_GENERATE_TAB,
};

const generateReducer = (state = inititalState, action: any) => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case GENERATE_IMAGES.REQUESTED: {
      const { generateMethod } = payload as GenerateImagePayload;
      let processing = null;
      let augmenting = null;
      if (generateMethod === PREPROCESSING_GENERATE_IMAGES_TYPE) {
        processing = true;
      } else if (generateMethod === AUGMENT_GENERATE_IMAGES_TYPE) {
        augmenting = true;
      }
      return {
        ...state,
        isGeneratingImages: true,
        isGenerateImagesPreprocessing: processing,
        isGenerateImagesAugmenting: augmenting,
      };
    }
    case GENERATE_IMAGES.SUCCEEDED: {
      const { generateMethod } = payload as GenerateImageSucceedPayload;
      let processing = state.isGenerateImagesPreprocessing;
      let augmenting = state.isGenerateImagesAugmenting;
      if (generateMethod === PREPROCESSING_GENERATE_IMAGES_TYPE) {
        processing = false;
      } else if (generateMethod === AUGMENT_GENERATE_IMAGES_TYPE) {
        augmenting = false;
      }
      return {
        ...state,
        isGeneratingImages: false,
        isGenerateImagesPreprocessing: processing,
        isGenerateImagesAugmenting: augmenting,
      };
    }
    case GENERATE_IMAGES.FAILED: {
      const { generateMethod } = payload as GenerateImageFailedPayload;
      let processing = state.isGenerateImagesPreprocessing;
      let augmenting = state.isGenerateImagesAugmenting;
      if (generateMethod === PREPROCESSING_GENERATE_IMAGES_TYPE) {
        processing = false;
      } else if (generateMethod === AUGMENT_GENERATE_IMAGES_TYPE) {
        augmenting = false;
      }
      return {
        ...state,
        isGeneratingImages: false,
        isGenerateImagesPreprocessing: processing,
        isGenerateImagesAugmenting: augmenting,
      };
    }
    case CHANGE_ACTIVE_GENERATE_TAB: {
      const { tabId } = payload as ChangeActiveGenerateTabIdPayload;
      return {
        ...state,
        activeTabId: tabId,
      };
    }
    default:
      return state;
  }
};

export default generateReducer;
