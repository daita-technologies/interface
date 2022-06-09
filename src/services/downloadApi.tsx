import axios from "axios";
import {
  downloadZipApiUrl,
  getAuthHeader,
  ID_TOKEN_NAME,
} from "constants/defaultValues";
import { DownloadType } from "constants/type";
import { TaskStatusType } from "reduxes/project/type";
import { getLocalStorage } from "utils/general";

export interface DownloadZipEc2Params {
  idToken: string;
  downType: DownloadType;
  projectName: string;
  projectId: string;
}

export interface DownloadZipEc2Progress {
  idToken?: string;
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
      `${downloadZipApiUrl}/dataflow/create_compress_download_task`,
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
      `${downloadZipApiUrl}/dataflow/get_compress_download_task`,
      {
        id_token: idToken || getLocalStorage(ID_TOKEN_NAME) || "",
        task_id: taskId,
      },
      {
        headers: getAuthHeader(),
      }
    ),
  headRequestDownloadLink: ({ url }: { url: string }) =>
    fetch(url, {
      method: "GET",
      headers: {
        range: "bytes=0-0",
      },
    }),
};

export default downloadApi;
