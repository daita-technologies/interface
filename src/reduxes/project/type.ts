import {
  CANCEL_TASK_STATUS,
  ERROR_TASK_STATUS,
  FINISH_ERROR_TASK_STATUS,
  FINISH_SAMPLE_PROJECT_STATUS,
  FINISH_TASK_STATUS,
  GENERATING_SAMPLE_PROJECT_STATUS,
  ORIGINAL_SOURCE,
  PENDING_TASK_STATUS,
  PREPARING_DATA_TASK_STATUS,
  PREPARING_HARDWARE_TASK_STATUS,
  PREPROCESS_SOURCE,
  RUNNING_TASK_STATUS,
  UPLOADING_TASK_STATUS,
} from "constants/defaultValues";
import { TaskProcessType } from "constants/taskType";
import { ImageSourceType } from "reduxes/album/type";
import {
  AugmentParameterApiField,
  GenerateMethodType,
} from "reduxes/generate/type";

export type GENERATE_PROJECT_STATUS_TYPE =
  | typeof GENERATING_SAMPLE_PROJECT_STATUS
  | typeof FINISH_SAMPLE_PROJECT_STATUS;

export type SplitDataNumberType = Array<number>;
export interface GroupImageInfo {
  count: number;
  size: number;
  data_number: SplitDataNumberType;
}

export type GroupProjectInfo = null | {
  ORIGINAL?: GroupImageInfo | null;
  PREPROCESS?: GroupImageInfo | null;
  AUGMENT?: GroupImageInfo | null;
};
export interface UpdateStatisticInfo {
  typeMethod: ImageSourceType;
  fileInfo: {
    isExist: boolean;
    isDelete?: boolean;
    size: number;
    sizeOld?: number;
  };
}

export interface TaskInfo {
  task_id: string;
  process_type: TaskProcessType;
  project_id?: string;
}
export interface ProjectInfo {
  identity_id: string;
  project_name: string;
  project_id: string;
  times_generated: number;
  groups: GroupProjectInfo;
  ls_task: Array<TaskInfo>;
  gen_status: GENERATE_PROJECT_STATUS_TYPE;
  aug_parameters: AugmentParameterApiField;
}

export interface ApiListProjectsItem {
  project_id: string;
  project_name: string;
  s3_prefix: string;
  ls_task: Array<TaskInfo>;
  groups: GroupProjectInfo;
  gen_status: GENERATE_PROJECT_STATUS_TYPE;
  thum_key: string;
  description: string;
}

export interface UpdateProjectStatisticPayload {
  projectId: string;
  updateInfo: UpdateStatisticInfo;
}

export interface SetSplitDataNumberPayload {
  typeMethod: ImageSourceType;
  splitDataNumber: SplitDataNumberType;
}

export interface MethodInfoFields {
  method_id: string;
  method_name: string;
}

export interface ListMethodType {
  augmentation: Array<MethodInfoFields>;
  preprocessing: Array<MethodInfoFields>;
}

export interface FetchListMethodSucceedPayload {
  listMethod: ListMethodType;
}

export type SPLIT_DATA_NUMBER_SOURCE_TYPE =
  | typeof ORIGINAL_SOURCE
  | typeof PREPROCESS_SOURCE;

export interface ChangeSelectedDatSourcePayload {
  newSelectedDataSource: SPLIT_DATA_NUMBER_SOURCE_TYPE;
}

export type TaskStatusType =
  | typeof PENDING_TASK_STATUS
  | typeof PREPARING_HARDWARE_TASK_STATUS
  | typeof PREPARING_DATA_TASK_STATUS
  | typeof RUNNING_TASK_STATUS
  | typeof FINISH_TASK_STATUS
  | typeof UPLOADING_TASK_STATUS
  | typeof FINISH_ERROR_TASK_STATUS
  | typeof ERROR_TASK_STATUS
  | typeof CANCEL_TASK_STATUS;

