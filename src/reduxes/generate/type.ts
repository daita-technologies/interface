import {
  ORIGINAL_SOURCE,
  PREPROCESS_SOURCE,
  AUGMENT_GENERATE_IMAGES_TYPE,
  PREPROCESSING_GENERATE_IMAGES_TYPE,
} from "constants/defaultValues";
import { ImageSourceType } from "reduxes/album/type";

export type ListMethodId = Array<string>;
export type GenerateDataType =
  | typeof ORIGINAL_SOURCE
  | typeof PREPROCESS_SOURCE;

export type generateMethodType =
  | typeof PREPROCESSING_GENERATE_IMAGES_TYPE
  | typeof AUGMENT_GENERATE_IMAGES_TYPE;

export interface GenerateImagePayload {
  idToken: string;
  projectId: string;
  projectName: string;
  listMethodId: ListMethodId;
  dataType: ImageSourceType;
  numberImageGeneratePerSource: number;
  dataNumber: Array<number>;
  generateMethod: generateMethodType;
}

export interface GenerateImageSucceedPayload {
  taskId: string;
  generateMethod?: generateMethodType;
}

export interface GenerateImageFailedPayload {
  generateMethod?: generateMethodType;
}

export interface GenerateReducer {
  isGeneratingImages: boolean | null;
  isGenerateImagesPreprocessing: boolean | null;
  isGenerateImagesAugmenting: boolean | null;
}
