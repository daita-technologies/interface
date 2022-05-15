import axios from "axios";
import { projectApiUrl, getAuthHeader } from "constants/defaultValues";
import { DownloadType } from "constants/type";
import { TaskStatusType } from "reduxes/project/type";

export interface DownloadZipEc2Params {
  idToken: string;
  downType: DownloadType;
  projectName: string;
  projectId: string;
}

export interface DownloadZipEc2Progress {
  idToken: string;
  taskId: string;
}

export interface DownloadZipEc2ProgressResponseFields {
  presign_url: null | string;
  s3_key: null | string;
  status: TaskStatusType;
}

export interface DownloadResponse {
  s3_key: string;
}

const downloadApi = {
  downloadCreate: ({
    idToken,
    downType,
    projectName,
    projectId,
  }: DownloadZipEc2Params) =>
    axios.post(
      `${projectApiUrl}/projects/download_create`,
      {
        id_token: idToken,
        down_type: downType,
        project_name: projectName,
        project_id: projectId,
      },
      { headers: getAuthHeader() }
    ),
  downloadUpdate: ({ idToken, taskId }: DownloadZipEc2Progress) =>
    axios.post(
      `${projectApiUrl}/projects/download_update`,
      {
        id_token: idToken,
        task_id: taskId,
      },
      { headers: getAuthHeader() }
    ),
};

export default downloadApi;
