import {
  ADD_IMAGES,
  ADD_NEW_CLASS_LABEL,
  CHANGE_PREVIEW_IMAGE,
  EDIT_CLASS_LABEL,
  EDIT_CLASS_MANAGE_MODAL,
  FETCH_FILE_AND_ANNOTATION,
  SAVE_ANNOTATION_STATE_MANAGER,
  SAVE_REMOTE_NEW_CLASS_LABEL,
  SET_ANNOTATION_STATE_MANAGER,
  SET_CLASS_MANAGE_MODAL,
  SET_PREVIEW_IMAGE,
} from "./constants";
import {
  AddImageToAnnotationProps,
  AddNewClassLabelProps,
  ChangePreviewImageProps,
  ClassManageModalProps,
  EditClassLabelProps,
  EditClassManageModalProps,
  FetchingFileAndAnnotaitonProps,
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
export const setPreviewImage = (payload: ChangePreviewImageProps) => ({
  type: SET_PREVIEW_IMAGE,
  payload,
});
export const saveAnnotationStateManager = (
  payload: SaveAnnotationStateManagerProps
) => ({
  type: SAVE_ANNOTATION_STATE_MANAGER.REQUESTED,
  payload,
});
export const setAnnotationStateManager = (
  payload: SaveAnnotationStateManagerProps
) => ({
  type: SET_ANNOTATION_STATE_MANAGER,
  payload,
});
export const addNewClassLabel = (payload: AddNewClassLabelProps) => ({
  type: ADD_NEW_CLASS_LABEL,
  payload,
});
export const saveRemoteNewClassLabel = (payload: AddNewClassLabelProps) => ({
  type: SAVE_REMOTE_NEW_CLASS_LABEL.REQUESTED,
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
export const fetchingFileAndAnnotaiton = (
  payload: FetchingFileAndAnnotaitonProps
) => ({
  type: FETCH_FILE_AND_ANNOTATION,
  payload,
});
