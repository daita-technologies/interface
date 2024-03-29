import axios from "axios";
import { CreateProjectFields } from "components/CreateProjectModal/type";
import {
  projectApiUrl,
  getAuthHeader,
  VIEW_ALBUM_PAGE_SIZE,
  uploadZipApiUrl,
  generateApiUrl,
  ID_TOKEN_NAME,
  createProjectSampleApiUrl,
} from "constants/defaultValues";
import { ApiResponse } from "constants/type";
import { FetchImagesParams, ImageSourceType } from "reduxes/album/type";
import { GenerateImagePayload } from "reduxes/generate/type";
import { UpdateProjectInfoPayload } from "reduxes/project/type";
import { getLocalStorage } from "utils/general";

export interface UploadUpdateListObjectInfo {
  // NOTE: <bucket>/<identity_id>/<project_id>/<data_name>
  s3Key: string;
  fileName: string;
  hash: string;
  // NOTE: 'byte' unit
  size: number;
  isOrigin?: boolean;
  genId?: string;
  sizeOld?: number;
}

export interface GetTaskProgressRequestBody {
  idToken: string;
  taskId: string;
}

export interface GetListMethodRequestBody {
  idToken: string;
}

export interface CreateSampleRequestBody {
  idToken: string;
  accessToken: string;
}

export interface CreateSampleProjectFromPrebuildRequestBody {
  idToken: string;
  name_id_prebuild: string;
  number_random: string;
}
export interface DeleteProjectRequestBody {
  idToken: string;
  projectId: string;
  projectName: string;
}

export interface DeleteObjectInfo {
  filename: string;
  size: number;
  type_method: ImageSourceType;
}
export interface DeleteImagesRequestBody {
  idToken: string;
  projectId: string;
  listObjectInfo: Array<DeleteObjectInfo>;
}

export interface GetUploadTokenResponse extends ApiResponse {
  data: {
    token: string;
  };
}

export const convertToUnderScoreValue = (
  listObjectInfoItem: UploadUpdateListObjectInfo
) => ({
  s3_key: listObjectInfoItem.s3Key,
  filename: listObjectInfoItem.fileName,
  hash: listObjectInfoItem.hash,
  size: listObjectInfoItem.size,
  // NOTE: if data uploaded by client, it is True, if it was generated from AI so put it false, the default is True
  is_ori: true,
  // NOTE: the id that contain the detail information of generation method. Default is ''
  gen_id: "",
  // NOTE: size_old is required when replace
  size_old: listObjectInfoItem.sizeOld,
});

