import {
  ADD_IMAGES,
  CHANGE_PREVIEW_IMAGE,
  SAVE_ANNOTATION_STATE_MANAGER,
} from "./constants";
import {
  AddImageToAnnotationProps,
  AnnotationManagerReducer,
  ChangePreviewImageProps,
  SaveAnnotationStateManagerProps,
} from "./type";

const inititalState: AnnotationManagerReducer = {
  idDrawObjectByImageName: {},
  images: {},
  currentPreviewImageName: null,
};
const annotationManagerReducer = (
  state = inititalState,
  action: any
): AnnotationManagerReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case ADD_IMAGES: {
      const { images } = payload as AddImageToAnnotationProps;
      const stateImages = state.images;
      images.forEach((image) => {
        stateImages[image.name] = image;
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
          [imageName]: drawObjectById,
        },
      };
    }
    default:
      return state;
  }
};

export default annotationManagerReducer;
