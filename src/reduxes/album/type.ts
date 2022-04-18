import {
  AUGMENT_SOURCE,
  ORIGINAL_SOURCE,
  PREPROCESS_SOURCE,
  AUGMENT_IMAGES_TAB,
  ORIGINAL_IMAGES_TAB,
  PREPROCESS_IMAGES_TAB,
} from "constants/defaultValues";

import { ALBUM_SELECT_MODE, ALBUM_VIEW_MODE } from "./constants";

export interface S3Image {
  photoKey: string;
  src: string;
  alt?: string;
  size: number;
}

export interface NextTokenType {
  filename: string;
  project_id: string;
}

export type ImageSourceType =
  | typeof ORIGINAL_SOURCE
  | typeof PREPROCESS_SOURCE
  | typeof AUGMENT_SOURCE;

export interface ImageApiFields {
  filename: string;
  s3_key: string;
  photoKey: string;
  typeOfImage: ImageSourceType;
  gen_id?: string;
  classtype?: string;
  blob?: Blob;
  url?: string;
  size?: number;
}

export interface FetchImagesParams {
  idToken: string;
  projectId: string;
  typeMethod: ImageSourceType;
  nextToken: "" | NextTokenType;
  numLimit?: number;
  isFetchToDownload?: boolean;
}
export interface AlbumImagesFields {
  [fileName: string]: ImageApiFields;
}

export type TAB_ID_TYPE =
  | typeof ORIGINAL_IMAGES_TAB
  | typeof PREPROCESS_IMAGES_TAB
  | typeof AUGMENT_IMAGES_TAB;

export interface ChangeActiveImagesTabIdPayload {
  tabId: TAB_ID_TYPE;
  projectId: string;
}

export type AlbumModeType = typeof ALBUM_VIEW_MODE | typeof ALBUM_SELECT_MODE;

export interface ChangeAlbumModePayload {
  albumMode: AlbumModeType;
}

export interface SelectImagePayload {
  fileName: string;
}

export interface UnselectImagePayload {
  fileName: string;
}

export interface DeleteImagePayload {
  imagesInfo: Array<string>;
  projectId: string;
}

export interface DeleteImageSucceedPayload {
  imagesInfo: Array<string>;
}
export interface AlbumReducer {
  isFetchingImages: boolean | null;
  isFetchingInitialLoad: boolean | null;
  isDeletingImages: boolean | null;
  images: AlbumImagesFields;
  typeMethod: ImageSourceType;
  nextToken: "" | NextTokenType;
  numLimit: number;
  activeTabId: TAB_ID_TYPE;
  albumMode: AlbumModeType;
  selectedList: Array<string>;
}

export interface LoadImageContentPayload {
  projectId: string;
  typeMethod: ImageSourceType;
  fileName: string;
  photoKey: string;
  imageInfo?: ImageApiFields;
  isFetchToDownload?: boolean;
  isSelectedDownload?: boolean;
  blob?: Blob;
}

export interface LoadImageContentSucceedPayload {
  projectId: string;
  filename: string;
  blob: Blob;
  url: string;
  size: number;
}
