import {
  GetTaskListFilterParams,
  GetTaskListInfoFailedActionPayload,
  GetTaskListInfoSuceededActionPayload,
  GetTaskListParams,
  TaskItemApiFields,
} from "services/taskApi";
import {
  ADD_TASK_TO_CURRENT_DASHBOARD,
  CHANGE_PAGE_TASK_LIST_INFO,
  FILTER_TASK_LIST_INFO,
  GET_TASK_LIST_INFO,
  TRIGGER_STOP_TASK_PROCESS,
} from "./constants";
import {
  FilterTaskListInfoSucceededActionPayload,
  FilterTaskListInfoFailedActionPayload,
  PaginationTaskListInfoRequestActionPayload,
  PaginationTaskListInfoSucceedActionPayload,
  PaginationTaskListInfoFailedActionPayload,
  TriggerStopTaskProcessRequestActionPayload,
} from "./type";

export const getTaskListInfo = (payload: GetTaskListParams) => ({
  type: GET_TASK_LIST_INFO.REQUESTED,
  payload,
});

export const getTaskListInfoSuceeded = (
  payload: GetTaskListInfoSuceededActionPayload
) => ({
  type: GET_TASK_LIST_INFO.SUCCEEDED,
  payload,
});

export const getTaskListInfoFailed = (
  payload: GetTaskListInfoFailedActionPayload
) => ({
  type: GET_TASK_LIST_INFO.FAILED,
  payload,
});

export const filterTaskListInfo = (payload: GetTaskListFilterParams) => ({
  type: FILTER_TASK_LIST_INFO.REQUESTED,
  payload,
});

export const filterTaskListInfoSucceeded = (
  payload: FilterTaskListInfoSucceededActionPayload
) => ({
  type: FILTER_TASK_LIST_INFO.SUCCEEDED,
  payload,
});

export const filterTaskListInfoFailed = (
  payload: FilterTaskListInfoFailedActionPayload
) => ({
  type: FILTER_TASK_LIST_INFO.FAILED,
  payload,
});

export const changePageTaskListInfo = (
  payload: PaginationTaskListInfoRequestActionPayload
) => ({
  type: CHANGE_PAGE_TASK_LIST_INFO.REQUESTED,
  payload,
});

export const changePageTaskListInfoSucceeded = (
  payload: PaginationTaskListInfoSucceedActionPayload
) => ({
  type: CHANGE_PAGE_TASK_LIST_INFO.SUCCEEDED,
  payload,
});

export const changePageTaskListInfoFailed = (
  payload: PaginationTaskListInfoFailedActionPayload
) => ({
  type: CHANGE_PAGE_TASK_LIST_INFO.FAILED,
  payload,
});

export const triggerStopTaskProcess = (
  payload: TriggerStopTaskProcessRequestActionPayload
) => ({ type: TRIGGER_STOP_TASK_PROCESS.REQUESTED, payload });

export const addTaskToCurrentDashboard = (payload: TaskItemApiFields) => ({
  type: ADD_TASK_TO_CURRENT_DASHBOARD,
  payload,
});
