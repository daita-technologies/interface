import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  filterTaskListInfoFailed,
  filterTaskListInfoSucceeded,
} from "reduxes/task/action";

import {
  FILTER_TASK_LIST_INFO,
  GET_TASK_LIST_INFO,
  TASK_LIST_PAGE_SIZE,
} from "reduxes/task/constants";

import taskApi, {
  GetTaskListFilterParams,
  GetTaskListParams,
  TaskListResponseApiFields,
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
        payload: getTaskListResponse.data as TaskListResponseApiFields,
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

function* handleFilterTaskListInfo(action: {
  type: string;
  payload: GetTaskListFilterParams;
}): any {
  try {
    const { payload } = action;
    const getTaskListParams: GetTaskListParams = {
      filter: payload,
      pagination: {
        pageToken: null,
      },
      sizeListItemsQuery: TASK_LIST_PAGE_SIZE,
    };

    const getTaskListFilteredResponse = yield call(
      taskApi.getTaskList,
      getTaskListParams
    );

    if (getTaskListFilteredResponse.error === false) {
      yield put(
        filterTaskListInfoSucceeded({
          filter: payload,
          response:
            getTaskListFilteredResponse.data as TaskListResponseApiFields,
        })
      );
    } else {
      yield put(filterTaskListInfoFailed({ filter: payload }));
      toast.error(getTaskListFilteredResponse.message);
    }
  } catch (e: any) {
    yield put({
      type: FILTER_TASK_LIST_INFO.FAILED,
    });
    toast.error(e.message);
  }
}

function* generateSaga() {
  yield takeLatest(GET_TASK_LIST_INFO.REQUESTED, handleGetTaskListInfo);
  yield takeLatest(FILTER_TASK_LIST_INFO.REQUESTED, handleFilterTaskListInfo);
}

export default generateSaga;
