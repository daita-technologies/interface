import {
  HEALTHCHECK_TASK_PROCESS_TYPE,
  IDENTITY_ID_NAME,
  RUNNING_TASK_STATUS,
} from "constants/defaultValues";
import {
  GetProjectHealthCheckInfoParams,
  GetProjectHealthCheckInfoReponseFields,
} from "services/healthCheckApi";
import { getLocalStorage } from "utils/general";
import { FETCH_DETAIL_PROJECT, FETCH_TASK_INFO } from "../project/constants";
import { FetchTaskInfoSucceedPayload, ProjectInfo } from "../project/type";
import {
  GET_PROJECT_HEALTH_CHECK_INFO,
  GET_RUN_HEALTH_CHECK_STATUS,
  RESET_DATA_HEALTH_CHECK_STATE,
  RUN_HEALTH_CHECK,
} from "./constants";
import {
  HealthCheckReducer,
  RunHealthCheckSucceededActionPayload,
  TaskListType,
} from "./type";

const inititalState: HealthCheckReducer = {
  isFetchingHealthCheckInfo: null,
  isFetchedAllTaskInfo: null,
  isRunningHealthCheck: false,
  isFetchingHealthCheckStatus: false,
  activeDataHealthCheck: null,
  taskList: null,
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
      const { taskId, projectId } =
        payload as RunHealthCheckSucceededActionPayload;
      const { currentProjectInfo } = state;

      let targetCurrentProjectInfo = null;
      const newTaskList = { ...state.taskList };
      if (currentProjectInfo) {
        targetCurrentProjectInfo = { ...currentProjectInfo };
        targetCurrentProjectInfo.ls_task.push({
          task_id: taskId,
          process_type: HEALTHCHECK_TASK_PROCESS_TYPE,
        });

        newTaskList[taskId] = {
          task_id: taskId,
          status: RUNNING_TASK_STATUS,
          process_type: HEALTHCHECK_TASK_PROCESS_TYPE,
          project_id: projectId,
          identity_id: getLocalStorage(IDENTITY_ID_NAME) || "",
        };
      }

      return {
        ...state,
        isRunningHealthCheck: false,
        isFetchedAllTaskInfo: false,
        taskList: newTaskList,
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
      const { notShowLoading } = payload as GetProjectHealthCheckInfoParams;
      if (state.activeDataHealthCheck === null) {
        return {
          ...state,
          isFetchingHealthCheckInfo: true,
          activeDataHealthCheck: null,
        };
      }

      return {
        ...state,
        isFetchingHealthCheckInfo: !notShowLoading,
        ...(notShowLoading ? undefined : { activeDataHealthCheck: null }),
      };
    }
    case GET_PROJECT_HEALTH_CHECK_INFO.SUCCEEDED: {
      return {
        ...state,
        isFetchingHealthCheckInfo: false,
        activeDataHealthCheck:
          payload as GetProjectHealthCheckInfoReponseFields,
      };
    }
    case GET_PROJECT_HEALTH_CHECK_INFO.FAILED: {
      return { ...state, isFetchingHealthCheckInfo: false };
    }

    case FETCH_TASK_INFO.SUCCEEDED: {
      const { taskInfo } = payload as FetchTaskInfoSucceedPayload;
      const { task_id } = taskInfo;
      const { taskList, currentProjectInfo } = state;

      const newTaskList = { ...taskList };
      newTaskList[task_id] = taskInfo as any;

      let targetIsFetchedAllTaskInfo = false;
      if (
        Object.keys(newTaskList).length >=
        (currentProjectInfo?.ls_task.length || 0)
      ) {
        targetIsFetchedAllTaskInfo = true;
      }
      return {
        ...state,
        taskList: newTaskList,
        isFetchedAllTaskInfo: targetIsFetchedAllTaskInfo,
      };
    }

    case FETCH_DETAIL_PROJECT.REQUESTED:
      return {
        ...state,
        currentProjectInfo: null,
      };
    case FETCH_DETAIL_PROJECT.FAILED:
      return {
        ...state,
        isFetchedAllTaskInfo: true,
      };

    case FETCH_DETAIL_PROJECT.SUCCEEDED: {
      const { currentProjectInfo } = payload as {
        currentProjectInfo: ProjectInfo;
      };
      let targetIsFetchedAllTaskInfo = false;
      let targetTaskList: TaskListType = null;

      if (currentProjectInfo && currentProjectInfo.ls_task) {
        const { ls_task, project_id } = currentProjectInfo;
        if (ls_task.length <= 0) {
          targetIsFetchedAllTaskInfo = true;
          targetTaskList = {};
        } else {
          ls_task.forEach((lsTaskInfo) => {
            targetTaskList = {
              [lsTaskInfo.task_id]: {
                identity_id: "",
                ...lsTaskInfo,
                project_id,
                status: RUNNING_TASK_STATUS,
              },
            };
          });
        }
      }

      return {
        ...state,
        currentProjectInfo,
        taskList: targetTaskList,
        isFetchedAllTaskInfo: targetIsFetchedAllTaskInfo,
      };
    }

    case RESET_DATA_HEALTH_CHECK_STATE:
      return inititalState;
    default:
      return state;
  }
};

export default healthCheckReducer;
