import { asyncAction } from "utils/general";
import { TaskReducerEachProcessType } from "./type";

export const GET_TASK_LIST_INFO = asyncAction("GET_TASK_LIST_INFO");

export const FILTER_TASK_LIST_INFO = asyncAction("FILTER_TASK_LIST_INFO");

export const CHANGE_PAGE_TASK_LIST_INFO = asyncAction(
  "CHANGE_PAGE_TASK_LIST_INFO"
);

export const TRIGGER_STOP_TASK_PROCESS = asyncAction(
  "TRIGGER_STOP_TASK_PROCESS"
);
export const ADD_TASK_TO_CURRENT_DASHBOARD = "ADD_TASK_TO_CURRENT_DASHBOARD";

export const PROJECT_DETAIL_TASK_PLACEMENT_PAGE_NAME = "projectDetail";
export const HEALTH_CHECK_TASK_PLACEMENT_PAGE_NAME = "healthCheck";
export const GOTO_TASK_DASHBOARD_ALERT = "GOTO_TASK_DASHBOARD_ALERT";

export const TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE: TaskReducerEachProcessType =
  {
    isLoading: null,
    taskListInfo: { ls_task: [], ls_page_token: [] },
    currentPage: 0,
    filter: null,
  };

export const FILTER_DEFAULT_VALUE = {
  projectId: "",
  processType: [],
  statusQuery: [],
};

export const TASK_LIST_PAGE_SIZE = 6;
