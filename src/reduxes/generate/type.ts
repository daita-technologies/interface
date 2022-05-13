import {
  ORIGINAL_SOURCE,
  PREPROCESS_SOURCE,
  AUGMENT_GENERATE_IMAGES_TYPE,
  PREPROCESSING_GENERATE_IMAGES_TYPE,
  PREPROCESS_GENERATE_TAB,
  AUGMENTATION_GENERATE_TAB,
  AUGMENT_SOURCE,
} from "constants/defaultValues";
import { ImageSourceType } from "reduxes/album/type";

export type ListMethodId = Array<string>;
export type GenerateDataType =
  | typeof ORIGINAL_SOURCE
  | typeof PREPROCESS_SOURCE;

export type generateMethodType =
  | typeof PREPROCESSING_GENERATE_IMAGES_TYPE
  | typeof AUGMENT_GENERATE_IMAGES_TYPE;

export type TabGenerateIdType =
  | typeof PREPROCESS_GENERATE_TAB
  | typeof AUGMENTATION_GENERATE_TAB;

export interface GenerateImagePayload {
  idToken: string;
  projectId: string;
  projectName: string;
  listMethodId: ListMethodId;
  dataType: ImageSourceType;
  numberImageGeneratePerSource: number;
  dataNumber: Array<number>;
  generateMethod: generateMethodType;
  processType: typeof PREPROCESS_SOURCE | typeof AUGMENT_SOURCE;
  referenceImages: Record<string, string>;
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
  activeTabId: TabGenerateIdType;
}

export interface ChangeActiveGenerateTabIdPayload {
  tabId: TabGenerateIdType;
}
