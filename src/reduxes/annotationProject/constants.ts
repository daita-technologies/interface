import { asyncAction } from "utils/general";

export const CLONE_PROJECT_TO_ANNOTATION = asyncAction(
  "CLONE_PROJECT_TO_ANNOTATION"
);
export const SHOW_DIALOG_CLONE_PROJECT_TO_ANNOTATION =
  "SHOW_DIALOG_CLONE_PROJECT_TO_ANNOTATION";
export const SET_CURRENT_ANNOTATION_PROJECT = "SET_CURRENT_ANNOTATION_PROJECT";
export const FETCH_LIST_ANNOTATION_PROJECTS = asyncAction(
  "FETCH_LIST_ANNOTATION_PROJECTS"
);
export const FETCH_DETAIL_ANNOTATION_PROJECT = asyncAction(
  "FETCH_DETAIL_ANNOTATION_PROJECT"
);
export const FETCH_ANNOTATION_AND_FILE_INFO = asyncAction(
  "FETCH_ANNOTATION_AND_FILE_INFO"
);
export const FETCH_ANNOTATION_FILES = asyncAction("FETCH_ANNOTATION_FILES");
