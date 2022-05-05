import { TaskProcessType } from "constants/taskType";

import { TaskInfoApiFields } from "reduxes/project/type";

export interface TaskViewerProps {
  taskProcessType: TaskProcessType;
}

// export type TaskStatus =
//   | "Preparing"
//   | "Running"
//   | "Done"
//   | "Done with warning"
//   | "Error";

export interface EnhancedTableToolbarProps {
  // numSelected: number;
  tableName: string;
}
export interface HeadCell {
  disablePadding: boolean;
  id: keyof TaskInfoApiFields;
  label: string;
  align: "left" | "center" | "right";
}
export interface TableFilterOption {
  label: string;
  key: keyof TaskInfoApiFields;
  options: string[];
}
export interface TableFilterProps {
  filters: TableFilterOption[];
  onChange: (tableFilterType: TableFilterType) => void;
}
export interface TableFilterType {
  key: keyof TaskInfoApiFields;
  value: string | null;
}
