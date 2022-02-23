import {
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD2,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD3,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD4,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD5,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD6,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD7,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD8,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD9,
} from "reduxes/download/constants";
import {
  ADD_IMAGE_TO_ALBUM_FROM_FILE,
  CHANGE_ACTIVE_IMAGES_TAB,
  CHANGE_ALBUM_MODE,
  DELETE_IMAGES,
  FETCH_IMAGES,
  LOAD_IMAGE_CONTENT,
  RESET_ALBUM_STATE,
  RESET_SELECTED_LIST,
  SELECT_IMAGE,
  UNSELECT_IMAGE,
} from "./constants";
import {
  ChangeActiveImagesTabIdPayload,
  ChangeAlbumModePayload,
  DeleteImagePayload,
  FetchImagesParams,
  ImageApiFields,
  LoadImageContentPayload,
  SelectImagePayload,
  UnselectImagePayload,
} from "./type";

export const fetchImages = (payload: FetchImagesParams) => ({
  type: FETCH_IMAGES.REQUESTED,
  payload,
});

export const loadImageContent = (payload: LoadImageContentPayload) => ({
  type: LOAD_IMAGE_CONTENT.REQUESTED,
  payload,
});

export const loadImageContentToDownload = (
  payload: LoadImageContentPayload
) => ({
  type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD.REQUESTED,
  payload,
});
export const loadImageContentToDownload2 = (
  payload: LoadImageContentPayload
) => ({
  type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD2.REQUESTED,
  payload,
});
export const loadImageContentToDownload3 = (
  payload: LoadImageContentPayload
) => ({
  type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD3.REQUESTED,
  payload,
});
export const loadImageContentToDownload4 = (
  payload: LoadImageContentPayload
) => ({
  type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD4.REQUESTED,
  payload,
});
export const loadImageContentToDownload5 = (
  payload: LoadImageContentPayload
) => ({
  type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD5.REQUESTED,
  payload,
});
export const loadImageContentToDownload6 = (
  payload: LoadImageContentPayload
) => ({
  type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD6.REQUESTED,
  payload,
});
export const loadImageContentToDownload7 = (
  payload: LoadImageContentPayload
) => ({
  type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD7.REQUESTED,
  payload,
});
export const loadImageContentToDownload8 = (
  payload: LoadImageContentPayload
) => ({
  type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD8.REQUESTED,
  payload,
});
export const loadImageContentToDownload9 = (
  payload: LoadImageContentPayload
) => ({
  type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD9.REQUESTED,
  payload,
});

export const addImageToAlbumFromFile = (payload: ImageApiFields) => ({
  type: ADD_IMAGE_TO_ALBUM_FROM_FILE,
  payload,
});

export const resetAlbumState = () => ({
  type: RESET_ALBUM_STATE,
});

export const changeActiveImagesTab = (
  payload: ChangeActiveImagesTabIdPayload
) => ({
  type: CHANGE_ACTIVE_IMAGES_TAB,
  payload,
});

export const changeAlbumMode = (payload: ChangeAlbumModePayload) => ({
  type: CHANGE_ALBUM_MODE,
  payload,
});

export const selectImage = (payload: SelectImagePayload) => ({
  type: SELECT_IMAGE,
  payload,
});

export const unselectImage = (payload: UnselectImagePayload) => ({
  type: UNSELECT_IMAGE,
  payload,
});

export const deleteImages = (payload: DeleteImagePayload) => ({
  type: DELETE_IMAGES.REQUESTED,
  payload,
});

export const resetSelectedList = () => ({
  type: RESET_SELECTED_LIST,
});
