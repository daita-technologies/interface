import axios from "axios";
import {
  annotationProjectApiURL,
  createProjectSampleApiUrl,
  getAuthHeader,
  ID_TOKEN_NAME,
} from "constants/defaultValues";
import { CloneProjectToAnnotationProps } from "reduxes/annotationProject/type";
import { getLocalStorage } from "utils/general";

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
};
export default annotationProjectApi;
