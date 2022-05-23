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

export type GenerateMethodType =
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
  generateMethod: GenerateMethodType;
  processType: typeof PREPROCESS_SOURCE | typeof AUGMENT_SOURCE;
  referenceImages: Record<string, string>;
  isNormalizeResolution?: boolean;
}

export interface GenerateImageSucceedPayload {
  taskId: string;
  generateMethod?: GenerateMethodType;
}

export interface GenerateImageFailedPayload {
  generateMethod?: GenerateMethodType;
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
