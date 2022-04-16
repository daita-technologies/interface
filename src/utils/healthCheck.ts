import { EXTENSION_HEALTH_CHECK_FIELD } from "constants/healthCheck";

export function getChartTypeFromAttributeName(fieldName: string) {
  switch (fieldName) {
    case EXTENSION_HEALTH_CHECK_FIELD.value:
      return "pie";
    default:
      return "line";
  }
}

export function switchHealthCheckFieldTo2() {
  // NOTE: empty function for export warning
}
