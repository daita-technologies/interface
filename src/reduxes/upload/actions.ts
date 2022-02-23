import {
  ADD_FILE,
  CHECK_FILES,
  CLEAR_ALL_FILE,
  CLEAR_FILE_ARRAY,
  DELETE_FILE,
  NOTIFY_EXIST_FILES,
  RESET_UPLOAD_STATE,
  SET_IS_OPEN_DUPLICATE_MODAL,
  SET_TOTAL_UPLOAD_FILE,
  UPDATE_FILE,
  UPDATE_STATUS_FILE_ARRAY,
  UPLOAD_FILE,
} from "./constants";
import {
  CheckFileUploadParams,
  ClearFileArrayPayload,
  ExistFileInfoPayload,
  SetIsOpenDuplicateModalPayload,
  SetTotalUploadFileQuantityPayload,
  UpdateStatusFileArrayPayload,
  UploadFileParams,
  UploadFilesType,
} from "./type";

export const addFile = (payload: { files: UploadFilesType }) => ({
  type: ADD_FILE,
  payload,
});

export const updateFile = (payload: {
  fileName: string;
  updateInfo: { [field: string]: any };
}) => ({
  type: UPDATE_FILE,
  payload,
});

export const clearAllFile = () => ({
  type: CLEAR_ALL_FILE,
});

export const clearFileArray = (payload: ClearFileArrayPayload) => ({
  type: CLEAR_FILE_ARRAY,
  payload,
});

export const updateStatusFileArray = (
  payload: UpdateStatusFileArrayPayload
) => ({
  type: UPDATE_STATUS_FILE_ARRAY,
  payload,
});

export const deleteFile = (payload: { fileName: string }) => ({
  type: DELETE_FILE,
  payload,
});

export const notifyExistFile = (payload: ExistFileInfoPayload) => ({
  type: NOTIFY_EXIST_FILES,
  payload,
});

export const checkFileUpload = (payload: CheckFileUploadParams) => ({
  type: CHECK_FILES.REQUESTED,
  payload,
});

export const uploadFile = (payload: UploadFileParams) => ({
  type: UPLOAD_FILE.REQUESTED,
  payload,
});

export const resetUploadState = () => ({
  type: RESET_UPLOAD_STATE,
});

export const setIsOpenDuplicateModal = (
  payload: SetIsOpenDuplicateModalPayload
) => ({ type: SET_IS_OPEN_DUPLICATE_MODAL, payload });

export const setTotalUploadFileQuantity = (
  payload: SetTotalUploadFileQuantityPayload
) => ({
  type: SET_TOTAL_UPLOAD_FILE,
  payload,
});
