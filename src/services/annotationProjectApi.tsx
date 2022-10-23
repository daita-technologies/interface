import axios from "axios";
import {
  annotationProjectApiURL,
  FETCH_ANNOTATION_NUM_FILE_LIMIT,
  getAuthHeader,
  ID_TOKEN_NAME,
} from "constants/defaultValues";
import {
  CloneProjectToAnnotationProps,
  DeleteAnnotationProjectProps,
  FetchAnnotationAndFileInfoProps,
  FetchAnnotationFilesProps,
} from "reduxes/annotationProject/type";
import { getLocalStorage } from "utils/general";
export interface AddListOfClassNameToCategoryProps {
  idToken: string;
  categoryId: string;
  lsClassName: string[];
}

export interface SaveLabelProps {
  idToken: string;
  fileId: string;
  dictS3Key: Record<string, string>;
}
const annotationProjectApi = {
  cloneProbjectToAnnotation: ({
    fromProjectName,
    annotationProjectDescription,
    annotationProjectName,
  }: CloneProjectToAnnotationProps) => {
    return axios.post(
      `${annotationProjectApiURL}/annotation/project/clone_from_daita`,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || "",
        anno_project_name: annotationProjectName,
        daita_project_name: fromProjectName,
        project_info: annotationProjectDescription,
      },
      { headers: getAuthHeader() }
    );
  },
  listProjects: ({ idToken }: { idToken: string }) =>
    axios.post(
      `${annotationProjectApiURL}/annotation/project/list_project`,
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
      `${annotationProjectApiURL}/annotation/project/get_info`,
      {
        id_token: idToken,
        project_name: projectName,
      },
      { headers: getAuthHeader() }
    ),
  annotationAndFileInfo: ({
    idToken,
    projectId,
    filename,
    categoryId,
  }: FetchAnnotationAndFileInfoProps) =>
    axios.post(
      `${annotationProjectApiURL}/annotation/file/get_file_info_n_label`,
      {
        id_token: idToken,
        project_id: projectId,
        filename,
        category_id: categoryId,
      },
      { headers: getAuthHeader() }
    ),
  getAnnotationFilesOfProject: ({
    idToken,
    projectId,
    nextToken,
    numLimit = FETCH_ANNOTATION_NUM_FILE_LIMIT,
  }: FetchAnnotationFilesProps) =>
    axios.post(
      `${annotationProjectApiURL}/annotation/project/list_data`,
      {
        id_token: idToken,
        project_id: projectId,
        next_token: nextToken,
        num_limit: numLimit,
      },
      { headers: getAuthHeader() }
    ),
  addListOfClassNameToCategory: ({
    idToken,
    categoryId,
    lsClassName,
  }: AddListOfClassNameToCategoryProps) =>
    axios.post(
      `${annotationProjectApiURL}/annotation/category/add_class`,
      {
        id_token: idToken,
        category_id: categoryId,
        ls_class_name: lsClassName,
      },
      { headers: getAuthHeader() }
    ),
  saveLabel: ({ idToken, fileId, dictS3Key }: SaveLabelProps) =>
    axios.post(
      `${annotationProjectApiURL}/annotation/file/save_label`,
      {
        id_token: idToken,
        file_id: fileId,
        dict_s3_key: dictS3Key,
      },
      { headers: getAuthHeader() }
    ),
  deleteProject: ({
    idToken,
    projectId,
    projectName,
  }: DeleteAnnotationProjectProps) =>
    axios.post(
      `${annotationProjectApiURL}/annotation/project/delete_project`,
      {
        id_token: idToken,
        project_id: projectId,
        project_name: projectName,
      },
      { headers: getAuthHeader() }
    ),
};
export default annotationProjectApi;
