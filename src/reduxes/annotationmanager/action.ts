import {
  ADD_IMAGES,
  CHANGE_PREVIEW_IMAGE,
  SAVE_ANNOTATION_STATE_MANAGER,
} from "./constants";
import {
  AddImageToAnnotationProps,
  ChangePreviewImageProps,
  SaveAnnotationStateManagerProps,
} from "./type";

export const addImagesToAnnotation = (payload: AddImageToAnnotationProps) => ({
  type: ADD_IMAGES,
  payload,
});
export const changePreviewImage = (payload: ChangePreviewImageProps) => ({
  type: CHANGE_PREVIEW_IMAGE,
  payload,
});
export const saveAnnotationStateManager = (
  payload: SaveAnnotationStateManagerProps
) => ({
  type: SAVE_ANNOTATION_STATE_MANAGER,
  payload,
});
