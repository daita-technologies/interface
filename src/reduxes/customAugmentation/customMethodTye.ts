import {
  AugmentationMethod,
  PreprocessingMethod,
} from "components/ImageProcessing/type";
import { AlbumImagesFields } from "reduxes/album/type";

type CustomMethodType = AugmentationMethod | PreprocessingMethod;
export interface CustomMethodReducer<T extends CustomMethodType> {
  isExpertMode: boolean;
  referenceImageRecord: ReferenceImageRecord<T>;
  referenceSeletectorDialog: ReferenceSeletectorDialog<T>;
}
export type ReferenceImageRecord<T extends CustomMethodType> = Record<
  T,
  ReferenceImage<T>
>;
export interface ReferenceImage<T extends CustomMethodType> {
  filename: keyof AlbumImagesFields;
  method: T;
}
export interface ReferenceImageInfoProps<T extends CustomMethodType> {
  method: T;
  filename: string;
}
export interface ChangeExpertModePayload {
  isExpertMode: boolean;
}
export interface ReferenceSeletectorDialog<T extends CustomMethodType> {
  isShow: boolean;
  method?: T;
}
