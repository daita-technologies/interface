import { AlbumImagesFields } from "reduxes/album/type";
import {
  GetAugmentCustomMethodPreviewImageParams,
  GetAugmentCustomMethodPreviewImageResponse,
} from "services/customMethodApi";

export type SelectedParamAugmentCustomMethod = {
  paramName: string;
  paramValue: number | boolean;
};
export type AugmentCustomMethodParamValue = {
  methodId: string;
  params: SelectedParamAugmentCustomMethod[];
};

export interface ChangeAugmentCustomMethodParamValueActionPayload
  extends AugmentCustomMethodParamValue {
  projectId: string;
}

export interface RemoveAugmentCustomMethodParamValueActionPayload {
  projectId: string;
  removeMethodIdList: string[];
}

export interface AddAugmentCustomMethodParamValueActionPayload {
  projectId: string;
  addMethodIdList: string[];
}

export interface AugmentCustomMethodPreviewImageInfo {
  [methodId: string]: GetAugmentCustomMethodPreviewImageResponse;
}

export interface SavedAugmentCustomMethodParamValueType {
  [methodId: string]: AugmentCustomMethodParamValue | undefined;
}

export interface SavedAugmentCustomMethodParamValueByProjectIdType {
  [projectId: string]: SavedAugmentCustomMethodParamValueType;
}

export interface CustomAugmentationReducer {
  isAugmentationExpertMode: boolean;
  referenceAugmentationImage: ReferenceAugmentationgeRecord;
  referenceSeletectorDialog: ReferenceSeletectorDialog;
  selectedMethodIds: string[];
  augmentCustomMethodPreviewImageInfo: null | AugmentCustomMethodPreviewImageInfo;
  savedAugmentCustomMethodParamValueByProjectId: SavedAugmentCustomMethodParamValueByProjectIdType;
  isFetchingAugmentCustomMethodPreviewImage: boolean | null;
  isLoadingPreviewImage: boolean;
  isAbleToRunAgumentationError: boolean | null;
}
export type ReferenceAugmentationgeRecord = Record<
  string,
  ReferenceAugmentationImage
>;
export interface ReferenceAugmentationImage {
  filename: keyof AlbumImagesFields;
  methodId: string;
  imageS3Path: string;
  value: number;
}
export interface ChangeAugmentationxpertModePayload {
  isAugmentationExpertMode: boolean;
}
export interface ReferenceSeletectorDialog {
  isShow: boolean;
  methodId?: string;
}
export interface GetAugmentCustomMethodPreviewImageInfoRequestActionPayload
  extends GetAugmentCustomMethodPreviewImageParams {}

export interface GetAugmentCustomMethodPreviewImageInfoSucceededActionPayload
  extends GetAugmentCustomMethodPreviewImageResponse {}

export interface ChangeIsLoadingAugmentCustomMethodPreviewImageRequestActionPayload {
  isLoading: boolean;
}

export interface UpdateIsAbleToRunAgumentationErrorActionPayload {
  isError: boolean;
}
