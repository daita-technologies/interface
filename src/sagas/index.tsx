import { all } from "redux-saga/effects";

import authSaga from "./authSaga";
import createProject from "./projectSaga";
import uploadSaga from "./uploadSaga";
import albumSaga from "./albumSaga";
import downloadSaga from "./downloadSaga";
import generateSaga from "./generateSaga";
import inviteSaga from "./inviteSaga";
import healthCheckSaga from "./healthCheckSaga";
import taskSaga from "./taskSaga";
import customMethod from "./customMethod";

export default function* rootSaga() {
  yield all([
    authSaga(),
    createProject(),
    uploadSaga(),
    albumSaga(),
    downloadSaga(),
    generateSaga(),
    inviteSaga(),
    healthCheckSaga(),
    taskSaga(),
    customMethod(),
  ]);
}
