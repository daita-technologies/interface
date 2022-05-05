import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";

import { GET_TASK_LIST_INFO } from "reduxes/task/constants";

import taskApi, {
  GetTaskListParams,
  TaskListEachProcessTypeResponseApiFields,
} from "services/taskApi";

function* handleGetTaskListInfo(action: {
  type: string;
  payload: GetTaskListParams;
}): any {
  try {
    const getTaskListResponse = yield call(taskApi.getTaskList, action.payload);

    if (getTaskListResponse.error === false) {
      yield put({
        type: GET_TASK_LIST_INFO.SUCCEEDED,
        payload:
          getTaskListResponse.data as TaskListEachProcessTypeResponseApiFields,
      });
    } else {
      yield put({
        type: GET_TASK_LIST_INFO.FAILED,
      });
      toast.error(getTaskListResponse.message);
    }
  } catch (e: any) {
    yield put({
      type: GET_TASK_LIST_INFO.FAILED,
    });
    toast.error(e.message);
  }
}

function* generateSaga() {
  yield takeLatest(GET_TASK_LIST_INFO.REQUESTED, handleGetTaskListInfo);
}

export default generateSaga;
