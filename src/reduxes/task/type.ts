import {
  AUGMENT_TASK_TYPE,
  DOWNLOAD_TASK_TYPE,
  HEALTHCHECK_TASK_TYPE,
  PREPROCESS_TASK_TYPE,
  UPLOAD_TASK_TYPE,
} from "constants/defaultValues";
import { TaskStatusMergedType } from "constants/taskType";
import { TaskListEachProcessTypeResponseApiFields } from "services/taskApi";

export interface FilterTaskListInfoPayload {
  statusQuery: TaskStatusMergedType;
}

export interface TaskReducerEachProcessType {
  isLoading: boolean | null;
  taskListInfo: TaskListEachProcessTypeResponseApiFields;
  currentPage: string | null;
  // filter:
}

export interface TaskReducer {
  [PREPROCESS_TASK_TYPE]: TaskReducerEachProcessType;
  [AUGMENT_TASK_TYPE]: TaskReducerEachProcessType;
  [UPLOAD_TASK_TYPE]: TaskReducerEachProcessType;
  [DOWNLOAD_TASK_TYPE]: TaskReducerEachProcessType;
  [HEALTHCHECK_TASK_TYPE]: TaskReducerEachProcessType;
  isPageLoading: boolean | null;
}
