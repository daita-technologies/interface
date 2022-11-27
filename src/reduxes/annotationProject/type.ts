import { ImageSourceType } from "reduxes/album/type";
import {
  GENERATE_PROJECT_STATUS_TYPE,
  GroupProjectInfo,
  SetIsOpenDeleteConfirmPayload,
} from "reduxes/project/type";

export interface AnnotationProjectReducer {
  listProjects: Array<ApiListAnnotationProjectsItem>;
  dialogCloneProjectToAnnotation: DialogCloneProjectToAnnotation;
  isCloningProjectToAnnotation: boolean;
  currentProjectInfo: null | AnnotationProjectInfo;
  currentProjectName: string;
  isFetchingProjects: null | boolean;
  isFetchingDetailProject: boolean;
  currentAnnotationAndFileInfo: null | AnnotationAndFileInfoApi;
  currentAnnotationFiles: null | AnnotationFilesApi;
  deleteConfirmDialogInfo: null | SetIsOpenDeleteConfirmPayload;
}
export interface AnnotationFilesApi {
  items: AnnotationFilesItemApi[];
  next_token: AnnotationFilesNextTokenApi;
  projectId: string;
}
export interface AnnotationFilesItemApi {
  filename: string;
  size: number;
  created_time: string;
  s3_key: string;
  s3_key_segm: string;
}
export interface AnnotationFilesNextTokenApi {
  filename: string;
  project_id: string;
}
export interface AnnotationAndFileInfoApi {
  file_info: AnnotationFileInfoApi;
  label_info: AnnotationLabelInfoApi[];
}
export interface AnnotationFileApi {
  file_info: AnnotationFileInfoApi;
  label_info: AnnotationLabelInfoApi;
}
export interface AnnotationLabelInfoApi {
  s3key_jsonlabel: string;
  updated_time: string;
  category_id: string;
  category_name: string;
  file_id: string;
  category_des: string;
  created_time: string;
}
export interface AnnotationFileInfoApi {
  filename: string;
  size: number;
  created_time: string;
  s3_key: string;
  file_id: string;
}
export interface AnnotationProjectInfo {
  project_id: string;
  project_name: string;
  gen_status: string;
  s3_raw_data: string;
  s3_label: string;
  ls_category: CategoryInfoApi;
  default_category_id: string;
  groups: Record<GroupType, GroupAnnotationProjectInfo>;
}
export interface CategoryInfoApi {
  category_id: string;
  ls_class: ClassInfoApi[];
}
export interface ClassInfoApi {
  class_id: string;
  class_name: string;
}
export type GroupType = ImageSourceType;
export interface GroupAnnotationProjectInfo {
  count: number;
  size: number;
}
export interface ApiListAnnotationProjectsItem {
  groups: GroupProjectInfo;
  project_id: string;
  project_name: string;
  gen_status: GENERATE_PROJECT_STATUS_TYPE;
  created_date: string;
}
export interface DialogCloneProjectToAnnotation {
  isShow: boolean;
  projectName?: string;
}

export interface CloneProjectToAnnotationProps {
  fromProjectName: string;
  annotationProjectName: String;
  annotationProjectDescription: String;
}
export interface SetDialogCloneProjectToAnnotationProps {
  dialogCloneProjectToAnnotation: DialogCloneProjectToAnnotation;
}
export interface SetCurrentAnnotationProjectProps {
  projectName: string;
}
export interface FetchListAnnotationProjectsProps {
  idToken: string | null;
}
export interface FetchDetailAnnotationProjectsProps {
  idToken: string | null;
  projectName: string;
}
export interface FetchAnnotationAndFileInfoProps {
  idToken: string | null;
  projectId: string;
  filename: string;
  categoryId: string;
}

export interface SetCurrentAnnotationAndFileInfo {
  currentAnnotationAndFileInfo: null | AnnotationAndFileInfoApi;
}
export interface FetchAnnotationFilesProps {
  idToken: string | null;
  projectId: string;
  nextToken: string;
  numLimit?: number;
}
export interface DeleteAnnotationProjectProps {
  idToken: string | null;
  projectId: string;
  projectName: string;
}
export interface SetAnnotationFilesProps {
  annotationAndFileInfoApi: AnnotationAndFileInfoApi | null;
}
