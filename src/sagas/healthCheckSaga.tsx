import { ID_TOKEN_NAME } from "constants/defaultValues";
import { toast } from "react-toastify";
import { call, delay, put, takeEvery, takeLatest } from "redux-saga/effects";

import {
  GET_PROJECT_HEALTH_CHECK_INFO,
  RUN_HEALTH_CHECK,
} from "reduxes/healthCheck/constants";
import { RunHealthCheckSucceededActionPayload } from "reduxes/healthCheck/type";
import { fetchTaskInfo } from "reduxes/project/action";
import { healthCheckApi } from "services";
import {
  GetProjectHealthCheckInfoParams,
  GetProjectHealthCheckInfoReponseFields,
  RunHealthCheckParams,
  RunHealthCheckResponseFields,
} from "services/healthCheckApi";
import { getLocalStorage } from "utils/general";

function* handleRunHealthCheck(action: {
  type: string;
  payload: RunHealthCheckParams;
}): any {
  try {
    const { projectId } = action.payload;
    const runHealthCheckResponse = yield call(
      healthCheckApi.runHealthCheck,
      action.payload
    );

    if (runHealthCheckResponse.error === false) {
      const { task_id, process_type } =
        runHealthCheckResponse.data as RunHealthCheckResponseFields;
      yield put({
        type: RUN_HEALTH_CHECK.SUCCEEDED,
        payload: {
          taskId: task_id,
          projectId,
        } as RunHealthCheckSucceededActionPayload,
      });
      yield toast.success(`Data health check successfully initiated.`);

      yield delay(2000);

      if (task_id) {
        yield put(
          fetchTaskInfo({
            idToken: getLocalStorage(ID_TOKEN_NAME) || "",
            taskId: task_id,
            // isNotify: true,
            projectId,
            processType: process_type,
          })
        );
      }
    } else {
      yield put({
        type: RUN_HEALTH_CHECK.FAILED,
      });
      toast.error(
        runHealthCheckResponse.message || "Unable to run data health check."
      );
    }
  } catch (e: any) {
    yield put({
      type: RUN_HEALTH_CHECK.FAILED,
    });
    toast.error(e.message);
  }
}

function* handleGetProjectHealthCheckInfo(action: {
  type: string;
  payload: GetProjectHealthCheckInfoParams;
}): any {
  try {
    const getProjectHealthCheckInfoResponse = yield call(
      healthCheckApi.getProjectHealthCheckInfo,
      action.payload
    );

    if (getProjectHealthCheckInfoResponse.error === false) {
      yield put({
        type: GET_PROJECT_HEALTH_CHECK_INFO.SUCCEEDED,
        payload:
          getProjectHealthCheckInfoResponse.data as GetProjectHealthCheckInfoReponseFields,
      });
    } else {
      yield put({
        type: GET_PROJECT_HEALTH_CHECK_INFO.FAILED,
      });
      toast.error(getProjectHealthCheckInfoResponse.message);
    }
  } catch (e: any) {
    yield put({
      type: GET_PROJECT_HEALTH_CHECK_INFO.FAILED,
    });
    toast.error(e.message);
  }
}

function* generateSaga() {
  yield takeEvery(RUN_HEALTH_CHECK.REQUESTED, handleRunHealthCheck);
  yield takeLatest(
    GET_PROJECT_HEALTH_CHECK_INFO.REQUESTED,
    handleGetProjectHealthCheckInfo
  );
}

export default generateSaga;
