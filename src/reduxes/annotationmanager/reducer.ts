import { initialLabelClassPropertiesByLabelClass } from "components/Annotation/Editor/type";
import {
  ADD_IMAGES,
  ADD_NEW_CLASS_LABEL,
  CHANGE_PREVIEW_IMAGE,
  EDIT_CLASS_LABEL,
  EDIT_CLASS_MANAGE_MODAL,
  RESET_ANNOTATION_MANAGER,
  SAVE_ANNOTATION_STATE_MANAGER,
  SET_ANNOTATION_STATE_MANAGER,
  SET_CLASS_MANAGE_MODAL,
  SET_PREVIEW_IMAGE,
} from "./constants";
import {
  AddImageToAnnotationProps,
  AddNewClassLabelProps,
  AnnotationManagerReducer,
  ChangePreviewImageProps,
  ClassManageModalProps,
  EditClassLabelProps,
  EditClassManageModalProps,
  SaveAnnotationStateManagerProps,
} from "./type";

const inititalState: AnnotationManagerReducer = {
  idDrawObjectByImageName: {},
  images: {},
  currentPreviewImageName: null,
  labelClassPropertiesByLabelClass: {}, // initialLabelClassPropertiesByLabelClass,
  dialogClassManageModal: {
    isOpen: false,
  },
  isFetchingImageData: false,
  isSavingAnnotation: false,
};
const annotationManagerReducer = (
  state = inititalState,
  action: any
): AnnotationManagerReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case ADD_IMAGES: {
      const { annotationImagesProperties } =
        payload as AddImageToAnnotationProps;
      const stateImages = state.images;
      annotationImagesProperties.forEach((annotationImagesProperty) => {
        stateImages[annotationImagesProperty.image.name] =
          annotationImagesProperty;
      });
      return {
        ...state,
        images: { ...stateImages },
      };
    }
    case CHANGE_PREVIEW_IMAGE.REQUESTED: {
      const { imageName } = payload as ChangePreviewImageProps;
      return {
        ...state,
        currentPreviewImageName: imageName,
        isFetchingImageData: true,
      };
    }
    case CHANGE_PREVIEW_IMAGE.SUCCEEDED: {
      return {
        ...state,
        isFetchingImageData: false,
      };
    }
    case CHANGE_PREVIEW_IMAGE.FAILED: {
      return {
        ...state,
        isFetchingImageData: false,
      };
    }
    case SET_PREVIEW_IMAGE: {
      const { imageName } = payload as ChangePreviewImageProps;
      return {
        ...state,
        currentPreviewImageName: imageName,
      };
    }
    case SAVE_ANNOTATION_STATE_MANAGER.REQUESTED: {
      const { imageName, drawObjectById } =
        payload as SaveAnnotationStateManagerProps;
      return {
        ...state,
        isSavingAnnotation: true,
        idDrawObjectByImageName: {
          ...state.idDrawObjectByImageName,
          [imageName]: { ...drawObjectById },
        },
      };
    }
    case SAVE_ANNOTATION_STATE_MANAGER.SUCCEEDED: {
      return {
        ...state,
        isSavingAnnotation: false,
      };
    }
    case SAVE_ANNOTATION_STATE_MANAGER.FAILED: {
      return {
        ...state,
        isSavingAnnotation: false,
      };
    }
    case ADD_NEW_CLASS_LABEL: {
      const { labelClassProperties } = payload as AddNewClassLabelProps;
      return {
        ...state,
        labelClassPropertiesByLabelClass: {
          ...state.labelClassPropertiesByLabelClass,
          [labelClassProperties.label.label]: {
            ...labelClassProperties,
            label: { ...labelClassProperties.label },
          },
        },
      };
    }
    case EDIT_CLASS_LABEL: {
      const { label, labelClassProperties } = payload as EditClassLabelProps;
      return {
        ...state,
        labelClassPropertiesByLabelClass: {
          ...state.labelClassPropertiesByLabelClass,
          [label]: {
            ...labelClassProperties,
          },
        },
      };
    }
    case SET_CLASS_MANAGE_MODAL: {
      const { isOpen, className, classManageModalType } =
        payload as ClassManageModalProps;
      return {
        ...state,
        dialogClassManageModal: {
          isOpen,
          className: isOpen ? className : "",
          classManageModalType: isOpen ? classManageModalType : undefined,
        },
      };
    }
    case EDIT_CLASS_MANAGE_MODAL: {
      const { className } = payload as EditClassManageModalProps;
      return {
        ...state,
        dialogClassManageModal: {
          ...state.dialogClassManageModal,
          isOpen: true,
          className,
          classManageModalType: "EDIT",
        },
      };
    }
    case SET_ANNOTATION_STATE_MANAGER: {
      const { imageName, drawObjectById } =
        payload as SaveAnnotationStateManagerProps;
      return {
        ...state,
        idDrawObjectByImageName: {
          ...state.idDrawObjectByImageName,
          [imageName]: { ...drawObjectById },
        },
      };
    }
    case RESET_ANNOTATION_MANAGER: {
      return { ...inititalState };
    }
    default:
      return state;
  }
};

export default annotationManagerReducer;
