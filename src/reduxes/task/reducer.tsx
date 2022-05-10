import {
  ALL_TASK_TYPE_ARRAY,
  AUGMENT_TASK_PROCESS_TYPE,
  DOWNLOAD_TASK_PROCESS_TYPE,
  HEALTHCHECK_TASK_PROCESS_TYPE,
  PREPROCESS_TASK_PROCESS_TYPE,
  UPLOAD_TASK_PROCESS_TYPE,
} from "constants/defaultValues";
import { TaskProcessType } from "constants/taskType";
import { FETCH_TASK_INFO } from "reduxes/project/constants";
import { FetchTaskInfoSucceedPayload } from "reduxes/project/type";
import {
  GetTaskListFilterParams,
  GetTaskListInfoSuceededActionPayload,
} from "services/taskApi";
import {
  CHANGE_PAGE_TASK_LIST_INFO,
  FILTER_TASK_LIST_INFO,
  GET_TASK_LIST_INFO,
  TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE,
} from "./constants";
import {
  FilterTaskListInfoFailedActionPayload,
  FilterTaskListInfoSucceededActionPayload,
  PaginationTaskListInfoFailedActionPayload,
  PaginationTaskListInfoRequestActionPayload,
  PaginationTaskListInfoSucceedActionPayload,
  TaskReducer,
} from "./type";

const inititalState: TaskReducer = {
  [PREPROCESS_TASK_PROCESS_TYPE]: {
    ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE,
  },
  [AUGMENT_TASK_PROCESS_TYPE]: {
    ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE,
  },
  [UPLOAD_TASK_PROCESS_TYPE]: {
    ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE,
  },
  [DOWNLOAD_TASK_PROCESS_TYPE]: {
    ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE,
  },
  [HEALTHCHECK_TASK_PROCESS_TYPE]: {
    ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE,
  },
  isPageLoading: false,
};

const taskReducer = (state = inititalState, action: any): TaskReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case GET_TASK_LIST_INFO.REQUESTED: {
      return {
        ...inititalState,
        isPageLoading: true,
      };
    }
    case GET_TASK_LIST_INFO.SUCCEEDED: {
      const { filter, response } =
        payload as GetTaskListInfoSuceededActionPayload;

      const cloneState = { ...state };

      ALL_TASK_TYPE_ARRAY.forEach((processTypeName: TaskProcessType) => {
        cloneState[processTypeName].taskListInfo = {
          ...response[processTypeName],
        };
        cloneState[processTypeName].filter = { ...filter };
      });

      return {
        ...cloneState,
        isPageLoading: false,
      };
    }
    case GET_TASK_LIST_INFO.FAILED: {
      return {
        ...state,
        isPageLoading: false,
      };
    }
    case FILTER_TASK_LIST_INFO.REQUESTED: {
      const { processType } = payload as GetTaskListFilterParams;

      if (processType) {
        const cloneState = { ...state };
        processType.forEach((eachProcessType) => {
          cloneState[eachProcessType] = {
            ...cloneState[eachProcessType],
            taskListInfo: {
              ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE.taskListInfo,
            },
            isLoading: true,
            filter: { ...payload },
            currentPage: null,
          };
        });

        return cloneState;
      }

      return state;
    }
    case FILTER_TASK_LIST_INFO.SUCCEEDED: {
      const { filter, response } =
        payload as FilterTaskListInfoSucceededActionPayload;
      const { processType } = filter;

      if (processType) {
        const cloneState = { ...state };
        processType.forEach((eachProcessType) => {
          cloneState[eachProcessType] = {
            ...cloneState[eachProcessType],
            taskListInfo: { ...response[eachProcessType] },
            isLoading: false,
            filter,
            currentPage: null,
          };
        });

        return cloneState;
      }

      return {
        ...state,
        isPageLoading: false,
      };
    }
    case FILTER_TASK_LIST_INFO.FAILED: {
      const { filter } = payload as FilterTaskListInfoFailedActionPayload;
      const { processType } = filter;

      if (processType) {
        const cloneState = { ...state };
        processType.forEach((eachProcessType) => {
          cloneState[eachProcessType] = {
            ...cloneState[eachProcessType],
            taskListInfo: {
              ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE.taskListInfo,
            },
            isLoading: false,
            filter,
            currentPage: null,
          };
        });

        return cloneState;
      }

      return {
        ...state,
        isPageLoading: false,
      };
    }
    case CHANGE_PAGE_TASK_LIST_INFO.REQUESTED: {
      const { filter, processType } =
        payload as PaginationTaskListInfoRequestActionPayload;

      if (processType) {
        const cloneState = { ...state };

        cloneState[processType] = {
          ...cloneState[processType],
          taskListInfo: {
            ls_task: {
              ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE.taskListInfo
                .ls_task,
            },
            ls_page_token: [
              ...cloneState[processType].taskListInfo.ls_page_token,
            ],
          },

          isLoading: true,
          filter,
          // currentPage,
        };

        return cloneState;
      }

      return state;
    }
    case CHANGE_PAGE_TASK_LIST_INFO.SUCCEEDED: {
      const { filter, targetPage, response, processType } =
        payload as PaginationTaskListInfoSucceedActionPayload;

      if (processType) {
        const cloneState = { ...state };

        cloneState[processType] = {
          ...cloneState[processType],
          taskListInfo: {
            ls_page_token: [
              ...cloneState[processType].taskListInfo.ls_page_token,
            ],
            ls_task: response[processType].ls_task,
          },
          isLoading: false,
          filter,
          currentPage: targetPage,
        };

        return cloneState;
      }
      return state;
    }
    case CHANGE_PAGE_TASK_LIST_INFO.FAILED: {
      const { processType } =
        payload as PaginationTaskListInfoFailedActionPayload;

      if (processType) {
        const cloneState = { ...state };

        cloneState[processType] = {
          ...cloneState[processType],
          isLoading: false,
        };

        return cloneState;
      }

      return state;
    }

    case FETCH_TASK_INFO.SUCCEEDED: {
      const { taskInfo } = payload as FetchTaskInfoSucceedPayload;
      const { task_id, process_type, status } = taskInfo;

      if (process_type) {
        const cloneState = { ...state };
        const cloneMatchTaskList = [
          ...cloneState[process_type].taskListInfo.ls_task,
        ];

        const matchTaskIndex = cloneMatchTaskList.findIndex(
          (eachTaskInfo) => task_id === eachTaskInfo.task_id
        );

        if (matchTaskIndex > -1) {
          cloneState[process_type].taskListInfo.ls_task[matchTaskIndex] = {
            ...cloneState[process_type].taskListInfo.ls_task[matchTaskIndex],
            ...taskInfo,
          };
        } else {
          cloneState[process_type].taskListInfo.ls_task.unshift({
            identity_id: "",
            project_id: "",
            created_time: "",
            ...taskInfo,
          });
        }

        return cloneState;
      }

      return state;
    }
    default:
      return state;
  }
};

export default taskReducer;
