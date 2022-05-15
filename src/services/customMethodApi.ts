import axios from "axios";
import {
  customMethodUrl,
  getAuthHeader,
  ID_TOKEN_NAME,
} from "constants/defaultValues";
import { getLocalStorage } from "utils/general";
import { GetTaskProgressRequestBody } from "./projectApi";

export interface ReferenceImagesParams {
  idToken?: string;
  projectId: string;
}

const customMethodApi = {
  generateReferenceImages: ({ idToken, projectId }: ReferenceImagesParams) =>
    axios.post(
      `${customMethodUrl}/reference_image/calculate`,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || idToken || "",
        project_id: projectId,
      },
      { headers: getAuthHeader() }
    ),
  getReferenceImagesTaskInfo: ({
    idToken,
    taskId,
  }: GetTaskProgressRequestBody) =>
    axios.post(
      `${customMethodUrl}/reference_image/status`,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || idToken || "",
        task_id: taskId,
      },
      { headers: getAuthHeader() }
    ),
  getReferenceImageInfo: ({ idToken, projectId }: ReferenceImagesParams) =>
    axios.post(
      `${customMethodUrl}/reference_image/info`,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || idToken || "",
        project_id: projectId,
      },
      { headers: getAuthHeader() }
    ),
};
export default customMethodApi;
