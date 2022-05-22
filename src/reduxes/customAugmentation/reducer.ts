import { TEMP_LOCAL_CUSTOM_METHOD_EXPERT_MODE } from "constants/defaultValues";
import { getLocalStorage, setLocalStorage } from "utils/general";
import {
  CHANGE_AUGMENTATION_EXPERT_MODE,
  CHANGE_REFERENCE_AUGMENTATION_IMAGE,
  SET_AUGMENTATION_SELECTED_METHOD,
  SET_REFERENCE_AUGMENTATION_SELECTOR_DIALOG,
} from "./constants";
import {
  ChangeAugmentationxpertModePayload,
  CustomAugmentationReducer,
  ReferenceAugmentationgeRecord,
  ReferenceAugmentationImage,
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
    default:
      return state;
  }
};
export default customAugementationReducer;
