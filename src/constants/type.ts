import {
  ALL_DOWNLOAD_TYPE,
  PREPROCESS_DOWNLOAD_TYPE,
  ORIGINAL_DOWNLOAD_TYPE,
  AUGMENT_DOWNLOAD_TYPE,
} from "./defaultValues";

export interface ApiResponse {
  error: boolean;
  data: any;
  message?: string;
}

export type DownloadType =
  | typeof ALL_DOWNLOAD_TYPE
  | typeof PREPROCESS_DOWNLOAD_TYPE
  | typeof ORIGINAL_DOWNLOAD_TYPE
  | typeof AUGMENT_DOWNLOAD_TYPE;
