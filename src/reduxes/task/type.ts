import {
  AUGMENT_TASK_PROCESS_TYPE,
  DOWNLOAD_TASK_PROCESS_TYPE,
  HEALTHCHECK_TASK_PROCESS_TYPE,
  PREPROCESS_TASK_PROCESS_TYPE,
  UPLOAD_TASK_PROCESS_TYPE,
} from "constants/defaultValues";
import { TaskStatusMergedType } from "constants/taskType";
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
  currentPage: string | null;
  filter: GetTaskListFilterParams | null;
}

export interface TaskReducer {
  [PREPROCESS_TASK_PROCESS_TYPE]: TaskReducerEachProcessType;
  [AUGMENT_TASK_PROCESS_TYPE]: TaskReducerEachProcessType;
  [UPLOAD_TASK_PROCESS_TYPE]: TaskReducerEachProcessType;
  [DOWNLOAD_TASK_PROCESS_TYPE]: TaskReducerEachProcessType;
  [HEALTHCHECK_TASK_PROCESS_TYPE]: TaskReducerEachProcessType;
  isPageLoading: boolean | null;
}

export interface FilterTaskListInfoSucceededActionPayload {
  filter: GetTaskListFilterParams;
  response: TaskListResponseApiFields;
}

export interface FilterTaskListInfoFailedActionPayload {
  filter: GetTaskListFilterParams;
}
