import {
  AUGMENT_TASK_PROCESS_TYPE,
  DOWNLOAD_TASK_PROCESS_TYPE,
  GENERATE_REFERENCE_IMAGE_TYPE,
  HEALTHCHECK_TASK_PROCESS_TYPE,
  PREPROCESS_TASK_PROCESS_TYPE,
  UPLOAD_TASK_PROCESS_TYPE,
} from "constants/defaultValues";
import { TaskProcessType, TaskStatusMergedType } from "constants/taskType";
import {
  GetTaskListFilterParams,
  TaskListEachProcessTypeResponseApiFields,
  TaskListResponseApiFields,
} from "services/taskApi";

export interface FilterTaskListInfoPayload {
  statusQuery: TaskStatusMergedType;
}

export interface TaskReducerEachProcessType {
  isLoading: boolean | null;
  taskListInfo: TaskListEachProcessTypeResponseApiFields;
  currentPage: number | null;
  filter: GetTaskListFilterParams | null;
}

export interface TaskReducer {
  [PREPROCESS_TASK_PROCESS_TYPE]: TaskReducerEachProcessType;
  [AUGMENT_TASK_PROCESS_TYPE]: TaskReducerEachProcessType;
  [UPLOAD_TASK_PROCESS_TYPE]: TaskReducerEachProcessType;
  [DOWNLOAD_TASK_PROCESS_TYPE]: TaskReducerEachProcessType;
  [HEALTHCHECK_TASK_PROCESS_TYPE]: TaskReducerEachProcessType;
  [GENERATE_REFERENCE_IMAGE_TYPE]: TaskReducerEachProcessType;
  isPageLoading: boolean | null;
}

export interface FilterTaskListInfoSucceededActionPayload {
  filter: GetTaskListFilterParams;
  response: TaskListResponseApiFields;
}

export interface FilterTaskListInfoFailedActionPayload {
  filter: GetTaskListFilterParams;
}

export interface PaginationTaskListInfoRequestActionPayload {
  filter: GetTaskListFilterParams | null;
  processType: TaskProcessType;
  targetPage: number;
}

export interface PaginationTaskListInfoSucceedActionPayload {
  filter: GetTaskListFilterParams | null;
  targetPage: number;
  processType: TaskProcessType;
  response: TaskListResponseApiFields;
}
export interface PaginationTaskListInfoFailedActionPayload {
  filter: GetTaskListFilterParams | null;
  processType: TaskProcessType;
  targetPage: number;
}
