import {
  ALL_TASK_TYPE_ARRAY,
  AUGMENT_TASK_TYPE,
  DOWNLOAD_TASK_TYPE,
  HEALTHCHECK_TASK_TYPE,
  PREPROCESS_TASK_TYPE,
  UPLOAD_TASK_TYPE,
} from "constants/defaultValues";
import { TaskProcessType } from "constants/taskType";
import {
  GetTaskListParams,
  TaskListEachProcessTypeResponseApiFields,
  TaskListResponseApiFields,
} from "services/taskApi";
import {
  FILTER_TASK_LIST_INFO,
  GET_TASK_LIST_INFO,
  TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE,
} from "./constants";
import { TaskReducer } from "./type";

const inititalState: TaskReducer = {
  [PREPROCESS_TASK_TYPE]: { ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE },
  [AUGMENT_TASK_TYPE]: { ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE },
  [UPLOAD_TASK_TYPE]: { ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE },
  [DOWNLOAD_TASK_TYPE]: { ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE },
  [HEALTHCHECK_TASK_TYPE]: { ...TASK_LIST_REDUCER_PROCESS_TYPE_DEFAULT_VALUE },
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
      const responseTaskList = payload as TaskListResponseApiFields;

      const cloneState = { ...state };

      ALL_TASK_TYPE_ARRAY.forEach((processTypeName: TaskProcessType) => {
        cloneState[processTypeName].taskListInfo = {
          ...responseTaskList[processTypeName],
        };
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
      // const { filter } = payload as GetTaskListParams;
      // const { statusQuery } = filter;

      // if (processType) {
      //   return {
      //     ...state,
      //     [processType]: {
      //       ...state[processType],
      //       isLoading: true,
      //     },
      //   };
      // }
      return state;
    }
    case FILTER_TASK_LIST_INFO.SUCCEEDED: {
      return {
        ...state,
        isPageLoading: false,
      };
    }
    case FILTER_TASK_LIST_INFO.FAILED: {
      return {
        ...state,
        isPageLoading: false,
      };
    }
    default:
      return state;
  }
};

export default taskReducer;
