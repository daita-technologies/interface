export interface HandleFileType {
  name: string;
  file: File;
  status: string;
  uploadProgress?: number;
  error?: string;
  sizeOld?: string;
}

export interface UploadFilesType {
  [fileName: string]: HandleFileType;
}

export interface ExistFileResponseType {
  filename: string;
  size: string;
}

export interface UploadState {
  files: UploadFilesType;
  isCheckingFile: boolean;
  errorMessage: string;
  isOpenDuplicateModal: boolean;
  totalUploadFileQuantity: number | null;
}

export interface CheckFileUploadParams {
  idToken: string;
  projectId: string;
  projectName: string;
  listFileName: Array<string>;
}

export interface UploadFileParams {
  fileName: string;
  projectId: string;
  projectName: string;
  isExist: boolean;
  isReplace?: boolean;
  isReplaceSingle?: boolean;
}

export interface ExistFileInfoPayload {
  existFileInfo: Array<ExistFileResponseType>;
}

export interface CheckingFileFailedPayload {
  errorMessage: string;
}

export interface UpdateStatusFileArrayPayload {
  fileArray: string[];
  targetStatus: string;
  isClearError?: boolean;
}

export interface SetIsOpenDuplicateModalPayload {
  isOpen: boolean;
}

export interface ClearFileArrayPayload {
  fileNameArray: Array<string>;
}

export interface SetTotalUploadFileQuantityPayload {
  totalUploadFileQuantity: null | number;
}
