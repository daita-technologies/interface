import { HealthCheckFields } from "services/healthCheckApi";

export type DataHealthCheckSelectedAttribute = {
  label: string;
  value: keyof HealthCheckFields;
  description: string;
  unit: string;
};
export interface HealthCheckMainContentProps {
  projectId: string;
}
