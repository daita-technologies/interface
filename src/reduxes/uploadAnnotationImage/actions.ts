import {
  CheckFileUploadParams,
  ClearFileArrayPayload,
  ExistFileInfoPayload,
  SetIsOpenDuplicateModalPayload,
  SetTotalUploadFileQuantityPayload,
  UpdateStatusFileArrayPayload,
  UploadFileParams,
  UploadFilesType,
} from "reduxes/upload/type";
import {
  ADD_FILE_ANNOTATION_PROJECT,
  CHECK_FILES_ANNOTATION_PROJECT,
  CLEAR_ALL_FILE_ANNOTATION_PROJECT,
  CLEAR_FILE_ARRAY_ANNOTATION_PROJECT,
  DELETE_FILE_ANNOTATION_PROJECT,
  NOTIFY_EXIST_FILES_ANNOTATION_PROJECT,
  RESET_UPLOAD_STATE_ANNOTATION_PROJECT,
  SET_IS_OPEN_DUPLICATE_MODAL_ANNOTATION_PROJECT,
  SET_TOTAL_UPLOAD_FILE_ANNOTATION_PROJECT,
  UPDATE_FILES_ANNOTATION_PROJECT,
  UPDATE_FILE_ANNOTATION_PROJECT,
  UPDATE_STATUS_FILE_ARRAY_ANNOTATION_PROJECT,
  UPLOAD_FILE_ANNOTATION_PROJECT,
} from "./constants";

export const addFileAnnotationProject = (payload: {
  files: UploadFilesType;
}) => ({
  type: ADD_FILE_ANNOTATION_PROJECT,
  payload,
});

export const updateFileAnnotationProject = (payload: {
  fileName: string;
  updateInfo: { [field: string]: any };
}) => ({
  type: UPDATE_FILE_ANNOTATION_PROJECT,
  payload,
});
export const updateFilesAnnotationProject = (payload: {
  fileNames: string[];
  updateInfo: { [field: string]: any };
}) => ({
  type: UPDATE_FILES_ANNOTATION_PROJECT,
  payload,
});

export const clearAllFileAnnotationProject = () => ({
  type: CLEAR_ALL_FILE_ANNOTATION_PROJECT,
});

export const clearFileArrayAnnotationProject = (
  payload: ClearFileArrayPayload
) => ({
  type: CLEAR_FILE_ARRAY_ANNOTATION_PROJECT,
  payload,
});

export const updateStatusFileArrayAnnotationProject = (
  payload: UpdateStatusFileArrayPayload
) => ({
  type: UPDATE_STATUS_FILE_ARRAY_ANNOTATION_PROJECT,
  payload,
});

export const deleteFileAnnotationProject = (payload: { fileName: string }) => ({
  type: DELETE_FILE_ANNOTATION_PROJECT,
  payload,
});

export const notifyExistFileAnnotationProject = (
  payload: ExistFileInfoPayload
) => ({
  type: NOTIFY_EXIST_FILES_ANNOTATION_PROJECT,
  payload,
});

export const checkFileUploadAnnotationProject = (
  payload: CheckFileUploadParams
) => ({
  type: CHECK_FILES_ANNOTATION_PROJECT.REQUESTED,
  payload,
});

export const uploadFileAnnotationProject = (payload: UploadFileParams) => ({
  type: UPLOAD_FILE_ANNOTATION_PROJECT.REQUESTED,
  payload,
});

export const resetUploadStateAnnotationProject = () => ({
  type: RESET_UPLOAD_STATE_ANNOTATION_PROJECT,
});

export const setIsOpenDuplicateModalAnnotationProject = (
  payload: SetIsOpenDuplicateModalPayload
) => ({
  type: SET_IS_OPEN_DUPLICATE_MODAL_ANNOTATION_PROJECT,
  payload,
});

export const setTotalUploadFileQuantityAnnotationProject = (
  payload: SetTotalUploadFileQuantityPayload
) => ({
  type: SET_TOTAL_UPLOAD_FILE_ANNOTATION_PROJECT,
  payload,
});
