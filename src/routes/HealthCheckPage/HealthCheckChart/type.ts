import { HealthCheckFields } from "services/healthCheckApi";

export interface HealthCheckChartProps {
  projectId: string;
  data: HealthCheckFields[];
}
