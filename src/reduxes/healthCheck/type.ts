import { GeneralTaskInfoApiFields, ProjectInfo } from "reduxes/project/type";
import { HealthCheckFields } from "services/healthCheckApi";

export type TaskListType = {
  [taskId: string]: GeneralTaskInfoApiFields;
} | null;
export interface HealthCheckReducer {
  isFetchingHealthCheckInfo: boolean | null;
  isFetchedAllTaskInfo: boolean | null;
  isRunningHealthCheck: boolean;
  isFetchingHealthCheckStatus: boolean;
  activeDataHealthCheck?: null | HealthCheckFields[];
  taskList: TaskListType;
  currentProjectInfo: null | ProjectInfo;
}

export interface RunHealthCheckSucceededActionPayload {
  taskId: string;
  projectId: string;
}
