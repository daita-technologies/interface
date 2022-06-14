import { TaskProcessType } from "constants/taskType";

import { TaskItemApiFields } from "services/taskApi";

export interface TaskViewerProps {
  projectId: string;
  taskProcessType: TaskProcessType;
}

export interface EnhancedTableToolbarProps {
  // numSelected: number;
  tableName: string;
}
export interface HeadCell {
  disablePadding: boolean;
  id: keyof TaskItemApiFields | string;
  label: string;
  align: "left" | "center" | "right";
  width: string;
}
