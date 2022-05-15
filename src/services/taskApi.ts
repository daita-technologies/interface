import axios from "axios";
import {
  getAuthHeader,
  ID_TOKEN_NAME,
  PREPROCESS_TASK_PROCESS_TYPE,
  AUGMENT_TASK_PROCESS_TYPE,
  UPLOAD_TASK_PROCESS_TYPE,
  DOWNLOAD_TASK_PROCESS_TYPE,
  HEALTHCHECK_TASK_PROCESS_TYPE,
  taskApiURL,
  GENERATE_REFERENCE_IMAGE_TYPE,
} from "constants/defaultValues";
import { TaskProcessType, TaskStatusMergedType } from "constants/taskType";
import { TaskStatusType } from "reduxes/project/type";
import { getLocalStorage } from "utils/general";

export type GetTaskListFilterParams = {
  projectId: string;
  processType: Array<TaskProcessType>;
  statusQuery: Array<TaskStatusMergedType | "">;
};

export type PageTokenType = {
  [key: string]: any;
};

export type GetTaskListPaginationParams = {
  pageToken: PageTokenType | null;
};

export interface GetTaskListParams {
  idToken?: string;
  filter: GetTaskListFilterParams;
  pagination: GetTaskListPaginationParams;
  sizeListItemsQuery: number;
}

export interface GetTaskListInfoSuceededActionPayload {
  filter: GetTaskListFilterParams;
  response: TaskListResponseApiFields;
}

export interface GetTaskListInfoFailedActionPayload {
  filter: GetTaskListFilterParams;
}

export type TaskItemApiFields = {
  identity_id: string;
  task_id: string;
  created_time: string;
  project_id: string;
  process_type: TaskProcessType;
  status: TaskStatusType;
  number_finished?: number;
  number_gen_images?: number;
};

export interface TaskListEachProcessTypeResponseApiFields {
  ls_task: TaskItemApiFields[];
  ls_page_token: { [key: string]: any }[];
}

export interface TaskListResponseApiFields {
  [PREPROCESS_TASK_PROCESS_TYPE]: TaskListEachProcessTypeResponseApiFields;
  [AUGMENT_TASK_PROCESS_TYPE]: TaskListEachProcessTypeResponseApiFields;
  [UPLOAD_TASK_PROCESS_TYPE]: TaskListEachProcessTypeResponseApiFields;
  [DOWNLOAD_TASK_PROCESS_TYPE]: TaskListEachProcessTypeResponseApiFields;
  [HEALTHCHECK_TASK_PROCESS_TYPE]: TaskListEachProcessTypeResponseApiFields;
  [GENERATE_REFERENCE_IMAGE_TYPE]: TaskListEachProcessTypeResponseApiFields;
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
