import {
  ERROR_TASK_STATUS,
  GENERATE_REFERENCE_IMAGE_TYPE,
  TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE,
} from "constants/defaultValues";
import { FETCH_TASK_INFO } from "reduxes/project/constants";
import { FetchTaskInfoSucceedPayload } from "reduxes/project/type";
import { getLocalStorage, setLocalStorage } from "utils/general";
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
  CustomPreprocessReducer,
  ReferenceImageInfoProps,
  ReferenceInfoApiFields,
  ReferencePreprocessImageRecord,
  ResetGenerateReferenceImageProps,
  SelectedMethodProps,
  UpdateIsAbleToRunPreprocessErrorActionPayload,
} from "./type";

const inititalState: CustomPreprocessReducer = {
  projectId: null,
  isPreprocessingExpertMode:
    getLocalStorage(TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE) === "true",
  referencePreprocessImage: {} as ReferencePreprocessImageRecord,
  referenceSeletectorDialog: {
    isShow: false,
  },
  selectedMethodIds: [],
  isGenerating: false,
  isGenerateReferenceRequesting: false,
  isAbleToRunPreprocessError: null,
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
    case RESET_STATE_GENERATE_REFERENCE_IMAGE: {
      const { projectId } = payload as ResetGenerateReferenceImageProps;
      return {
        ...state,
        referencePreprocessImage: {} as ReferencePreprocessImageRecord,
        referenceSeletectorDialog: {
          isShow: false,
        },
        selectedMethodIds: [],
        isGenerating: false,
        isGenerateReferenceRequesting: false,
        projectId,
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
      const { selectedMethodIds } = state;
      const newSelectedMethodIds = [] as string[];
      if (selectedMethodIds.length !== 0) {
        selectedMethodIds.forEach((methodId) => {
          const refInfo = referenceInfoApiFields.find(
            (ref) => ref.method_id === methodId
          );
          if (refInfo) {
            referencePreprocessImage[methodId] = {
              filename: refInfo.filename,
              methodId: refInfo.method_id,
              isSelectedByUser: false,
              imageS3Path: refInfo.image_s3_path,
            };
          }
          newSelectedMethodIds.push(methodId);
        });
      } else {
        referenceInfoApiFields.forEach((el) => {
          referencePreprocessImage[el.method_id] = {
            filename: el.filename,
            methodId: el.method_id,
            isSelectedByUser: false,
            imageS3Path: el.image_s3_path,
          };
          newSelectedMethodIds.push(el.method_id);
        });
      }
      return {
        ...state,
        referencePreprocessImage,
        selectedMethodIds: newSelectedMethodIds,
        isGenerateReferenceRequesting: false,
        isGenerating: false,
      };
    }
    case FETCH_REFERENCE_IMAGE_INFO.FAILED: {
      return {
        ...state,
        isGenerateReferenceRequesting: false,
        isGenerating: false,
      };
    }
    case FETCH_TASK_INFO.SUCCEEDED: {
      const { taskInfo, projectId } = payload as FetchTaskInfoSucceedPayload;
      if (
        projectId === state.projectId &&
        taskInfo.process_type === GENERATE_REFERENCE_IMAGE_TYPE &&
        taskInfo.status === ERROR_TASK_STATUS
      ) {
        return {
          ...state,
          isGenerateReferenceRequesting: false,
          isGenerating: false,
        };
      }
      return state;
    }
    case UPDATE_IS_ABLE_TO_RUN_PREPROCESS_ERROR: {
      const { isError } =
        payload as UpdateIsAbleToRunPreprocessErrorActionPayload;
      return {
        ...state,
        isAbleToRunPreprocessError: isError,
      };
    }
    default:
      return state;
  }
};
export default customPreprocessingReducer;
