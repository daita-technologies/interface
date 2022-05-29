import { TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE } from "constants/defaultValues";
import { FETCH_DETAIL_PROJECT } from "reduxes/project/constants";
import { GetAugmentCustomMethodPreviewImageResponse } from "services/customMethodApi";
import { getLocalStorage, setLocalStorage } from "utils/general";
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
  CustomAugmentationReducer,
  ReferenceAugmentationgeRecord,
  ReferenceAugmentationImage,
  RemoveAugmentCustomMethodParamValueActionPayload,
} from "./type";

const inititalState: CustomAugmentationReducer = {
  isAugmentationExpertMode:
    getLocalStorage(TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE) === "true",
  referenceAugmentationImage: {} as ReferenceAugmentationgeRecord,
  referenceSeletectorDialog: {
    isShow: false,
  },
  selectedMethodIds: [],
  augmentCustomMethodPreviewImageInfo: null,
  savedAugmentCustomMethodParamValueByProjectId: {},
  isFetchingAugmentCustomMethodPreviewImage: null,
  isLoadingPreviewImage: false,
};

const customAugementationReducer = (
  state = inititalState,
  action: any
): CustomAugmentationReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case CHANGE_AUGMENTATION_EXPERT_MODE: {
      const { isAugmentationExpertMode } =
        payload as ChangeAugmentationxpertModePayload;
      setLocalStorage(
        TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE,
        `${isAugmentationExpertMode}`
      );
      return {
        ...state,
        isAugmentationExpertMode,
      };
    }

    case CHANGE_REFERENCE_AUGMENTATION_IMAGE: {
      const { methodId } = payload as ReferenceAugmentationImage;
      return {
        ...state,
        referenceAugmentationImage: {
          ...state.referenceAugmentationImage,
          [methodId]: {
            ...payload,
          },
        },
      };
    }
    case SET_REFERENCE_AUGMENTATION_SELECTOR_DIALOG: {
      return {
        ...state,
        referenceSeletectorDialog: {
          ...state.referenceSeletectorDialog,
          ...payload,
        },
      };
    }
    case GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO.REQUESTED: {
      return {
        ...state,
        isFetchingAugmentCustomMethodPreviewImage: true,
      };
    }
    case GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO.SUCCEEDED: {
      const { method_id } =
        payload as GetAugmentCustomMethodPreviewImageResponse;

      return {
        ...state,
        isFetchingAugmentCustomMethodPreviewImage: false,
        augmentCustomMethodPreviewImageInfo: {
          ...state.augmentCustomMethodPreviewImageInfo,
          [method_id]: payload,
        },
      };
    }
    case GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO.FAILED: {
      return {
        ...state,
        isFetchingAugmentCustomMethodPreviewImage: false,
      };
    }
    case CHANGE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE: {
      const { methodId, params, projectId } =
        payload as ChangeAugmentCustomMethodParamValueActionPayload;

      const cloneSavedMethodParamValue =
        state.savedAugmentCustomMethodParamValueByProjectId[projectId][
          methodId
        ];
      if (cloneSavedMethodParamValue) {
        const cloneSelectedMethodParams = [
          ...cloneSavedMethodParamValue.params,
        ];

        params.forEach((newParamValue) => {
          const indexOfExistParam = cloneSelectedMethodParams.findIndex(
            (selectedParam) =>
              newParamValue.paramName === selectedParam.paramName
          );
          if (indexOfExistParam > -1) {
            cloneSelectedMethodParams[indexOfExistParam].paramValue =
              newParamValue.paramValue;
          } else {
            cloneSelectedMethodParams.push({
              paramName: newParamValue.paramName,
              paramValue: newParamValue.paramValue,
            });
          }
        });

        return {
          ...state,
          savedAugmentCustomMethodParamValueByProjectId: {
            ...state.savedAugmentCustomMethodParamValueByProjectId,
            [projectId]: {
              ...state.savedAugmentCustomMethodParamValueByProjectId[projectId],
              [methodId]: {
                methodId,
                params: cloneSelectedMethodParams,
              },
            },
          },
          isLoadingPreviewImage: true,
        };
      }

      return {
        ...state,
        savedAugmentCustomMethodParamValueByProjectId: {
          ...state.savedAugmentCustomMethodParamValueByProjectId,
          [projectId]: {
            ...state.savedAugmentCustomMethodParamValueByProjectId[projectId],
            [methodId]: {
              methodId,
              params,
            },
          },
        },
        isLoadingPreviewImage: true,
      };
    }

    case ADD_AUGMENT_CUSTOM_METHOD_PARAM_VALUE: {
      const { addMethodIdList, projectId } =
        payload as AddAugmentCustomMethodParamValueActionPayload;
      const cloneSavedAugmentCustomMethodParamValue = {
        ...state.savedAugmentCustomMethodParamValueByProjectId[projectId],
      };
      addMethodIdList.forEach((addMethodId) => {
        cloneSavedAugmentCustomMethodParamValue[addMethodId] = undefined;
      });

      return {
        ...state,
        savedAugmentCustomMethodParamValueByProjectId: {
          ...state.savedAugmentCustomMethodParamValueByProjectId,
          [projectId]: {
            ...cloneSavedAugmentCustomMethodParamValue,
          },
        },
      };
    }
    case REMOVE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE: {
      const { removeMethodIdList, projectId } =
        payload as RemoveAugmentCustomMethodParamValueActionPayload;
      const cloneSavedAugmentCustomMethodParamValue = {
        ...state.savedAugmentCustomMethodParamValueByProjectId[projectId],
      };
      removeMethodIdList.forEach(
        (removeMethodId) =>
          delete cloneSavedAugmentCustomMethodParamValue[removeMethodId]
      );
      return {
        ...state,
        savedAugmentCustomMethodParamValueByProjectId: {
          ...state.savedAugmentCustomMethodParamValueByProjectId,
          [projectId]: {
            ...cloneSavedAugmentCustomMethodParamValue,
          },
        },
      };
    }
    case CHANGE_IS_LOADING_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE: {
      const { isLoading } =
        payload as ChangeIsLoadingAugmentCustomMethodPreviewImageRequestActionPayload;
      return {
        ...state,
        isLoadingPreviewImage: isLoading,
      };
    }
    case FETCH_DETAIL_PROJECT.SUCCEEDED: {
      const { currentProjectInfo } = payload;

      if (currentProjectInfo) {
        const projectId = currentProjectInfo.project_id;
        if (!state.savedAugmentCustomMethodParamValueByProjectId[projectId]) {
          return {
            ...state,
            savedAugmentCustomMethodParamValueByProjectId: {
              ...state.savedAugmentCustomMethodParamValueByProjectId,
              [projectId]: {},
            },
          };
        }
      }
      return state;
    }
    default:
      return state;
  }
};
export default customAugementationReducer;
