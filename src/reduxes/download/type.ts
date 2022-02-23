import {
  FINISH_DOWRUNNING_DOWNLOAD_EC2_ZIP_PROGRESS_TYPENLOAD_TYPE,
  RUNNING_DOWNLOAD_EC2_ZIP_PROGRESS_TYPE,
} from "constants/defaultValues";
import {
  AlbumImagesFields,
  ImageSourceType,
  NextTokenType,
} from "reduxes/album/type";

export interface DownloadImageFields {
  filename: string;
  s3_key: string;
  photoKey: string;
  blob: Blob;
  size?: number;
}

export interface DownloadFilesType {
  [fileName: string]: {
    name: string;
    size: number | string;
    [other: string]: any;
  };
}

export interface DownloadReducer {
  isZipping: boolean | null;
  isZippingSelectedFiles: boolean | null;
  isDownloading: boolean | null;
  isDownloadingZipEc2: boolean;
  downloadZipEc2TaskId: undefined | string;
  isDownloadingSelectedFiles: boolean | null;
  images: AlbumImagesFields;
  nextToken: "" | NextTokenType;
  totalSelectedFilesNeedDownload: null | number;
  totalNeedDownload: null | number;
  currentProjectIdDownloading: string | null;
}

export interface FetchToDownload {
  targetActionToDownload: boolean;
}

export interface DownloadSelectedFilesPayload {
  selectedList: Array<string>;
  projectId: string;
}

export interface ZipFilesPayload {
  projectId: string;
  projectName: string;
  isDownloadSelectedFiles?: boolean;
}

export interface DownloadAllFilesPayload {
  idToken: string;
  projectId: string;
  targetImageSource?: ImageSourceType;
}

export interface DownloadZipEc2CreateSucceedPayload {
  taskId: string;
}

export interface DownloadZipEc2ProgressSucceedPayload {
  status:
    | typeof RUNNING_DOWNLOAD_EC2_ZIP_PROGRESS_TYPE
    | typeof FINISH_DOWRUNNING_DOWNLOAD_EC2_ZIP_PROGRESS_TYPENLOAD_TYPE;
  s3_key: string;
  presign_url: string;
}
