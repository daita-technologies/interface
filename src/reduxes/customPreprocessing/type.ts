import { PreprocessingMedthod } from "components/ImageProcessing/type";
import { AlbumImagesFields } from "reduxes/album/type";

export interface CustomPreprocessReducer {
  isPreprocessingExpertMode: boolean;
  referencePreprocessImage: ReferencePreprocessImageRecord;
  images: AlbumImagesFields;
  referenceSeletectorDialog: ReferenceSeletectorDialog;
}
export type ReferencePreprocessImageRecord = Record<
  PreprocessingMedthod,
  ReferencePreprocessImage
>;
export interface ReferencePreprocessImage {
  filename: keyof AlbumImagesFields;
  method: PreprocessingMedthod;
}
export interface ReferenceImageInfoProps {
  method: PreprocessingMedthod;
  fileName: string;
}
export interface ChangePreprocessingExpertModePayload {
  isPreprocessingExpertMode: boolean;
}
export interface ReferenceSeletectorDialog {
  isShow: boolean;
  method?: PreprocessingMedthod;
}
