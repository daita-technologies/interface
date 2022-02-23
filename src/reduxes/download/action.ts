import {
  DownloadZipEc2Params,
  DownloadZipEc2Progress,
} from "services/downloadApi";
import {
  DOWNLOAD_ALL_FILES,
  DOWNLOAD_SELECTED_FILES,
  DOWNLOAD_ZIP_EC2,
  DOWNLOAD_ZIP_EC2_CREATE,
  DOWNLOAD_ZIP_EC2_PROGRESS,
  UPDATE_TOTAL_NEED_DOWNLOAD,
  UPDATE_TOTAL_SELECTED_FILES_NEED_DOWNLOAD,
  ZIP_ALL_FILES,
  ZIP_SELECTED_FILES,
} from "./constants";
import {
  DownloadAllFilesPayload,
  DownloadSelectedFilesPayload,
  ZipFilesPayload,
} from "./type";

export const downloadAllFiles = (payload: DownloadAllFilesPayload) => ({
  type: DOWNLOAD_ALL_FILES.REQUESTED,
  payload,
});

export const downloadSelectedFiles = (
  payload: DownloadSelectedFilesPayload
) => ({
  type: DOWNLOAD_SELECTED_FILES.REQUESTED,
  payload,
});

export const zipAllFiles = (payload: ZipFilesPayload) => ({
  type: ZIP_ALL_FILES.REQUESTED,
  payload,
});

export const zipSelectedFiles = (payload: ZipFilesPayload) => ({
  type: ZIP_SELECTED_FILES.REQUESTED,
  payload,
});

export const updateTotalNeedDownload = (payload: {
  totalNeedDownload: number | null;
}) => ({
  type: UPDATE_TOTAL_NEED_DOWNLOAD,
  payload,
});

export const updateTotalSelectedFilesNeedDownload = (payload: {
  totalNeedDownload: number | null;
}) => ({
  type: UPDATE_TOTAL_SELECTED_FILES_NEED_DOWNLOAD,
  payload,
});

export const downloadZipEc2 = (payload: DownloadZipEc2Params) => ({
  type: DOWNLOAD_ZIP_EC2.REQUESTED,
  payload,
});

export const downloadZipEc2Create = (payload: DownloadZipEc2Params) => ({
  type: DOWNLOAD_ZIP_EC2_CREATE.REQUESTED,
  payload,
});

export const downloadZipEc2Progress = (payload: DownloadZipEc2Progress) => ({
  type: DOWNLOAD_ZIP_EC2_PROGRESS.REQUESTED,
  payload,
});
