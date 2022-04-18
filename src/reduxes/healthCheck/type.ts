import { HealthCheckFields } from "services/healthCheckApi";

export interface HealthCheckReducer {
  isLoading: boolean;
  isRunningHealthCheck: boolean;
  isFetchingHealthCheckStatus: boolean;
  activeDataHealthCheck?: null | HealthCheckFields[];
}
