import {
  ADD_IMAGES,
  ADD_NEW_CLASS_LABEL,
  CHANGE_PREVIEW_IMAGE,
  SAVE_ANNOTATION_STATE_MANAGER,
} from "./constants";
import {
  AddImageToAnnotationProps,
  AddNewClassLabelProps,
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
export const addNewClassLabel = (payload: AddNewClassLabelProps) => ({
  type: ADD_NEW_CLASS_LABEL,
  payload,
});
