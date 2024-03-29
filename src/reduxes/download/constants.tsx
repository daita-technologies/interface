import { asyncAction } from "utils/general";

export const FETCH_IMAGES_TO_DOWNLOAD = asyncAction("FETCH_IMAGES_TO_DOWNLOAD");
export const LOAD_IMAGE_CONTENT_TO_DOWNLOAD = asyncAction(
  "LOAD_IMAGE_CONTENT_TO_DOWNLOAD"
);

export const ZIP_ALL_FILES = asyncAction("ZIP_ALL_FILES");
export const ZIP_SELECTED_FILES = asyncAction("ZIP_SELECTED_FILES");
export const DOWNLOAD_ALL_FILES = asyncAction("DOWNLOAD_ALL_FILES");
export const DOWNLOAD_SELECTED_FILES = asyncAction("DOWNLOAD_SELECTED_FILES");
export const GET_FILE_TO_DOWNLOAD = asyncAction("GET_FILE_TO_DOWNLOAD");
export const UPDATE_TOTAL_NEED_DOWNLOAD = "UPDATE_TOTAL_NEED_DOWNLOAD";
export const UPDATE_TOTAL_SELECTED_FILES_NEED_DOWNLOAD =
  "UPDATE_TOTAL_SELECTED_FILES_NEED_DOWNLOAD";
export const RESET_DOWNLOAD_STATE = "RESET_DOWNLOAD_STATE";

export const DOWNLOAD_ZIP_EC2 = asyncAction("DOWNLOAD_ZIP_EC2");
export const DOWNLOAD_ZIP_EC2_CREATE = asyncAction("DOWNLOAD_ZIP_EC2_CREATE");
export const DOWNLOAD_ZIP_EC2_PROGRESS = asyncAction(
  "DOWNLOAD_ZIP_EC2_PROGRESS"
);
