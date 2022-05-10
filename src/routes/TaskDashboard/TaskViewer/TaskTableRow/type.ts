import { TaskProcessType } from "constants/taskType";
import { ApiListProjectsItem } from "reduxes/project/type";
// import { TaskItemApiFields } from "services/taskApi";

export interface TaskTableRowProps {
  // taskInfo: TaskItemApiFields;
  taskId: string;
  processType: TaskProcessType;
  listProject: ApiListProjectsItem[];
}
