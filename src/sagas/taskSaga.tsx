import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { RootState } from "reduxes";
import { selectorListProjects } from "reduxes/project/selector";
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
  GOTO_TASK_DASHBOARD_ALERT,
  TASK_LIST_PAGE_SIZE,
  TRIGGER_STOP_TASK_PROCESS,
} from "reduxes/task/constants";
import { selectorSpecificProcessListPage } from "reduxes/task/selector";
import {
  GoToTaskDashboardAlertPayload,
  PaginationTaskListInfoRequestActionPayload,
  TriggerStopTaskProcessRequestActionPayload,
} from "reduxes/task/type";
import { stopProcessApi } from "services";
import taskApi, {
  GetTaskListFilterParams,
  GetTaskListParams,
  // TaskItemApiFields,
  TaskListResponseApiFields,
} from "services/taskApi";
import { getProjectNameFromProjectId } from "utils/general";

// import { getLocalStorage } from "utils/general";

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

function* handleTriggerStopTaskProcess(action: {
  type: string;
  payload: TriggerStopTaskProcessRequestActionPayload;
}): any {
  try {
    const { payload } = action;
    const {
      taskId,
      // processType, projectId
    } = payload;

    const triggerStopTaskResponse = yield call(stopProcessApi.stopProcess, {
      taskId,
    });

    if (triggerStopTaskResponse.error === false) {
      yield put({
        type: TRIGGER_STOP_TASK_PROCESS.SUCCEEDED,
      });

      yield toast.info("Your task is being processed to stop.");

      // const newTaskInfo: TaskItemApiFields = {
      //   task_id: taskId,
      //   process_type: processType,
      //   project_id: projectId,
      //   status: RUNNING_TASK_STATUS,
      //   identity_id: getLocalStorage(IDENTITY_ID_NAME) || "",
      //   created_time: new Date().toISOString(),
      // };

      // yield put(addTaskToCurrentDashboard(newTaskInfo));
    } else {
      yield put({
        type: TRIGGER_STOP_TASK_PROCESS.FAILED,
      });
      toast.error(triggerStopTaskResponse.message);
    }
  } catch (e: any) {
    yield put({
      type: TRIGGER_STOP_TASK_PROCESS.FAILED,
    });
    toast.error(e.message);
  }
}
function* handleGotoTaskDashboardAlert(action: {
  type: string;
  payload: GoToTaskDashboardAlertPayload;
}): any {
  const { payload } = action;
  const listProjects = yield select(selectorListProjects);

  const taskDashboardHref = yield `${
    window.location.origin
  }/task-list/${getProjectNameFromProjectId(listProjects, payload.projectId)}`;

  yield toast.success(payload.message);

  yield toast.info(
    <Box>
      <Typography fontSize={14}>
        Your progress link:{" "}
        <a className="text-link" href={taskDashboardHref}>
          {taskDashboardHref}
        </a>
      </Typography>
    </Box>
  );
}
function* generateSaga() {
  yield takeLatest(GET_TASK_LIST_INFO.REQUESTED, handleGetTaskListInfo);
  yield takeLatest(FILTER_TASK_LIST_INFO.REQUESTED, handleFilterTaskListInfo);
  yield takeLatest(
    CHANGE_PAGE_TASK_LIST_INFO.REQUESTED,
    handlePaginationTaskListInfo
  );
  yield takeEvery(
    TRIGGER_STOP_TASK_PROCESS.REQUESTED,
    handleTriggerStopTaskProcess
  );
  yield takeEvery(
    TRIGGER_STOP_TASK_PROCESS.REQUESTED,
    handleTriggerStopTaskProcess
  );
  yield takeEvery(GOTO_TASK_DASHBOARD_ALERT, handleGotoTaskDashboardAlert);
}

export default generateSaga;
