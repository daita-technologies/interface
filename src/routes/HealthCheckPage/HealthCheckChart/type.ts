import { HealthCheckFields } from "services/healthCheckApi";
import { DataHealthCheckSelectedAttribute } from "../HealthCheckMainContent/type";

export type DataHealthCheckChartType = "line" | "pie";

export interface HealthCheckChartProps {
  data: HealthCheckFields[];
  chartType: DataHealthCheckChartType;
  selectedAttribue: DataHealthCheckSelectedAttribute;
}
