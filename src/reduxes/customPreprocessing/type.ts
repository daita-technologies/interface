import { AlbumImagesFields } from "reduxes/album/type";

export interface CustomPreprocessReducer {
  projectId: string | null;
  isPreprocessingExpertMode: boolean;
  referencePreprocessImage: ReferencePreprocessImageRecord;
  referenceSeletectorDialog: ReferenceSeletectorDialog;
  selectedMethodIds: string[];
  isGenerating: boolean;
  isGenerateReferenceRequesting: boolean;
}
export type ReferencePreprocessImageRecord = Record<
  string,
  ReferencePreprocessImage
>;
export interface ReferencePreprocessImage {
  filename: keyof AlbumImagesFields;
  methodId: string;
  isSelectedByUser: boolean;
  imageS3Path: string;
}
export interface ReferenceImageInfoProps {
  methodId: string;
  filename: string;
  imageS3Path: string;
}
export interface ChangePreprocessingExpertModePayload {
  isPreprocessingExpertMode: boolean;
}
export interface ReferenceSeletectorDialog {
  isShow: boolean;
  methodId?: string;
}
export interface SelectedMethodProps {
  selectedMethodIds: string[];
}
export interface GenerateReferenceImagesProps {
  projectId: string;
  projectName: string;
  selectedMethodIds: string[];
}
export interface ReferenceInfoApiFields {
  method_id: string;
  image_s3_path: string;
  task_id: string;
  project_id: string;
  created_time: string;
  filename: string;
}
export interface ResetGenerateReferenceImageProps {
  projectId: string;
}