export interface TaskInfoApiFields {
  identity_id: string;
  task_id: string;
  status: TaskStatusType;
  process_type: TaskProcessType;
  project_id: string;
  number_finished?: number;
  number_gen_images?: number;
  presign_url?: string;
}

export type ZipTaskInfoApiFields = TaskInfoApiFields;
// export type ZipTaskInfoApiFields = Pick<
//   TaskInfoApiFields,
//   "identity_id" | "task_id" | "status" | "process_type" | "project_id"
// >;
export type HealthCheckInfoApiFields = TaskInfoApiFields;
// export type HealthCheckInfoApiFields = Pick<
//   TaskInfoApiFields,
//   "task_id" | "status" | "process_type" | "project_id"
// >;

export type GenerateReferenceImageTaskInfoApiFields = TaskInfoApiFields;
export type GeneralTaskInfoApiFields =
  | TaskInfoApiFields
  | ZipTaskInfoApiFields
  | HealthCheckInfoApiFields
  | GenerateReferenceImageTaskInfoApiFields;
export interface FetchTaskInfoPayload {
  idToken: string;
  taskId: string;
  processType: TaskProcessType;
  projectId?: string;
  isNotify?: boolean;
  generateMethod?: GenerateMethodType;
}

export interface FetchTaskInfoSucceedPayload {
  taskInfo: GeneralTaskInfoApiFields;
  projectId: string;
}

export interface CreateSamplePayload {
  idToken: string;
  accessToken: string;
}

export interface CreateSampleSucceedPayload {
  project_id: string;
  project_name: string;
  s3_prefix: string;
  gen_status: GENERATE_PROJECT_STATUS_TYPE;
  thum_key: string;
}

export interface DeleteProjectPayload {
  idToken: string;
  projectId: string;
  projectName: string;
}

export interface DeleteProjectSucceedPayload {
  projectId: string;
}

export interface SetIsOpenDeleteConfirmPayload {
  isOpen: boolean;
  projectId: string;
  projectName: string;
}

export interface ProjectReducerState {
  deleteConfirmDialogInfo: null | SetIsOpenDeleteConfirmPayload;
  isCreatingSampleProject: boolean;
  isOpenCreateProjectModal: boolean;
  isCreatingProject: boolean;
  isCreateProjectFailed: boolean | null;
  isFetchingProjects: boolean | null;
  isFetchingDetailProject: boolean | null;
  isFetchingProjectTaskList: boolean | null;
  listProjects: Array<ApiListProjectsItem>;
  currentProjectName: string;
  currentProjectInfo: null | ProjectInfo;
  listMethod: null | ListMethodType;
  selectedDataSource: SPLIT_DATA_NUMBER_SOURCE_TYPE;
  tasks: { [taskId: string]: GeneralTaskInfoApiFields };
  thumbnails: { [projectId: string]: null | string };
  isEditingSplitData: boolean;
  updateProjectInfoDialog: null | SetIsOpenUpdateProjectInfoPayload;
}

export interface SetIsEditingSplitDataPayload {
  isEditing: boolean;
}

export interface FetchProjectTaskListPayload {
  idToken: string;
  projectId: string;
}

export interface LoadProjectThumbnailImagePayload {
  fullPhotoKey: string;
  projectId: string;
}

export interface LoadProjectThumbnailImageSucceedPayload {
  projectThumbnailUrl: string;
  projectId: string;
}
export interface UpdateProjectInfo {
  projectName: string;
  description?: string;
}
export interface UpdateProjectInfoPayload {
  idToken: string;
  projectId: string;
  projectName: string;
  updateInfo: UpdateProjectInfo;
}

export interface SetIsOpenUpdateProjectInfoPayload {
  isOpen: boolean;
  isProcessing: boolean;
  projectId?: string;
  projectName?: string;
  updateInfo?: UpdateProjectInfo;
}
export interface ApiUpdateProjectsInfo {
  project_id: string;
  s3_prefix: string;
  gen_status: GENERATE_PROJECT_STATUS_TYPE;
  project_name: string;
  description: string;
}
