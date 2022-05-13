import { TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE } from "constants/defaultValues";
import { getLocalStorage, setLocalStorage } from "utils/general";
import {
  CHANGE_PREPROCESSING_EXPERT_MODE,
  CHANGE_REFERENCE_PREPROCESSING_IMAGE,
  FETCH_REFERENCE_IMAGE_INFO,
  GENERATE_REFERENCE_IMAGES,
  SET_REFERENCE_SELECTOR_DIALOG,
  SET_SELECTED_METHODS,
} from "./constants";
import {
  ChangePreprocessingExpertModePayload,
  CustomPreprocessReducer,
  ReferenceImageInfoProps,
  ReferenceInfoApiFields,
  ReferencePreprocessImageRecord,
  SelectedMethodProps,
} from "./type";

const inititalState: CustomPreprocessReducer = {
  isPreprocessingExpertMode:
    getLocalStorage(TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE) === "true",
  referencePreprocessImage: {} as ReferencePreprocessImageRecord,
  referenceSeletectorDialog: {
    isShow: false,
  },
  selectedMethodIds: [],
  isGenerating: false,
  isGenerateReferenceRequesting: false,
};

const customPreprocessingReducer = (
  state = inititalState,
  action: any
): CustomPreprocessReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case CHANGE_PREPROCESSING_EXPERT_MODE: {
      const { isPreprocessingExpertMode } =
        payload as ChangePreprocessingExpertModePayload;
      setLocalStorage(
        TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE,
        `${isPreprocessingExpertMode}`
      );
      return {
        ...state,
        isPreprocessingExpertMode,
      };
    }
    case CHANGE_REFERENCE_PREPROCESSING_IMAGE: {
      const { methodId } = payload as ReferenceImageInfoProps;
      return {
        ...state,
        referencePreprocessImage: {
          ...state.referencePreprocessImage,
          [methodId]: {
            isSelectedByUser: true,
            ...payload,
          },
        },
      };
    }
    case SET_REFERENCE_SELECTOR_DIALOG: {
      return {
        ...state,
        referenceSeletectorDialog: {
          ...state.referenceSeletectorDialog,
          ...payload,
        },
      };
    }
    case SET_SELECTED_METHODS: {
      const { selectedMethodIds } = payload as SelectedMethodProps;
      const referencePreprocessImage = {} as ReferencePreprocessImageRecord;
      selectedMethodIds.forEach((selectedMethod) => {
        referencePreprocessImage[selectedMethod] =
          state.referencePreprocessImage[selectedMethod];
      });
      return {
        ...state,
        selectedMethodIds,
        referencePreprocessImage,
      };
    }
    case GENERATE_REFERENCE_IMAGES.REQUESTED: {
      return {
        ...state,
        isGenerateReferenceRequesting: true,
        isGenerating: true,
      };
    }
    case GENERATE_REFERENCE_IMAGES.SUCCEEDED: {
      return {
        ...state,
        isGenerateReferenceRequesting: false,
        isGenerating: true,
      };
    }
    case GENERATE_REFERENCE_IMAGES.FAILED: {
      return {
        ...state,
        isGenerateReferenceRequesting: false,
        isGenerating: false,
      };
    }
    case FETCH_REFERENCE_IMAGE_INFO.SUCCEEDED: {
      const referenceInfoApiFields = payload as ReferenceInfoApiFields[];
      const referencePreprocessImage = {} as ReferencePreprocessImageRecord;
      const selectedMethodIds = [] as string[];
      referenceInfoApiFields.forEach((el) => {
        const refImage = state.referencePreprocessImage[el.method_id];
        if (refImage && refImage.isSelectedByUser) {
          referencePreprocessImage[el.method_id] = refImage;
        } else {
          referencePreprocessImage[el.method_id] = {
            filename: el.filename,
            methodId: el.method_id,
            isSelectedByUser: false,
            imageS3Path: el.image_s3_path,
          };
        }
        selectedMethodIds.push(el.method_id);
      });

      return {
        ...state,
        referencePreprocessImage,
        selectedMethodIds,
        isGenerating: false,
      };
    }
    case FETCH_REFERENCE_IMAGE_INFO.FAILED: {
      return {
        ...state,
        isGenerating: false,
      };
    }
    default:
      return state;
  }
};
export default customPreprocessingReducer;
