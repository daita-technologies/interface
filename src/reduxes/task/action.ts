import { GetTaskListParams } from "services/taskApi";
import {
  CHANGE_PAGE_TASK_LIST_INFO,
  FILTER_TASK_LIST_INFO,
  GET_TASK_LIST_INFO,
} from "./constants";

export const getTaskListInfo = (payload: GetTaskListParams) => ({
  type: GET_TASK_LIST_INFO.REQUESTED,
  payload,
});

export const filterTaskListInfo = (payload: GetTaskListParams) => ({
  type: FILTER_TASK_LIST_INFO.REQUESTED,
  payload,
});

export const changePageTaskListInfo = (payload: GetTaskListParams) => ({
  type: CHANGE_PAGE_TASK_LIST_INFO.REQUESTED,
  payload,
});
