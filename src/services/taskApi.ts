import axios from "axios";
import {
  getAuthHeader,
  ID_TOKEN_NAME,
  PREPROCESS_TASK_TYPE,
  AUGMENT_TASK_TYPE,
  UPLOAD_TASK_TYPE,
  DOWNLOAD_TASK_TYPE,
  HEALTHCHECK_TASK_TYPE,
  taskApiURL,
} from "constants/defaultValues";
import { TaskProcessType, TaskStatusMergedType } from "constants/taskType";
import { TaskStatusType } from "reduxes/project/type";
import { getLocalStorage } from "utils/general";

export type GetTaskListFilterParams = {
  projectId: string;
  processType: TaskProcessType[];
  statusQuery: TaskStatusMergedType[];
};

export interface GetTaskListParams {
  idToken?: string;
  filter: GetTaskListFilterParams;
  pagination: {
    pageToken: string | null;
  };
  sizeListItemsQuery: number;
}

export type TaskItemApiFields = {
  identity_id: string;
  task_id: string;
  created_time: string;
  project_id: string;
  process_type: TaskProcessType;
  status: TaskStatusType;
};

export interface TaskListEachProcessTypeResponseApiFields {
  ls_task: TaskItemApiFields[];
  ls_page_token: { [key: string]: any }[];
}

export interface TaskListResponseApiFields {
  [PREPROCESS_TASK_TYPE]: TaskListEachProcessTypeResponseApiFields;
  [AUGMENT_TASK_TYPE]: TaskListEachProcessTypeResponseApiFields;
  [UPLOAD_TASK_TYPE]: TaskListEachProcessTypeResponseApiFields;
  [DOWNLOAD_TASK_TYPE]: TaskListEachProcessTypeResponseApiFields;
  [HEALTHCHECK_TASK_TYPE]: TaskListEachProcessTypeResponseApiFields;
}

const taskApi = {
  getTaskList: ({
    idToken,
    filter,
    pagination,
    sizeListItemsQuery,
  }: GetTaskListParams) => {
    const { projectId, processType, statusQuery } = filter;
    const { pageToken } = pagination;

    return axios.post(
      `${taskApiURL}/task_dashboard/get_info`,
      {
        id_token: idToken || getLocalStorage(ID_TOKEN_NAME) || "",
        filter: {
          project_id: projectId,
          process_type: processType,
          status_query: statusQuery,
        },
        pagination: {
          page_token: pageToken,
        },
        size_list_items_query: sizeListItemsQuery,
      },
      { headers: getAuthHeader() }
    );
  },
};

export default taskApi;
