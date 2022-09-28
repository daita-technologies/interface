import { FAILED_UPLOAD_FILE_STATUS } from "constants/uploadFile";
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
  UPDATE_FILE_ANNOTATION_PROJECT,
  UPDATE_FILES_ANNOTATION_PROJECT,
  UPDATE_STATUS_FILE_ARRAY_ANNOTATION_PROJECT,
  UPLOAD_FILE_ANNOTATION_PROJECT,
} from "./constants";
import {
  CheckingFileFailedPayload,
  ExistFileInfoPayload,
  ExistFileResponseType,
  UploadState,
  UpdateStatusFileArrayPayload,
  SetIsOpenDuplicateModalPayload,
  ClearFileArrayPayload,
  SetTotalUploadFileQuantityPayload,
} from "reduxes/upload/type";

const inititalState: UploadState = {
  files: {},
  isCheckingFile: false,
  errorMessage: "",
  isOpenDuplicateModal: false,
  totalUploadFileQuantity: null,
};

const uploadReducer = (state = inititalState, action: any): UploadState => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case UPLOAD_FILE_ANNOTATION_PROJECT.REQUESTED:
      return { ...state, ...payload };
    case ADD_FILE_ANNOTATION_PROJECT: {
      return {
        ...state,
        files: { ...state.files, ...payload.files },
      };
    }
    case UPDATE_FILE_ANNOTATION_PROJECT: {
      const { files } = state;
      if (files[payload.fileName]) {
        files[payload.fileName] = {
          ...files[payload.fileName],
          ...payload.updateInfo,
        };
        return { ...state, files: { ...files } };
      }
      return state;
    }
    case UPDATE_FILES_ANNOTATION_PROJECT: {
      const { fileNames, updateInfo } = payload;
      const { files } = state;
      fileNames.forEach((fileName: string) => {
        if (files[fileName]) {
          files[fileName] = {
            ...files[fileName],
            ...updateInfo,
          };
        }
      });
      return {
        ...state,
        files: { ...files },
      };
    }
    case UPDATE_STATUS_FILE_ARRAY_ANNOTATION_PROJECT: {
      const { fileArray, targetStatus, isClearError } =
        payload as UpdateStatusFileArrayPayload;
      const newStateFiles = { ...state.files };
      fileArray.forEach((fileName: string) => {
        newStateFiles[fileName].status = targetStatus;
        if (isClearError) {
          newStateFiles[fileName].error = undefined;
        }
      });
      return {
        ...state,
        files: newStateFiles,
      };
    }
    case DELETE_FILE_ANNOTATION_PROJECT: {
      const copyFiles = { ...state.files };
      delete copyFiles[payload.fileName];
      return {
        ...state,
        totalUploadFileQuantity: state.totalUploadFileQuantity
          ? state.totalUploadFileQuantity - 1
          : null,
        files: { ...copyFiles },
      };
    }
    case CHECK_FILES_ANNOTATION_PROJECT.REQUESTED:
      return {
        ...state,
        errorMessage: "",
        isCheckingFile: true,
      };
    case CHECK_FILES_ANNOTATION_PROJECT.FAILED: {
      const { errorMessage } = payload as CheckingFileFailedPayload;
      return {
        ...state,
        errorMessage,
      };
    }
    case CHECK_FILES_ANNOTATION_PROJECT.SUCCEEDED:
      return {
        ...state,
        isCheckingFile: false,
      };
    case NOTIFY_EXIST_FILES_ANNOTATION_PROJECT: {
      const { existFileInfo } = payload as ExistFileInfoPayload;
      const copyFilesForExist = { ...state.files };
      existFileInfo.forEach((existFile: ExistFileResponseType) => {
        copyFilesForExist[existFile.filename] = {
          ...copyFilesForExist[existFile.filename],
          error: "File already exists.",
          status: FAILED_UPLOAD_FILE_STATUS,
          sizeOld: existFile.size,
        };
      });
      return {
        ...state,
        files: { ...copyFilesForExist },
      };
    }
    case RESET_UPLOAD_STATE_ANNOTATION_PROJECT:
    case CLEAR_ALL_FILE_ANNOTATION_PROJECT:
      return inititalState;
    case CLEAR_FILE_ARRAY_ANNOTATION_PROJECT: {
      const { fileNameArray } = payload as ClearFileArrayPayload;
      const copyFiles = { ...state.files };
      fileNameArray.forEach((fileName: string) => {
        delete copyFiles[fileName];
      });
      return {
        ...state,
        files: copyFiles,
      };
    }
    case SET_IS_OPEN_DUPLICATE_MODAL_ANNOTATION_PROJECT: {
      const { isOpen } = payload as SetIsOpenDuplicateModalPayload;
      return {
        ...state,
        isOpenDuplicateModal: isOpen,
      };
    }
    case SET_TOTAL_UPLOAD_FILE_ANNOTATION_PROJECT: {
      const { totalUploadFileQuantity } =
        payload as SetTotalUploadFileQuantityPayload;
      return {
        ...state,
        totalUploadFileQuantity,
      };
    }
    default:
      return state;
  }
};

export default uploadReducer;
