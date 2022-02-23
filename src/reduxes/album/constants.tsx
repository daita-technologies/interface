import { asyncAction } from "utils/general";

export const FETCH_IMAGES = asyncAction("FETCH_IMAGES");
export const LOAD_IMAGE_CONTENT = asyncAction("LOAD_IMAGE_CONTENT");

export const ADD_IMAGE_TO_ALBUM_FROM_FILE = "ADD_IMAGE_TO_ALBUM_FROM_FILE";
export const RESET_ALBUM_STATE = "RESET_ALBUM_STATE";

export const CHANGE_ACTIVE_IMAGES_TAB = "CHANGE_ACTIVE_IMAGES_TAB";

export const ALBUM_VIEW_MODE = "ALBUM_VIEW_MODE";
export const ALBUM_SELECT_MODE = "ALBUM_SELECT_MODE";

export const CHANGE_ALBUM_MODE = "CHANGE_ALBUM_MODE";
export const SELECT_IMAGE = "SELECT_IMAGE";
export const UNSELECT_IMAGE = "UNSELECT_IMAGE";

export const RESET_SELECTED_LIST = "RESET_SELECTED_LIST";

export const DELETE_IMAGES = asyncAction("DELETE_IMAGES");
