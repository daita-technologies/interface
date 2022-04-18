import {
  GetProjectHealthCheckInfoParams,
  GetRunHealthCheckStatusParams,
  RunHealthCheckParams,
} from "services/healthCheckApi";
import {
  GET_PROJECT_HEALTH_CHECK_INFO,
  GET_RUN_HEALTH_CHECK_STATUS,
  RUN_HEALTH_CHECK,
} from "./constants";

export const runHealthCheckAction = (payload: RunHealthCheckParams) => ({
  type: RUN_HEALTH_CHECK.REQUESTED,
  payload,
});

export const getRunHealthCheckStatusAction = (
  payload: GetRunHealthCheckStatusParams
) => ({
  type: GET_RUN_HEALTH_CHECK_STATUS.REQUESTED,
  payload,
});

export const getProjectHealthCheckInfoAction = (
  payload: GetProjectHealthCheckInfoParams
) => ({
  type: GET_PROJECT_HEALTH_CHECK_INFO.REQUESTED,
  payload,
});
