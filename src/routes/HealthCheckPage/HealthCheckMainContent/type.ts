import { HealthCheckFields } from "services/healthCheckApi";

export type DataHealthCheckSelectedAttribute = {
  label: string;
  value: keyof HealthCheckFields;
};
export interface HealthCheckMainContentProps {
  projectId: string;
}
