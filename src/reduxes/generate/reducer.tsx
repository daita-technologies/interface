import {
  AUGMENT_GENERATE_IMAGES_TYPE,
  PREPROCESSING_GENERATE_IMAGES_TYPE,
} from "constants/defaultValues";
import { GENERATE_IMAGES } from "./constants";
import {
  GenerateImageFailedPayload,
  GenerateImagePayload,
  GenerateImageSucceedPayload,
  GenerateReducer,
} from "./type";

const inititalState: GenerateReducer = {
  isGeneratingImages: null,
  isGenerateImagesPreprocessing: null,
  isGenerateImagesAugmenting: null,
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

    default:
      return state;
  }
};

export default generateReducer;