const projectApi = {
  createProject: ({
    idToken,
    accessToken,
    projectName,
    description,
    createProjectPreBuild,
  }: CreateProjectFields) => {
    if (createProjectPreBuild) {
      return axios.post(
        `${createProjectSampleApiUrl}/projects/create_project_from_prebuild`,
        {
          id_token: idToken,
          project_name: projectName,
          project_info: description,
          name_id_prebuild: createProjectPreBuild.nameIdPrebuild,
          number_random: createProjectPreBuild.numberRadom,
        },
        { headers: getAuthHeader() }
      );
    }
    return axios.post(
      `${projectApiUrl}/projects/create`,
      {
        id_token: idToken,
        access_token: accessToken,
        project_name: projectName,
        project_info: description,
      },
      { headers: getAuthHeader() }
    );
  },
  listProjects: ({ idToken }: { idToken: string }) =>
    axios.post(
      `${projectApiUrl}/projects/list_info`,
      {
        id_token: idToken,
      },
      { headers: getAuthHeader() }
    ),
  detailProject: ({
    idToken,
    projectName,
  }: {
    idToken: string;
    projectName: string;
  }) =>
    axios.post(
      `${projectApiUrl}/projects/info`,
      {
        id_token: idToken,
        project_name: projectName,
      },
      { headers: getAuthHeader() }
    ),
  uploadCheck: ({
    idToken,
    projectId,
    listFileName,
  }: {
    idToken: string;
    projectId: string;
    listFileName: Array<string>;
  }) =>
    axios.post(
      `${projectApiUrl}/projects/upload_check`,
      {
        id_token: idToken,
        project_id: projectId,
        ls_filename: listFileName,
      },
      { headers: getAuthHeader() }
    ),

  uploadedUpdate: ({
    idToken,
    projectId,
    projectName,
    listObjectInfo,
  }: {
    idToken: string;
    projectId: string;
    projectName: string;
    listObjectInfo: Array<UploadUpdateListObjectInfo>;
  }) =>
    axios.post(
      `${projectApiUrl}/projects/upload_update`,
      {
        id_token: idToken,
        project_id: projectId,
        project_name: projectName,
        ls_object_info: listObjectInfo.map((info) =>
          convertToUnderScoreValue(info)
        ),
      },
      { headers: getAuthHeader() }
    ),
  listData: ({
    idToken,
    projectId,
    nextToken,
    typeMethod,
    numLimit = VIEW_ALBUM_PAGE_SIZE,
  }: FetchImagesParams) =>
    axios.post(
      `${projectApiUrl}/projects/list_data`,
      {
        id_token: idToken,
        project_id: projectId,
        next_token: nextToken,
        num_limit: numLimit,
        type_method: typeMethod,
      },
      { headers: getAuthHeader() }
    ),
  listMethod: ({ idToken }: GetListMethodRequestBody) =>
    axios.post(
      `${generateApiUrl}/generate/list_method`,
      {
        id_token: idToken,
      },
      { headers: getAuthHeader() }
    ),
  generateImages: ({
    idToken,
    projectId,
    projectName,
    listMethodId,
    dataType,
    numberImageGeneratePerSource,
    dataNumber,
    processType,
    referenceImages,
    augmentParameters,
  }: // isNormalizeResolution,
  GenerateImagePayload) => {
    const payload: any = {
      id_token: idToken,
      project_id: projectId,
      project_name: projectName,
      ls_method_id: listMethodId,
      data_type: dataType,
      process_type: processType,
      reference_images: referenceImages,
      // NOTE: TODO: pass number will generate per source later
      num_aug_per_imgs: 1 || numberImageGeneratePerSource,
      data_number: dataNumber,
      aug_parameters: augmentParameters,
    };
    // if (isNormalizeResolution !== undefined) {
    //   payload.is_normalize_resolution = isNormalizeResolution;
    // }
    return axios.post(`${generateApiUrl}/generate/generate_images`, payload, {
      headers: getAuthHeader(),
    });
  },
  getTaskInfo: ({ idToken, taskId }: GetTaskProgressRequestBody) =>
    axios.post(
      `${generateApiUrl}/generate/task_progress`,
      {
        id_token: idToken,
        task_id: taskId,
      },
      { headers: getAuthHeader() }
    ),
  getUploadZipTaskInfo: ({ idToken, taskId }: GetTaskProgressRequestBody) =>
    axios.get(`${uploadZipApiUrl}/dataflow/get_decompress_task`, {
      params: {
        id_token: idToken,
        task_id: taskId,
      },
    }),
  getListPrebuildDataset: ({ idToken }: { idToken?: string }) =>
    axios.post(
      `${createProjectSampleApiUrl}/projects/list_prebuild_dataset`,
      {
        id_token: idToken || getLocalStorage(ID_TOKEN_NAME) || "",
      },
      { headers: getAuthHeader() }
    ),
  deleteProject: ({
    idToken,
    projectId,
    projectName,
  }: DeleteProjectRequestBody) =>
    axios.post(
      `${generateApiUrl}/projects/delete`,
      {
        id_token: idToken,
        project_id: projectId,
        project_name: projectName,
      },
      { headers: getAuthHeader() }
    ),
  createSampleProject: ({ idToken, accessToken }: CreateSampleRequestBody) =>
    axios.post(
      `${projectApiUrl}/projects/create_sample`,
      {
        id_token: idToken,
        access_token: accessToken,
      },
      { headers: getAuthHeader() }
    ),
  deleteImages: ({
    idToken,
    projectId,
    listObjectInfo,
  }: DeleteImagesRequestBody) =>
    axios.post(
      `${generateApiUrl}/projects/delete_images`,
      {
        id_token: idToken,
        project_id: projectId,
        ls_object_info: listObjectInfo,
      },
      { headers: getAuthHeader() }
    ),
  updateProjectInfo: ({
    idToken,
    projectName,
    updateInfo,
  }: UpdateProjectInfoPayload) =>
    axios.post(
      `${projectApiUrl}/projects/update_info`,
      {
        id_token: idToken,
        cur_project_name: projectName,
        new_project_name:
          projectName === updateInfo.projectName ? "" : updateInfo.projectName,
        new_description: updateInfo.description,
      },
      { headers: getAuthHeader() }
    ),
  uploadZipFile: ({
    idToken,
    projectId,
    projectName,
    typeMethod,
    fileUrl,
  }: {
    idToken: string;
    projectId: string;
    projectName: string;
    typeMethod: string;
    fileUrl: string;
  }) =>
    axios.post(
      `${uploadZipApiUrl}/dataflow/create_decompress_task`,
      {
        id_token: idToken,
        project_id: projectId,
        project_name: projectName,
        type_method: typeMethod,
        file_url: fileUrl,
      },
      { headers: getAuthHeader() }
    ),
  getUploadToken: ({
    idToken,
    projectId,
    projectName,
  }: {
    idToken?: string;
    projectId: string;
    projectName: string;
  }) =>
    axios.post(
      `${uploadZipApiUrl}/generate/daita_upload_token`,
      {
        id_token: idToken || getLocalStorage(ID_TOKEN_NAME) || "",
        project_id: projectId,
        project_name: projectName,
      },
      { headers: getAuthHeader() }
    ),
};

export default projectApi;
