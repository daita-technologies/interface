import axios from "axios";
import {
  stopApiURL,
  getAuthHeader,
  IDENTITY_ID_NAME,
} from "constants/defaultValues";

import { getLocalStorage } from "utils/general";

export interface StopProcessParams {
  identityId?: string;
  taskId: string;
}

const stopProcessApi = {
  stopProcess: ({ identityId, taskId }: StopProcessParams) =>
    axios.post(
      `${stopApiURL}/task/stop_proceess `,
      {
        identity_id: identityId || getLocalStorage(IDENTITY_ID_NAME) || "",
        task_id: taskId,
      },
      { headers: getAuthHeader() }
    ),
};

export default stopProcessApi;
