import { asyncAction } from "utils/general";

export const RUN_HEALTH_CHECK = asyncAction("RUN_HEALTH_CHECK");
export const GET_RUN_HEALTH_CHECK_STATUS = asyncAction(
  "GET_RUN_HEALTH_CHECK_STATUS"
);
export const GET_PROJECT_HEALTH_CHECK_INFO = asyncAction(
  "GET_PROJECT_HEALTH_CHECK_INFO"
);

export const RESET_DATA_HEALTH_CHECK_STATE = "RESET_DATA_HEALTH_CHECK_STATE";
