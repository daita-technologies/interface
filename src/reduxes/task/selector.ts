import { TaskProcessType } from "constants/taskType";
import { RootState } from "reduxes";

export const selectorIsTaskPageLoading = (state: RootState) =>
  state.taskReducer.isPageLoading;

export const selectorSpecificProcessTypeTaskInfo = (
  needProcessType: TaskProcessType,
  state: RootState
) => state.taskReducer[needProcessType];

export const selectorSpecificProcessIsLoading = (
  needProcessType: TaskProcessType,
  state: RootState
) => state.taskReducer[needProcessType].isLoading;
