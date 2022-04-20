import { HEALTHCHECK_TASK_TYPE } from "constants/defaultValues";
import lodash from "lodash";
import {
  GetProjectHealthCheckInfoReponseFields,
  RunHealthCheckResponseFields,
  // RunHealthCheckResponseFields,
} from "services/healthCheckApi";
import { FETCH_DETAIL_PROJECT, FETCH_TASK_INFO } from "../project/constants";
import { FetchTaskInfoSucceedPayload } from "../project/type";
import {
  GET_PROJECT_HEALTH_CHECK_INFO,
  GET_RUN_HEALTH_CHECK_STATUS,
  RESET_DATA_HEALTH_CHECK_STATE,
  RUN_HEALTH_CHECK,
} from "./constants";
import { HealthCheckReducer } from "./type";

const inititalState: HealthCheckReducer = {
  isLoading: false,
  isFetchAllTaskInfo: false,
  isRunningHealthCheck: false,
  isFetchingHealthCheckStatus: false,
  activeDataHealthCheck: null,
  taskList: {},
  currentProjectInfo: null,
};

const healthCheckReducer = (
  state = inititalState,
  action: any
): HealthCheckReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case RUN_HEALTH_CHECK.REQUESTED: {
      return { ...state, isRunningHealthCheck: true };
    }
    case RUN_HEALTH_CHECK.FAILED: {
      return { ...state, isRunningHealthCheck: false };
    }
    case RUN_HEALTH_CHECK.SUCCEEDED: {
      const { task_id } = payload as RunHealthCheckResponseFields;
      const { currentProjectInfo } = state;

      let targetCurrentProjectInfo = null;
      if (currentProjectInfo) {
        targetCurrentProjectInfo = { ...currentProjectInfo };
        targetCurrentProjectInfo.ls_task.push({
          task_id,
          process_type: HEALTHCHECK_TASK_TYPE,
        });
      }

      return {
        ...state,
        isRunningHealthCheck: false,
        isFetchAllTaskInfo: false,
        currentProjectInfo: targetCurrentProjectInfo,
      };
    }

    case GET_RUN_HEALTH_CHECK_STATUS.REQUESTED: {
      return { ...state, isFetchingHealthCheckStatus: true };
    }
    case GET_RUN_HEALTH_CHECK_STATUS.FAILED: {
      return { ...state, isFetchingHealthCheckStatus: false };
    }
    case GET_RUN_HEALTH_CHECK_STATUS.SUCCEEDED: {
      return { ...state, isFetchingHealthCheckStatus: false };
    }

    case GET_PROJECT_HEALTH_CHECK_INFO.REQUESTED: {
      return { ...state, isLoading: true, activeDataHealthCheck: null };
    }
    case GET_PROJECT_HEALTH_CHECK_INFO.SUCCEEDED: {
      return {
        ...state,
        isLoading: false,
        activeDataHealthCheck:
          payload as GetProjectHealthCheckInfoReponseFields,
      };
    }
    case GET_PROJECT_HEALTH_CHECK_INFO.FAILED: {
      return { ...state, isLoading: false };
    }

    case FETCH_TASK_INFO.SUCCEEDED: {
      const { taskInfo } = payload as FetchTaskInfoSucceedPayload;
      const { task_id } = taskInfo;
      const { taskList, currentProjectInfo } = state;

      const newTaskList = { ...taskList };
      newTaskList[task_id] = taskInfo as any;

      let targetIsFetchAllTaskInfo = false;
      if (
        Object.keys(newTaskList).length >=
        (currentProjectInfo?.ls_task.length || 0)
      ) {
        targetIsFetchAllTaskInfo = true;
      }
      return {
        ...state,
        taskList: newTaskList,
        isFetchAllTaskInfo: targetIsFetchAllTaskInfo,
      };
    }

    case FETCH_DETAIL_PROJECT.REQUESTED:
      return {
        ...state,
        isLoading: true,
        currentProjectInfo: null,
      };
    case FETCH_DETAIL_PROJECT.FAILED:
      return {
        ...state,
        isLoading: false,
        isFetchAllTaskInfo: true,
      };

    case FETCH_DETAIL_PROJECT.SUCCEEDED: {
      const { currentProjectInfo } = payload;
      let targetIsFetchAllTaskInfo = false;
      if (
        currentProjectInfo &&
        currentProjectInfo.ls_task &&
        currentProjectInfo.ls_task <= 0
      ) {
        targetIsFetchAllTaskInfo = true;
      }

      return {
        ...state,
        isLoading: false,
        currentProjectInfo,
        isFetchAllTaskInfo: targetIsFetchAllTaskInfo,
      };
    }

    case RESET_DATA_HEALTH_CHECK_STATE:
      return {
        ...state,
        ...lodash.omit(inititalState, "taskList"),
        isLoading: true,
      };
    default:
      return state;
  }
};

export default healthCheckReducer;
