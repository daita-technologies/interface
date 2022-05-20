import { AugmentationMethod } from "components/ImageProcessing/type";
import { AlbumImagesFields } from "reduxes/album/type";

export interface CustomAugmentationReducer {
  isAugmentationExpertMode: boolean;
  referenceAugmentationImage: ReferenceAugmentationgeRecord;
  referenceSeletectorDialog: ReferenceSeletectorDialog;
  selectedMethodIds: string[];
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
