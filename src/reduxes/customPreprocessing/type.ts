import { PreprocessingMethod } from "components/ImageProcessing/type";
import { AlbumImagesFields } from "reduxes/album/type";

export interface CustomPreprocessReducer {
  isPreprocessingExpertMode: boolean;
  referencePreprocessImage: ReferencePreprocessImageRecord;
  images: AlbumImagesFields;
  referenceSeletectorDialog: ReferenceSeletectorDialog;
}
export type ReferencePreprocessImageRecord = Record<
  PreprocessingMethod,
  ReferencePreprocessImage
>;
export interface ReferencePreprocessImage {
  filename: keyof AlbumImagesFields;
  method: PreprocessingMethod;
}
export interface ReferenceImageInfoProps {
  method: PreprocessingMethod;
  filename: string;
}
export interface ChangePreprocessingExpertModePayload {
  isPreprocessingExpertMode: boolean;
}
export interface ReferenceSeletectorDialog {
  isShow: boolean;
  method?: PreprocessingMethod;
}
