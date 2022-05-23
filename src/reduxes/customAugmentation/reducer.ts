import { TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE } from "constants/defaultValues";
import { GetAugmentCustomMethodPreviewImageResponse } from "services/customMethodApi";
import { getLocalStorage, setLocalStorage } from "utils/general";
import {
  CHANGE_AUGMENTATION_EXPERT_MODE,
  CHANGE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE,
  CHANGE_IS_LOADING_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE,
  CHANGE_REFERENCE_AUGMENTATION_IMAGE,
  GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO,
  REMOVE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE,
  SET_AUGMENTATION_SELECTED_METHOD,
  SET_REFERENCE_AUGMENTATION_SELECTOR_DIALOG,
} from "./constants";
import {
  ChangeAugmentationxpertModePayload,
  ChangeAugmentCustomMethodParamValueActionPayload,
  ChangeIsLoadingAugmentCustomMethodPreviewImageRequestActionPayload,
  CustomAugmentationReducer,
  ReferenceAugmentationgeRecord,
  ReferenceAugmentationImage,
  RemoveAugmentCustomMethodParamValueActionPayload,
  SelectedMethodProps,
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
  savedAugmentCustomMethodParamValue: {},
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
    case SET_AUGMENTATION_SELECTED_METHOD: {
      const { selectedMethodIds } = payload as SelectedMethodProps;
      const referenceAugmentationImage = {} as ReferenceAugmentationgeRecord;
      selectedMethodIds.forEach((selectedMethod) => {
        referenceAugmentationImage[selectedMethod] =
          state.referenceAugmentationImage[selectedMethod];
      });
      return {
        ...state,
        selectedMethodIds,
        referenceAugmentationImage,
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
      const {
        method_id,
        //  ls_params_name, ls_params_value
      } = payload as GetAugmentCustomMethodPreviewImageResponse;
      // const defaultSavedParams: SelectedParamAugmentCustomMethod[] = [];
      // ls_params_name.forEach((paramName) =>
      //   defaultSavedParams.push({
      //     paramName,
      //     paramValue: ls_params_value[paramName][0],
      //   })
      // );

      return {
        ...state,
        isFetchingAugmentCustomMethodPreviewImage: false,
        augmentCustomMethodPreviewImageInfo: {
          ...state.augmentCustomMethodPreviewImageInfo,
          [method_id]: payload,
        },
        // savedAugmentCustomMethodParamValue: {
        //   ...state.savedAugmentCustomMethodParamValue,
        //   [method_id]: {
        //     methodId: method_id,
        //     params: defaultSavedParams,
        //   },
        // },
      };
    }
    case GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO.FAILED: {
      return {
        ...state,
        isFetchingAugmentCustomMethodPreviewImage: false,
      };
    }
    case CHANGE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE: {
      const { methodId, params } =
        payload as ChangeAugmentCustomMethodParamValueActionPayload;

      const cloneSavedMethodParamValue =
        state.savedAugmentCustomMethodParamValue[methodId];
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
          savedAugmentCustomMethodParamValue: {
            ...state.savedAugmentCustomMethodParamValue,
            [methodId]: {
              methodId,
              params: cloneSelectedMethodParams,
            },
          },
          isLoadingPreviewImage: true,
        };
      }

      return {
        ...state,
        savedAugmentCustomMethodParamValue: {
          ...state.savedAugmentCustomMethodParamValue,
          [methodId]: {
            methodId,
            params,
          },
        },
        isLoadingPreviewImage: true,
      };
    }
    case REMOVE_AUGMENT_CUSTOM_METHOD_PARAM_VALUE: {
      const { removeMethodIdList } =
        payload as RemoveAugmentCustomMethodParamValueActionPayload;
      const cloneSavedAugmentCustomMethodParamValue = {
        ...state.savedAugmentCustomMethodParamValue,
      };
      removeMethodIdList.forEach(
        (removeMethodId) =>
          delete cloneSavedAugmentCustomMethodParamValue[removeMethodId]
      );
      return {
        ...state,
        savedAugmentCustomMethodParamValue: {
          ...cloneSavedAugmentCustomMethodParamValue,
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

    default:
      return state;
  }
};
export default customAugementationReducer;
