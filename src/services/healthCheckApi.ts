import axios from "axios";
import {
  healthCheckApiURL,
  getAuthHeader,
  ID_TOKEN_NAME,
  ORIGINAL_SOURCE,
} from "constants/defaultValues";
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
}

export interface GetProjectHealthCheckInfoParams {
  idToken?: string;
  projectId: string;
  dataType: ImageSourceType;
}

export interface HealthCheckFields {
  healthcheck_id: "00729a84-50d1-4f83-bb5a-bdd70b5b57ab";
  data_type: "ORIGINAL";
  project_id: "prj1_5be2470b86414756b8169d7a78231756";
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
      `${healthCheckApiURL}/send-mail/reference-email`,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || idToken || "",
        project_id: projectId,
        dataType,
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
