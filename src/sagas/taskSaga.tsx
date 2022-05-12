import { toast } from "react-toastify";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { RootState } from "reduxes";
import {
  changePageTaskListInfoFailed,
  changePageTaskListInfoSucceeded,
  filterTaskListInfoFailed,
  filterTaskListInfoSucceeded,
  getTaskListInfoFailed,
  getTaskListInfoSuceeded,
} from "reduxes/task/action";

import {
  CHANGE_PAGE_TASK_LIST_INFO,
  FILTER_DEFAULT_VALUE,
  FILTER_TASK_LIST_INFO,
  GET_TASK_LIST_INFO,
  TASK_LIST_PAGE_SIZE,
} from "reduxes/task/constants";
import { selectorSpecificProcessListPage } from "reduxes/task/selector";
import { PaginationTaskListInfoRequestActionPayload } from "reduxes/task/type";

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
    const { filter } = action.payload;

    const getTaskListResponse = yield call(taskApi.getTaskList, action.payload);

    if (getTaskListResponse.error === false) {
      yield put(
        getTaskListInfoSuceeded({
          filter,
          response: getTaskListResponse.data as TaskListResponseApiFields,
        })
      );
    } else {
      yield put(
        getTaskListInfoFailed({
          filter,
        })
      );
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

function* handlePaginationTaskListInfo(action: {
  type: string;
  payload: PaginationTaskListInfoRequestActionPayload;
}): any {
  try {
    const { payload } = action;
    const { filter, targetPage, processType } = payload;

    const listPageToken = yield select((state: RootState) =>
      selectorSpecificProcessListPage(processType, state)
    );

    const getTaskListParams: GetTaskListParams = {
      filter: filter || FILTER_DEFAULT_VALUE,
      pagination: {
        pageToken: targetPage === 0 ? null : listPageToken[targetPage - 1],
      },
      sizeListItemsQuery: TASK_LIST_PAGE_SIZE,
    };

    const getTaskListFilteredResponse = yield call(
      taskApi.getTaskList,
      getTaskListParams
    );

    if (getTaskListFilteredResponse.error === false) {
      yield put(
        changePageTaskListInfoSucceeded({
          filter,
          targetPage,
          processType,
          response:
            getTaskListFilteredResponse.data as TaskListResponseApiFields,
        })
      );
    } else {
      yield put(
        changePageTaskListInfoFailed({ filter, targetPage, processType })
      );
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
  yield takeLatest(
    CHANGE_PAGE_TASK_LIST_INFO.REQUESTED,
    handlePaginationTaskListInfo
  );
}

export default generateSaga;
