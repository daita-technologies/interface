import { asyncAction } from "utils/general";

export const UPLOAD_FILE_ANNOTATION_PROJECT = asyncAction(
  "UPLOAD_FILE_ANNOTATION_PROJECT"
);
export const CHECK_FILES_ANNOTATION_PROJECT = asyncAction(
  "CHECK_FILES_ANNOTATION_PROJECT"
);
export const ADD_FILE_ANNOTATION_PROJECT = "ADD_FILE_ANNOTATION_PROJECT";
export const UPDATE_FILE_ANNOTATION_PROJECT = "UPDATE_FILE_ANNOTATION_PROJECT";
export const UPDATE_FILES_ANNOTATION_PROJECT =
  "UPDATE_FILES_ANNOTATION_PROJECT";
export const CLEAR_ALL_FILE_ANNOTATION_PROJECT =
  "CLEAR_ALL_FILE_ANNOTATION_PROJECT";
export const CLEAR_FILE_ARRAY_ANNOTATION_PROJECT =
  "CLEAR_FILE_ARRAY_ANNOTATION_PROJECT";
export const UPDATE_STATUS_FILE_ARRAY_ANNOTATION_PROJECT =
  "UPDATE_STATUS_FILE_ARRAY_ANNOTATION_PROJECT";
export const DELETE_FILE_ANNOTATION_PROJECT = "DELETE_FILE_ANNOTATION_PROJECT";

export const UPDATE_UPLOAD_TO_BACKEND_ANNOTATION_PROJECT = asyncAction(
  "UPDATE_UPLOAD_TO_BACKEND_ANNOTATION_PROJECT"
);

export const NOTIFY_EXIST_FILES_ANNOTATION_PROJECT =
  "NOTIFY_EXIST_FILES_ANNOTATION_PROJECT";

export const RESET_UPLOAD_STATE_ANNOTATION_PROJECT =
  "RESET_UPLOAD_STATE_ANNOTATION_PROJECT";

export const SET_IS_OPEN_DUPLICATE_MODAL_ANNOTATION_PROJECT =
  "SET_IS_OPEN_DUPLICATE_MODAL_ANNOTATION_PROJECT";
export const SET_TOTAL_UPLOAD_FILE_ANNOTATION_PROJECT =
  "SET_TOTAL_UPLOAD_FILE_ANNOTATION_PROJECT";