import {
  AUGMENT_TASK_PROCESS_TYPE,
  CANCEL_TASK_STATUS,
  DOWNLOAD_TASK_PROCESS_TYPE,
  ERROR_TASK_STATUS,
  FINISH_ERROR_TASK_STATUS,
  FINISH_TASK_STATUS,
  GENERATE_REFERENCE_IMAGE_TYPE,
  HEALTHCHECK_TASK_PROCESS_TYPE,
  PENDING_TASK_STATUS,
  PREPARING_DATA_TASK_STATUS,
  PREPARING_HARDWARE_TASK_STATUS,
  PREPROCESS_TASK_PROCESS_TYPE,
  RUNNING_TASK_STATUS,
  UPLOADING_TASK_STATUS,
  UPLOAD_TASK_PROCESS_TYPE,
} from "constants/defaultValues";
import { TaskProcessType } from "constants/taskType";
import { TaskStatusType } from "reduxes/project/type";

export function getTaskStatusMergedValue(taskStatus: TaskStatusType) {
  switch (taskStatus) {
    case FINISH_ERROR_TASK_STATUS:
    case ERROR_TASK_STATUS:
      return ERROR_TASK_STATUS;
    case FINISH_TASK_STATUS:
      return FINISH_TASK_STATUS;
    case CANCEL_TASK_STATUS:
      return CANCEL_TASK_STATUS;
    case PENDING_TASK_STATUS:
    case PREPARING_HARDWARE_TASK_STATUS:
    case PREPARING_DATA_TASK_STATUS:
    case RUNNING_TASK_STATUS:
    case UPLOADING_TASK_STATUS:
    default:
      return RUNNING_TASK_STATUS;
  }
}

export function mapProcessTypeToName(taskProcessType: TaskProcessType) {
  switch (taskProcessType) {
    case PREPROCESS_TASK_PROCESS_TYPE:
      return "Preprocessing";
    case AUGMENT_TASK_PROCESS_TYPE:
      return "Augmentation";
    case UPLOAD_TASK_PROCESS_TYPE:
      return "Upload";
    case DOWNLOAD_TASK_PROCESS_TYPE:
      return "Download";
    case HEALTHCHECK_TASK_PROCESS_TYPE:
      return "Dataset Health Check";
    case GENERATE_REFERENCE_IMAGE_TYPE:
      return "Reference image";
    default:
      return "";
  }
}
