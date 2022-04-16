import { RootState } from "reduxes";

export const selectorIsHealthCheckLoading = (state: RootState) =>
  state.healthCheckReducer.isLoading;

export const selectorIsRunningHealthCheck = (state: RootState) =>
  state.healthCheckReducer.isRunningHealthCheck;

export const selectorIsFetchingHealthCheckStatus = (state: RootState) =>
  state.healthCheckReducer.isFetchingHealthCheckStatus;

export const selectorActiveDataHealthCheck = (state: RootState) =>
  state.healthCheckReducer.activeDataHealthCheck;
