import { GeneralTaskInfoApiFields } from "reduxes/project/type";
import {
  HEALTH_CHECK_TASK_PLACEMENT_PAGE_NAME,
  PROJECT_DETAIL_TASK_PLACEMENT_PAGE_NAME,
} from "reduxes/task/constants";

export interface TaskListProps {
  //
}

export type TaskPlacementPageNameType =
  | typeof PROJECT_DETAIL_TASK_PLACEMENT_PAGE_NAME
  | typeof HEALTH_CHECK_TASK_PLACEMENT_PAGE_NAME;

export interface TaskListItemProps {
  taskInfo: GeneralTaskInfoApiFields;
  pageName: TaskPlacementPageNameType;
}

export interface TaskListImageSourceItemProps {
  taskInfo: GeneralTaskInfoApiFields;
}
export interface TaskListUploadItemProps {
  taskInfo: GeneralTaskInfoApiFields;
}
