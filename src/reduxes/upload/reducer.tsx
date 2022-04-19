import { FAILED_UPLOAD_FILE_STATUS } from "constants/uploadFile";
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
  UPDATE_FILES,
  UPDATE_STATUS_FILE_ARRAY,
  UPLOAD_FILE,
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
} from "./type";

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
    case UPLOAD_FILE.REQUESTED:
      return { ...state, ...payload };
    case ADD_FILE: {
      return {
        ...state,
        files: { ...state.files, ...payload.files },
      };
    }
    case UPDATE_FILE: {
      const { files } = state;
      files[payload.fileName] = {
        ...files[payload.fileName],
        ...payload.updateInfo,
      };
      return { ...state, files };
    }
    case UPDATE_FILES: {
      const { fileNames, updateInfo } = payload;
      const { files } = state;
      fileNames.forEach((fileName: string) => {
        files[fileName] = {
          ...files[fileName],
          ...updateInfo,
        };
      });
      return {
        ...state,
        files,
      };
    }
    case UPDATE_STATUS_FILE_ARRAY: {
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
    case DELETE_FILE: {
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
    case CHECK_FILES.REQUESTED:
      return {
        ...state,
        errorMessage: "",
        isCheckingFile: true,
      };
    case CHECK_FILES.FAILED: {
      const { errorMessage } = payload as CheckingFileFailedPayload;
      return {
        ...state,
        errorMessage,
      };
    }
    case CHECK_FILES.SUCCEEDED:
      return {
        ...state,
        isCheckingFile: false,
      };
    case NOTIFY_EXIST_FILES: {
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
    case RESET_UPLOAD_STATE:
    case CLEAR_ALL_FILE:
      return inititalState;
    case CLEAR_FILE_ARRAY: {
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
    case SET_IS_OPEN_DUPLICATE_MODAL: {
      const { isOpen } = payload as SetIsOpenDuplicateModalPayload;
      return {
        ...state,
        isOpenDuplicateModal: isOpen,
      };
    }
    case SET_TOTAL_UPLOAD_FILE: {
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
