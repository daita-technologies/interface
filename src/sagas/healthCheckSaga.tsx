import { toast } from "react-toastify";
import { call, put, takeEvery } from "redux-saga/effects";

import {
  GET_PROJECT_HEALTH_CHECK_INFO,
  RUN_HEALTH_CHECK,
} from "reduxes/healthCheck/constants";
import { healthCheckApi } from "services";
import {
  GetProjectHealthCheckInfoParams,
  GetProjectHealthCheckInfoReponseFields,
  RunHealthCheckParams,
  RunHealthCheckResponseFields,
} from "services/healthCheckApi";

function* handleRunHealthCheck(action: {
  type: string;
  payload: RunHealthCheckParams;
}): any {
  try {
    const runHealthCheckResponse = yield call(
      healthCheckApi.runHealthCheck,
      action.payload
    );

    if (runHealthCheckResponse.error === false) {
      yield put({
        type: RUN_HEALTH_CHECK.SUCCEEDED,
        payload: runHealthCheckResponse.data as RunHealthCheckResponseFields,
      });
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
  yield takeEvery(
    GET_PROJECT_HEALTH_CHECK_INFO.REQUESTED,
    handleGetProjectHealthCheckInfo
  );
}

export default generateSaga;
