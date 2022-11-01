import {
  ADDED_UPLOAD_FILE_STATUS,
  CHECKING_UPLOAD_FILE_STATUS,
  FAILED_UPLOAD_FILE_STATUS,
  INVALID_FILE_STATUS,
  QUEUEING_UPLOAD_FILE_STATUS,
  UPLOADED_UPLOAD_FILE_STATUS,
  UPLOADING_UPLOAD_FILE_STATUS,
} from "constants/uploadFile";
import { RootState } from "reduxes";

export const selectorUploadFilesAnnotationProject = (state: RootState) =>
  state.uploadAnnotationImageReducer.files;

export const selectorIsUploadingAnnotationProject = (state: RootState) =>
  state.uploadAnnotationImageReducer.totalUploadFileQuantity !== null &&
  state.uploadAnnotationImageReducer.totalUploadFileQuantity > 0;

export const selectorIsCheckingAnnotationProject = (state: RootState) => {
  const { files } = state.uploadAnnotationImageReducer;
  const keyArray = Object.keys(files);

  if (keyArray.length > 0) {
    return keyArray.some(
      (fileName: string) =>
        !!(files[fileName].status === CHECKING_UPLOAD_FILE_STATUS)
    );
  }

  return false;
};

export const selectorUploadErrorMessageAnnotationProject = (state: RootState) =>
  state.uploadAnnotationImageReducer.errorMessage;

export const selectorAddedStatusFileCountAnnotationProject = (
  state: RootState
) =>
  Object.keys(state.uploadAnnotationImageReducer.files).filter(
    (fileName: string) =>
      state.uploadAnnotationImageReducer.files[fileName].status ===
      ADDED_UPLOAD_FILE_STATUS
  ).length || 0;

export const selectorUploadingFileCountAnnotationProject = (state: RootState) =>
  Object.keys(state.uploadAnnotationImageReducer.files).filter(
    (fileName: string) =>
      state.uploadAnnotationImageReducer.files[fileName].status ===
      UPLOADING_UPLOAD_FILE_STATUS
  ).length || 0;

export const selectorUploadedFileCountAnnotationProject = (state: RootState) =>
  Object.keys(state.uploadAnnotationImageReducer.files).filter(
    (fileName: string) =>
      state.uploadAnnotationImageReducer.files[fileName].status ===
      UPLOADED_UPLOAD_FILE_STATUS
  ).length || 0;

export const selectorQueueingFileCountAnnotationProject = (state: RootState) =>
  Object.keys(state.uploadAnnotationImageReducer.files).filter(
    (fileName: string) =>
      state.uploadAnnotationImageReducer.files[fileName].status ===
      QUEUEING_UPLOAD_FILE_STATUS
  ).length || 0;
export const selectorFailAndInvalidFileCountAnnotationProject = (
  state: RootState
) =>
  Object.keys(state.uploadAnnotationImageReducer.files).filter(
    (fileName: string) =>
      state.uploadAnnotationImageReducer.files[fileName].status ===
        INVALID_FILE_STATUS ||
      state.uploadAnnotationImageReducer.files[fileName].status ===
        FAILED_UPLOAD_FILE_STATUS
  ).length || 0;
export const selectorIsOpenDuplicateModalAnnotationProject = (
  state: RootState
) => state.uploadAnnotationImageReducer.isOpenDuplicateModal;

export const selectorTotalUploadFileQuantityAnnotationProject = (
  state: RootState
) => state.uploadAnnotationImageReducer.totalUploadFileQuantity;
