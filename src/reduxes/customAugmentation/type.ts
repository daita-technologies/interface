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
  extends AugmentCustomMethodParamValue {}

export interface RemoveAugmentCustomMethodParamValueActionPayload {
  removeMethodIdList: string[];
}

export interface AugmentCustomMethodPreviewImageInfo {
  [methodId: string]: GetAugmentCustomMethodPreviewImageResponse;
}

export interface SavedAugmentCustomMethodParamValueType {
  [methodId: string]: AugmentCustomMethodParamValue | undefined;
}

export interface CustomAugmentationReducer {
  isAugmentationExpertMode: boolean;
  referenceAugmentationImage: ReferenceAugmentationgeRecord;
  referenceSeletectorDialog: ReferenceSeletectorDialog;
  selectedMethodIds: string[];
  augmentCustomMethodPreviewImageInfo: null | AugmentCustomMethodPreviewImageInfo;
  savedAugmentCustomMethodParamValue: SavedAugmentCustomMethodParamValueType;
  isFetchingAugmentCustomMethodPreviewImage: boolean | null;
  isLoadingPreviewImage: boolean;
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
export interface SelectedMethodProps {
  selectedMethodIds: string[];
}

export interface GetAugmentCustomMethodPreviewImageInfoRequestActionPayload
  extends GetAugmentCustomMethodPreviewImageParams {}

export interface GetAugmentCustomMethodPreviewImageInfoSucceededActionPayload
  extends GetAugmentCustomMethodPreviewImageResponse {}

export interface ChangeIsLoadingAugmentCustomMethodPreviewImageRequestActionPayload {
  isLoading: boolean;
}
