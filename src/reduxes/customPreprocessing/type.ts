import { AlbumImagesFields } from "reduxes/album/type";
import { MethodInfoFields } from "reduxes/project/type";

export interface CustomPreprocessReducer {
  isPreprocessingExpertMode: boolean;
  referencePreprocessImage: ReferencePreprocessImageRecord;
  referenceSeletectorDialog: ReferenceSeletectorDialog;
  selectedMethods: MethodInfoFields[];
  isGenerating: boolean;
  isGenerateReferenceRequesting: boolean;
}
export type ReferencePreprocessImageRecord = Record<
  string,
  ReferencePreprocessImage
>;
export interface ReferencePreprocessImage {
  filename: keyof AlbumImagesFields;
  method: MethodInfoFields;
  isSelectedByUser: boolean;
  imageS3Path: string;
}
export interface ReferenceImageInfoProps {
  method: MethodInfoFields;
  filename: string;
  imageS3Path: string;
}
export interface ChangePreprocessingExpertModePayload {
  isPreprocessingExpertMode: boolean;
}
export interface ReferenceSeletectorDialog {
  isShow: boolean;
  method?: MethodInfoFields;
}
export interface SelectedMethodProps {
  selectedMethods: MethodInfoFields[];
}
export interface GenerateReferenceImagesProps {
  projectId: string;
}
export interface ReferenceInfoApiFields {
  method_id: string;
  method_name: string;
  image_s3_path: string;
  task_id: string;
  project_id: string;
  created_time: string;
  filename: string;
}
