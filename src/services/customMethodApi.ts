import axios from "axios";
import { AugmentCustomMethodParamType } from "constants/customMethod";
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
export interface GenerateReferenceImagesParams {
  idToken?: string;
  projectId: string;
  selectedMethodIds: string[];
  projectName: string;
}
export interface GetAugmentCustomMethodPreviewImageParams {
  idToken?: string;
  methodId: string;
}

export type AugmentCustomMethodParamInfo = {
  step: number;
  type: AugmentCustomMethodParamType;
};

export interface GetAugmentCustomMethodPreviewImageResponse {
  method_id: string;
  ls_params_name: string[];
  ls_params_value: {
    [paramName: string]: number[] | boolean[];
  };
  ls_param_info: {
    [paramName: string]: AugmentCustomMethodParamInfo;
  };
  dict_aug_img: {
    [paramIndex: string]: string;
  };
}

const customMethodApi = {
  generateReferenceImages: ({
    idToken,
    projectId,
    selectedMethodIds,
    projectName,
  }: GenerateReferenceImagesParams) =>
    axios.post(
      `${customMethodUrl}/reference_image/calculate`,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || idToken || "",
        project_id: projectId,
        ls_method_client_choose: selectedMethodIds,
        project_name: projectName,
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
  getAugmentCustomMethodPreviewImage: ({
    idToken,
    methodId,
  }: GetAugmentCustomMethodPreviewImageParams) =>
    axios.post(
      `${customMethodUrl}/augmentation_review/get_aug_review`,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || idToken || "",
        method_id: methodId,
      },
      { headers: getAuthHeader() }
    ),
};
export default customMethodApi;
