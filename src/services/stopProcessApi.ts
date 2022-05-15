import axios from "axios";
import {
  stopApiURL,
  getAuthHeader,
  ID_TOKEN_NAME,
} from "constants/defaultValues";

import { getLocalStorage } from "utils/general";

export interface StopProcessParams {
  idToken?: string;
  taskId: string;
}

const stopProcessApi = {
  stopProcess: ({ idToken, taskId }: StopProcessParams) =>
    axios.post(
      `${stopApiURL}/task/stop_proceess `,
      {
        id_token: getLocalStorage(ID_TOKEN_NAME) || idToken || "",
        task_id: taskId,
      },
      { headers: getAuthHeader() }
    ),
};

export default stopProcessApi;
