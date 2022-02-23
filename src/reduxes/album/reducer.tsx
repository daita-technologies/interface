import {
  VIEW_ALBUM_PAGE_SIZE,
  ORIGINAL_IMAGES_TAB,
  ORIGINAL_SOURCE,
} from "constants/defaultValues";
import { FETCH_DETAIL_PROJECT } from "reduxes/project/constants";
import {
  ADD_IMAGE_TO_ALBUM_FROM_FILE,
  ALBUM_VIEW_MODE,
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
  AlbumReducer,
  ChangeActiveImagesTabIdPayload,
  ChangeAlbumModePayload,
  DeleteImageSucceedPayload,
  ImageApiFields,
  SelectImagePayload,
  UnselectImagePayload,
} from "./type";

const inititalState: AlbumReducer = {
  isFetchingImages: null,
  isFetchingInitialLoad: null,
  isDeletingImages: null,
  images: {},
  nextToken: "",
  typeMethod: ORIGINAL_SOURCE,
  numLimit: VIEW_ALBUM_PAGE_SIZE,
  activeTabId: ORIGINAL_IMAGES_TAB,
  albumMode: ALBUM_VIEW_MODE,
  selectedList: [],
};

const albumReducer = (state = inititalState, action: any): AlbumReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case FETCH_IMAGES.REQUESTED: {
      const targetConditionalNewState =
        payload.nextToken === ""
          ? { isFetchingInitialLoad: true, images: {} }
          : undefined;

      return {
        ...state,
        isFetchingImages: true,
        ...targetConditionalNewState,
      };
    }
    case FETCH_IMAGES.SUCCEEDED: {
      let newImages;
      if (payload.previousToken) {
        newImages = { ...state.images, ...payload.images };
      } else {
        newImages = payload.images;
      }
      const targetIsFetchingInitialLoad =
        payload.previousToken === ""
          ? { isFetchingInitialLoad: false }
          : undefined;
      return {
        ...state,
        isFetchingImages: false,
        images: newImages,
        nextToken: payload.nextToken,
        ...targetIsFetchingInitialLoad,
      };
    }
    case FETCH_IMAGES.FAILED: {
      const targetIsFetchingInitialLoad =
        payload.previousToken === ""
          ? { isFetchingInitialLoad: false }
          : undefined;
      return {
        ...state,
        isFetchingImages: false,
        ...targetIsFetchingInitialLoad,
      };
    }
    case FETCH_DETAIL_PROJECT.REQUESTED: {
      return {
        ...state,
        nextToken: "",
      };
    }
    case LOAD_IMAGE_CONTENT.SUCCEEDED: {
      return {
        ...state,
        images: {
          ...state.images,
          [payload.filename]: {
            ...state.images[payload.filename],
            blob: payload.blob,
            url: payload.url,
            size: payload.size,
          },
        },
      };
    }
    case ADD_IMAGE_TO_ALBUM_FROM_FILE: {
      const { filename } = payload as ImageApiFields;
      if (state.images[filename]) {
        return {
          ...state,
          images: {
            ...state.images,
            [filename]: payload,
          },
        };
      }
      return {
        ...state,
        images: {
          [filename]: payload,
          ...state.images,
        },
      };
    }
    case RESET_ALBUM_STATE:
      return inititalState;
    case CHANGE_ACTIVE_IMAGES_TAB: {
      const { tabId } = payload as ChangeActiveImagesTabIdPayload;
      return { ...state, activeTabId: tabId };
    }
    case CHANGE_ALBUM_MODE: {
      const { albumMode } = payload as ChangeAlbumModePayload;
      return {
        ...state,
        albumMode,
      };
    }
    case SELECT_IMAGE: {
      const { fileName } = payload as SelectImagePayload;
      const newSelectedList = [...state.selectedList];
      newSelectedList.push(fileName);
      return {
        ...state,
        selectedList: newSelectedList,
      };
    }
    case UNSELECT_IMAGE: {
      const { fileName } = payload as UnselectImagePayload;
      const newSelectedList = [...state.selectedList];
      const matchIndex = newSelectedList.indexOf(fileName);
      if (matchIndex > -1) {
        newSelectedList.splice(matchIndex, 1);
        return {
          ...state,
          selectedList: newSelectedList,
        };
      }
      return state;
    }
    case RESET_SELECTED_LIST:
      return {
        ...state,
        selectedList: [],
      };
    case DELETE_IMAGES.REQUESTED:
      return {
        ...state,
        isDeletingImages: true,
      };
    case DELETE_IMAGES.SUCCEEDED: {
      const { imagesInfo } = payload as DeleteImageSucceedPayload;
      const newImages = { ...state.images };
      imagesInfo.forEach((fileName: string) => delete newImages[fileName]);
      return {
        ...state,
        images: newImages,
        selectedList: [],
        isDeletingImages: false,
      };
    }
    case DELETE_IMAGES.FAILED:
      return {
        ...state,
        isDeletingImages: false,
      };
    default:
      return state;
  }
};

export default albumReducer;
