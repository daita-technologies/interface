import { ProjectInfo, TaskInfoApiFields } from "reduxes/project/type";
import { HealthCheckFields } from "services/healthCheckApi";

export interface HealthCheckReducer {
  isLoading: boolean;
  isFetchAllTaskInfo: boolean;
  isRunningHealthCheck: boolean;
  isFetchingHealthCheckStatus: boolean;
  activeDataHealthCheck?: null | HealthCheckFields[];
  taskList: {
    [taskId: string]: TaskInfoApiFields;
  };
  currentProjectInfo: null | ProjectInfo;
}
