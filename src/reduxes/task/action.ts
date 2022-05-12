import {
  GetTaskListFilterParams,
  GetTaskListInfoFailedActionPayload,
  GetTaskListInfoSuceededActionPayload,
  GetTaskListParams,
} from "services/taskApi";
import {
  CHANGE_PAGE_TASK_LIST_INFO,
  FILTER_TASK_LIST_INFO,
  GET_TASK_LIST_INFO,
} from "./constants";
import {
  FilterTaskListInfoSucceededActionPayload,
  FilterTaskListInfoFailedActionPayload,
  PaginationTaskListInfoRequestActionPayload,
  PaginationTaskListInfoSucceedActionPayload,
  PaginationTaskListInfoFailedActionPayload,
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
