import { FILTER_ALL_TASK_STATUS } from "constants/defaultValues";
import { TaskStatusMergedType } from "constants/taskType";

export interface TaskStatusFilterOption {
  label: string;
  value: TaskStatusMergedType | typeof FILTER_ALL_TASK_STATUS;
}

export interface TaskStatusFilterProps {
  onChange: (targetStatusFilter: TaskStatusFilterOption) => void;
}
