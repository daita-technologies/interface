import {
  ALL_DOWNLOAD_TYPE,
  PREPROCESS_DOWNLOAD_TYPE,
  ORIGINAL_DOWNLOAD_TYPE,
  AUGMENT_DOWNLOAD_TYPE,
  EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE,
  EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE,
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

export type CreateProjectDatasetValueType =
  | typeof EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE
  | typeof EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE;
export interface CreateProjectDatasetTypeControlType {
  value: CreateProjectDatasetValueType;
  label: string;
  description: string;
}
