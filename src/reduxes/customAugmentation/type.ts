import { AugmentationMethod } from "components/ImageProcessing/type";
import { AlbumImagesFields } from "reduxes/album/type";

export interface CustomAugmentationReducer {
  isAugmentationExpertMode: boolean;
  referenceAugmentationImage: ReferenceAugmentationgeRecord;
  referenceSeletectorDialog: ReferenceAugmentationSeletectorDialog;
}
export type ReferenceAugmentationgeRecord = Record<
  AugmentationMethod,
  ReferenceAugmentationImage
>;
export interface ReferenceAugmentationImage {
  filename: keyof AlbumImagesFields;
  method: AugmentationMethod;
}
export interface ReferenceAugmentationImageInfoProps {
  method: AugmentationMethod;
  filename: string;
}
export interface ChangeAugmentationxpertModePayload {
  isAugmentationExpertMode: boolean;
}
export interface ReferenceAugmentationSeletectorDialog {
  isShow: boolean;
  method?: AugmentationMethod;
}
