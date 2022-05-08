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

export const selectorSpecificProcessFilter = (
  needProcessType: TaskProcessType,
  state: RootState
) => state.taskReducer[needProcessType].filter;

export const selectorSpecificProcessCurrentPage = (
  needProcessType: TaskProcessType,
  state: RootState
) => state.taskReducer[needProcessType].currentPage;

export const selectorSpecificProcessListPage = (
  needProcessType: TaskProcessType,
  state: RootState
) => state.taskReducer[needProcessType].taskListInfo.ls_page_token;
