import { asyncAction } from "utils/general";
import { TaskReducerEachProcessType } from "./type";

export const GET_TASK_LIST_INFO = asyncAction("GET_TASK_LIST_INFO");

export const FILTER_TASK_LIST_INFO = asyncAction("FILTER_TASK_LIST_INFO");

export const CHANGE_PAGE_TASK_LIST_INFO = asyncAction(
  "CHANGE_PAGE_TASK_LIST_INFO"
);

export const TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE: TaskReducerEachProcessType =
  {
    isLoading: null,
    taskListInfo: { ls_task: [], ls_page_token: [] },
    currentPage: null,
    filter: null,
  };

export const TASK_LIST_PAGE_SIZE = 100;
