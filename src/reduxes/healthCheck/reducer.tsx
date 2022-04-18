import {
  GetProjectHealthCheckInfoReponseFields,
  // RunHealthCheckResponseFields,
} from "services/healthCheckApi";
import {
  GET_PROJECT_HEALTH_CHECK_INFO,
  GET_RUN_HEALTH_CHECK_STATUS,
  RUN_HEALTH_CHECK,
} from "./constants";
import { HealthCheckReducer } from "./type";

const inititalState: HealthCheckReducer = {
  isLoading: false,
  isRunningHealthCheck: false,
  isFetchingHealthCheckStatus: false,
  activeDataHealthCheck: null,
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
      // TODO: ls_task here
      // const { task_id } = payload as RunHealthCheckResponseFields;

      return { ...state, isRunningHealthCheck: false };
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

    default:
      return state;
  }
};

export default healthCheckReducer;
