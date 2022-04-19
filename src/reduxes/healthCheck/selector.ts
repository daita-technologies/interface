import { RUNNING_TASK_STATUS } from "constants/defaultValues";
import _ from "lodash";
import { RootState } from "reduxes";

export const selectorIsHealthCheckLoading = (state: RootState) =>
  state.healthCheckReducer.isLoading ||
  !state.healthCheckReducer.isFetchAllTaskInfo;

export const selectorIsRunningHealthCheck = (state: RootState) =>
  state.healthCheckReducer.isRunningHealthCheck;

export const selectorIsFetchingHealthCheckStatus = (state: RootState) =>
  state.healthCheckReducer.isFetchingHealthCheckStatus;

export const selectorActiveDataHealthCheck = (state: RootState) =>
  state.healthCheckReducer.activeDataHealthCheck;

export const selectorDataHealthCheckTaskList = (state: RootState) =>
  state.healthCheckReducer.taskList;

export const selectorDataHealthCheckCurrentListTask = (state: RootState) => {
  const { currentProjectInfo } = state.healthCheckReducer;

  if (currentProjectInfo) {
    const { ls_task } = currentProjectInfo;

    if (ls_task) {
      return ls_task;
    }

    return [];
  }

  return [];
};

export const selectorIsDataHealthCheckGotTaskRunning = (
  state: RootState,
  projectId: string
) => {
  const { taskList } = state.healthCheckReducer;

  if (taskList) {
    const matchProjectIdTaskList = _.filter(
      taskList,
      (taskItem) => taskItem.project_id === projectId
    );

    return matchProjectIdTaskList.some(
      (taskItem) => taskItem.status === RUNNING_TASK_STATUS
    );
  }

  return false;
};
