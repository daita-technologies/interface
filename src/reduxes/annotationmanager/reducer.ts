import {
  MAX_HEIGHT_EDITOR,
  MAX_HEIGHT_IMAGE_IN_EDITOR,
  MAX_WIDTH_EDITOR,
  MAX_WIDTH_IMAGE_IN_EDITOR,
} from "components/Annotation/Editor/const";
import {
  ADD_IMAGES,
  ADD_NEW_CLASS_LABEL,
  CHANGE_PREVIEW_IMAGE,
  EDIT_CLASS_LABEL,
  EDIT_CLASS_MANAGE_MODAL,
  RESET_ANNOTATION_MANAGER,
  SAVE_ANNOTATION_STATE_MANAGER,
  SET_ANNOTATION_STATE_MANAGER,
  SET_CLIENT_RECT_OF_BASE_IMAGE,
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
  SetClientRectOfBaseImageProps,
} from "./type";

const inititalState: AnnotationManagerReducer = {
  idDrawObjectByImageName: {},
  images: {},
  currentPreviewImageName: null,
  currentImageInEditorProps: null,
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
      if (state.currentPreviewImageName) {
        const image = state.images[state.currentPreviewImageName];
        if (image) {
          const { height, width } = image;
          const widthRatio = MAX_WIDTH_IMAGE_IN_EDITOR / width;
          const heightRatio = MAX_HEIGHT_IMAGE_IN_EDITOR / height;
          let newWidth = width;
          let newHeight = height;
          if (widthRatio < 1 || heightRatio < 1) {
            if (widthRatio < heightRatio) {
              newWidth = MAX_WIDTH_IMAGE_IN_EDITOR;
              newHeight *= widthRatio;
            } else {
              newHeight = MAX_HEIGHT_IMAGE_IN_EDITOR;
              newWidth *= heightRatio;
            }
          }
          const scaleX = newWidth / width;
          const scaleY = newHeight / height;
          const paddingLeft = (MAX_WIDTH_EDITOR - newWidth) / scaleX / 2.0;
          const paddingTop = (MAX_HEIGHT_EDITOR - newHeight) / scaleY / 2.0;
          return {
            ...state,
            currentImageInEditorProps: {
              scaleX,
              scaleY,
              width: newWidth,
              height: newHeight,
              paddingLeft,
              paddingTop,
              clientRectOfBaseImage: null,
            },
            isFetchingImageData: false,
          };
        }
      }

      return {
        ...state,
        isFetchingImageData: false,
      };
    }
    case SET_CLIENT_RECT_OF_BASE_IMAGE: {
      const { clientRectOfBaseImage } =
        payload as SetClientRectOfBaseImageProps;
      if (state.currentImageInEditorProps) {
        return {
          ...state,
          currentImageInEditorProps: {
            ...state.currentImageInEditorProps,
            clientRectOfBaseImage,
          },
        };
      }
      return state;
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
