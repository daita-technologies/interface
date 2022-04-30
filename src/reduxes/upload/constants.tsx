import { asyncAction } from "utils/general";

export const UPLOAD_FILE = asyncAction("UPLOAD_FILE");
export const CHECK_FILES = asyncAction("CHECK_FILES");
export const ADD_FILE = "ADD_FILE";
export const UPDATE_FILE = "UPDATE_FILE";
export const UPDATE_FILES = "UPDATE_FILES";
export const CLEAR_ALL_FILE = "CLEAR_ALL_FILE";
export const CLEAR_FILE_ARRAY = "CLEAR_FILE_ARRAY";
export const UPDATE_STATUS_FILE_ARRAY = "UPDATE_STATUS_FILE_ARRAY";
export const DELETE_FILE = "DELETE_FILE";

export const UPDATE_UPLOAD_TO_BACKEND = asyncAction("UPDATE_UPLOAD_TO_BACKEND");

export const NOTIFY_EXIST_FILES = "NOTIFY_EXIST_FILES";

export const RESET_UPLOAD_STATE = "RESET_UPLOAD_STATE";

export const SET_IS_OPEN_DUPLICATE_MODAL = "SET_IS_OPEN_DUPLICATE_MODAL";
export const SET_TOTAL_UPLOAD_FILE = "SET_TOTAL_UPLOAD_FILE";
