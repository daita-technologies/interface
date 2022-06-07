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

export const selectorUploadFiles = (state: RootState) =>
  state.uploadReducer.files;

// export const selectorIsUploading = (state: RootState) => {
//   const { files } = state.uploadReducer;
//   const keyArray = Object.keys(files);

//   if (keyArray.length > 0) {
//     return keyArray.some(
//       (fileName: string) =>
//         !!(files[fileName].status === UPLOADING_UPLOAD_FILE_STATUS)
//     );
//   }

//   return false;
// };

export const selectorIsUploading = (state: RootState) =>
  state.uploadReducer.totalUploadFileQuantity !== null &&
  state.uploadReducer.totalUploadFileQuantity > 0;

export const selectorIsChecking = (state: RootState) => {
  const { files } = state.uploadReducer;
  const keyArray = Object.keys(files);

  if (keyArray.length > 0) {
    return keyArray.some(
      (fileName: string) =>
        !!(files[fileName].status === CHECKING_UPLOAD_FILE_STATUS)
    );
  }

  return false;
};

export const selectorUploadErrorMessage = (state: RootState) =>
  state.uploadReducer.errorMessage;

export const selectorAddedStatusFileCount = (state: RootState) =>
  Object.keys(state.uploadReducer.files).filter(
    (fileName: string) =>
      state.uploadReducer.files[fileName].status === ADDED_UPLOAD_FILE_STATUS
  ).length || 0;

export const selectorUploadingFileCount = (state: RootState) =>
  Object.keys(state.uploadReducer.files).filter(
    (fileName: string) =>
      state.uploadReducer.files[fileName].status ===
      UPLOADING_UPLOAD_FILE_STATUS
  ).length || 0;

export const selectorUploadedFileCount = (state: RootState) =>
  Object.keys(state.uploadReducer.files).filter(
    (fileName: string) =>
      state.uploadReducer.files[fileName].status === UPLOADED_UPLOAD_FILE_STATUS
  ).length || 0;

export const selectorQueueingFileCount = (state: RootState) =>
  Object.keys(state.uploadReducer.files).filter(
    (fileName: string) =>
      state.uploadReducer.files[fileName].status === QUEUEING_UPLOAD_FILE_STATUS
  ).length || 0;
export const selectorFailAndInvalidFileCount = (state: RootState) =>
  Object.keys(state.uploadReducer.files).filter(
    (fileName: string) =>
      state.uploadReducer.files[fileName].status === INVALID_FILE_STATUS ||
      state.uploadReducer.files[fileName].status === FAILED_UPLOAD_FILE_STATUS
  ).length || 0;
export const selectorIsOpenDuplicateModal = (state: RootState) =>
  state.uploadReducer.isOpenDuplicateModal;

export const selectorTotalUploadFileQuantity = (state: RootState) =>
  state.uploadReducer.totalUploadFileQuantity;
