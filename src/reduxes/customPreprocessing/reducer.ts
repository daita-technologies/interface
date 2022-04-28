import { TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE } from "constants/defaultValues";
import { getLocalStorage, setLocalStorage } from "utils/general";
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
  isPreprocessingExpertMode:
    getLocalStorage(TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE) === "true",
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
      const { method, filename } = payload as ReferenceImageInfoProps;
      return {
        ...state,
        referencePreprocessImage: {
          ...state.referencePreprocessImage,
          [method]: {
            filename,
            method,
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
    default:
      return state;
  }
};
export default customPreprocessingReducer;
