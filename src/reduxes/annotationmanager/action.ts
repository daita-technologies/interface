import {
  ADD_IMAGES,
  ADD_NEW_CLASS_LABEL,
  CHANGE_PREVIEW_IMAGE,
  EDIT_CLASS_LABEL,
  EDIT_CLASS_MANAGE_MODAL,
  FETCH_FILE_AND_ANNOTATION,
  RESET_ANNOTATION_MANAGER,
  SAVE_ANNOTATION_STATE_MANAGER,
  SAVE_REMOTE_NEW_CLASS_LABEL,
  SET_ANNOTATION_STATE_MANAGER,
  SET_CLIENT_RECT_OF_BASE_IMAGE,
  SET_CLASS_MANAGE_MODAL,
  SET_PREVIEW_IMAGE,
  ADD_NEW_CLASS_LABEL_LOCAL,
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
  SetClientRectOfBaseImageProps,
} from "./type";

export const addImagesToAnnotation = (payload: AddImageToAnnotationProps) => ({
  type: ADD_IMAGES,
  payload,
});
export const requestChangePreviewImage = (
  payload: ChangePreviewImageProps
) => ({
  type: CHANGE_PREVIEW_IMAGE.REQUESTED,
  payload,
});
export const requestChangePreviewImageSuccess = () => ({
  type: CHANGE_PREVIEW_IMAGE.SUCCEEDED,
});
export const requestChangePreviewImageFail = () => ({
  type: CHANGE_PREVIEW_IMAGE.FAILED,
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
export const addNewClassLabelLocal = (payload: AddNewClassLabelProps) => ({
  type: ADD_NEW_CLASS_LABEL_LOCAL,
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
export const resetAnnotationManager = () => ({
  type: RESET_ANNOTATION_MANAGER,
});
export const setClientRectOfBaseImage = (
  payload: SetClientRectOfBaseImageProps
) => ({
  type: SET_CLIENT_RECT_OF_BASE_IMAGE,
  payload,
});
