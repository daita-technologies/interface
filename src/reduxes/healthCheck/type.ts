import { ProjectInfo, TaskInfoApiFields } from "reduxes/project/type";
import { HealthCheckFields } from "services/healthCheckApi";

export interface HealthCheckReducer {
  isFetchingHealthCheckInfo: boolean | null;
  isFetchedAllTaskInfo: boolean | null;
  isRunningHealthCheck: boolean;
  isFetchingHealthCheckStatus: boolean;
  activeDataHealthCheck?: null | HealthCheckFields[];
  taskList: {
    [taskId: string]: TaskInfoApiFields;
  } | null;
  currentProjectInfo: null | ProjectInfo;
}
