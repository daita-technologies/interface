import { initialLabelClassPropertiesByLabelClass } from "components/Annotation/Editor/type";
import {
  ADD_IMAGES,
  ADD_NEW_CLASS_LABEL,
  CHANGE_PREVIEW_IMAGE,
  SAVE_ANNOTATION_STATE_MANAGER,
} from "./constants";
import {
  AddImageToAnnotationProps,
  AddNewClassLabelProps,
  AnnotationManagerReducer,
  ChangePreviewImageProps,
  SaveAnnotationStateManagerProps,
} from "./type";

const inititalState: AnnotationManagerReducer = {
  idDrawObjectByImageName: {},
  images: {},
  currentPreviewImageName: null,
  labelClassPropertiesByLabelClass: initialLabelClassPropertiesByLabelClass,
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
    case CHANGE_PREVIEW_IMAGE: {
      const { imageName } = payload as ChangePreviewImageProps;
      return {
        ...state,
        currentPreviewImageName: imageName,
      };
    }
    case SAVE_ANNOTATION_STATE_MANAGER: {
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
    default:
      return state;
  }
};

export default annotationManagerReducer;
