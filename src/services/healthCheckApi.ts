import axios from "axios";
import {
  healthCheckApiURL,
  getAuthHeader,
  ID_TOKEN_NAME,
  ORIGINAL_SOURCE,
} from "constants/defaultValues";
import { TaskProcessType } from "constants/taskType";
import { ImageSourceType } from "reduxes/album/type";
import { TaskStatusType } from "reduxes/project/type";
import { getLocalStorage } from "utils/general";

export interface RunHealthCheckParams {
  idToken?: string;
  projectId: string;
  dataType: ImageSourceType;
}

export interface RunHealthCheckResponseFields {
  task_id: string;
  process_type: TaskProcessType;
}

export interface GetProjectHealthCheckInfoParams {
  idToken?: string;
  projectId: string;
  dataType: ImageSourceType;
}

export interface HealthCheckFields {
  healthcheck_id: string;
  data_type: ImageSourceType;
  project_id: string;
  file_name: string;
  signal_to_noise_green_channel: number;
  signal_to_noise_red_channel: number;
  signal_to_noise_blue_channel: number;
  sharpness: number;
  luminance: number;
  width: number;
  height: number;
  aspect_ratio: number;
  file_size: number;
  extension: string;
  contrast: number;
  mean_red_channel: number;
  mean_blue_channel: number;
  mean_green_channel: number;
}

export type GetProjectHealthCheckInfoReponseFields = HealthCheckFields[];

export interface GetRunHealthCheckStatusParams {
  idToken?: string;
  taskId: string;
}

export interface GetRunHealthCheckStatusResponseFields {
  status: TaskStatusType;
}

const healthCheckApi = {
  runHealthCheck: ({
    idToken,
    projectId,
    dataType = ORIGINAL_SOURCE,
  }: RunHealthCheckParams) =>
    axios.post(
      `${healthCheckApiURL}/health_check/calculate`,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || idToken || "",
        project_id: projectId,
        data_type: dataType,
      },
      { headers: getAuthHeader() }
    ),
  getRunHealthCheckStatus: ({
    idToken,
    taskId,
  }: GetRunHealthCheckStatusParams) =>
    axios.post(
      `${healthCheckApiURL}/health_check/status`,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || idToken || "",
        task_id: taskId,
      },
      { headers: getAuthHeader() }
    ),
  getProjectHealthCheckInfo: ({
    idToken,
    projectId,
    dataType,
  }: GetProjectHealthCheckInfoParams) =>
    axios.post(
      `${healthCheckApiURL}/health_check/info`,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || idToken || "",
        project_id: projectId,
        data_type: dataType,
      },
      { headers: getAuthHeader() }
    ),
};

export default healthCheckApi;
