import {
  ADD_IMAGES,
  ADD_NEW_CLASS_LABEL,
  CHANGE_PREVIEW_IMAGE,
  EDIT_CLASS_LABEL,
  EDIT_CLASS_MANAGE_MODAL,
  SAVE_ANNOTATION_STATE_MANAGER,
  SET_CLASS_MANAGE_MODAL,
} from "./constants";
import {
  AddImageToAnnotationProps,
  AddNewClassLabelProps,
  ChangePreviewImageProps,
  ClassManageModalProps,
  EditClassLabelProps,
  EditClassManageModalProps,
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
export const editClassLabel = (payload: EditClassLabelProps) => ({
  type: EDIT_CLASS_LABEL,
  payload,
});
export const setDialogClassManageModal = (payload: ClassManageModalProps) => ({
  type: SET_CLASS_MANAGE_MODAL,
  payload,
});
export const openEditDialogClassManageModal = (
  payload: EditClassManageModalProps
) => ({
  type: EDIT_CLASS_MANAGE_MODAL,
  payload,
});
