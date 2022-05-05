import {
  PREPROCESS_TASK_TYPE,
  AUGMENT_TASK_TYPE,
  UPLOAD_TASK_TYPE,
  DOWNLOAD_TASK_TYPE,
  HEALTHCHECK_TASK_TYPE,
  RUNNING_TASK_STATUS,
  FINISH_TASK_STATUS,
  ERROR_TASK_STATUS,
} from "./defaultValues";

export type TaskProcessType =
  | typeof PREPROCESS_TASK_TYPE
  | typeof AUGMENT_TASK_TYPE
  | typeof UPLOAD_TASK_TYPE
  | typeof DOWNLOAD_TASK_TYPE
  | typeof HEALTHCHECK_TASK_TYPE;

export type TaskStatusMergedType =
  | typeof RUNNING_TASK_STATUS
  | typeof FINISH_TASK_STATUS
  | typeof ERROR_TASK_STATUS;
