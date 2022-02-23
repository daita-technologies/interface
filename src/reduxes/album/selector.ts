import { RootState } from "reduxes";
import { ALBUM_SELECT_MODE } from "./constants";

export const selectorImages = (state: RootState) => state.albumReducer.images;
export const selectorIsFetchingImages = (state: RootState) =>
  state.albumReducer.isFetchingImages;
export const selectorNextToken = (state: RootState) =>
  state.albumReducer.nextToken;
export const selectorIsFetchingInitialLoad = (state: RootState) =>
  state.albumReducer.isFetchingInitialLoad;
export const selectorActiveImagesTabId = (state: RootState) =>
  state.albumReducer.activeTabId;

export const selectorAlbumMode = (state: RootState) =>
  state.albumReducer.albumMode;

export const selectorIsAlbumSelectMode = (state: RootState) =>
  state.albumReducer.albumMode === ALBUM_SELECT_MODE;

export const selectorSelectedList = (state: RootState) =>
  state.albumReducer.selectedList;

export const selectorIsDeletingImages = (state: RootState) =>
  state.albumReducer.isDeletingImages;
