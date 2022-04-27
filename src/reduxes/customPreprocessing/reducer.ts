import {
  CHANGE_PREPROCESSING_EXPERT_MODE,
  CHANGE_REFERENCE_PREPROCESSING_IMAGE,
  SET_REFERENCE_SELECTOR_DIALOG,
} from "./constants";
import {
  ChangePreprocessingExpertModePayload,
  CustomPreprocessReducer,
  ReferenceImageInfoProps,
  ReferencePreprocessImageRecord,
} from "./type";

const inititalState: CustomPreprocessReducer = {
  isPreprocessingExpertMode: true,
  referencePreprocessImage: {} as ReferencePreprocessImageRecord,
  images: {},
  referenceSeletectorDialog: {
    isShow: false,
  },
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
      return {
        ...state,
        isPreprocessingExpertMode,
      };
    }
    case CHANGE_REFERENCE_PREPROCESSING_IMAGE: {
      const { method, fileName } = payload as ReferenceImageInfoProps;
      return {
        ...state,
        referencePreprocessImage: {
          ...state.referencePreprocessImage,
          [method]: fileName,
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
    default:
      return state;
  }
};
export default customPreprocessingReducer;
