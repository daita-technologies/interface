import { RootState } from "reduxes";

export const selectorCurrentProjectIdDownloading = (state: RootState) =>
  state.downloadReducer.currentProjectIdDownloading;
export const selectorDownloadImages = (state: RootState) =>
  state.downloadReducer.images;
export const selectorDownloadImagesLength = (state: RootState) =>
  Object.keys(state.downloadReducer.images).length;
export const selectorIsDownloading = (state: RootState) =>
  state.downloadReducer.isDownloading;
export const selectorIsZipping = (state: RootState) =>
  state.downloadReducer.isZipping;

export const selectorTotalNeedDownload = (state: RootState) =>
  state.downloadReducer.totalNeedDownload;

export const selectorIsDownloadingSelectedFiles = (state: RootState) =>
  state.downloadReducer.isDownloadingSelectedFiles;
export const selectorTotalSelectedFilesNeedDownload = (state: RootState) =>
  state.downloadReducer.totalSelectedFilesNeedDownload;
export const selectorIsZippingSelectedFiles = (state: RootState) =>
  state.downloadReducer.isZippingSelectedFiles;
export const selectorIsDownloadingZipEc2 = (state: RootState) =>
  state.downloadReducer.isDownloadingZipEc2;

export const selectorDownloadZipEc2TaskId = (state: RootState) =>
  state.downloadReducer.downloadZipEc2TaskId;
