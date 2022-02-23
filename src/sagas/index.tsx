import { all } from "redux-saga/effects";

import authSaga from "./authSaga";
import createProject from "./projectSaga";
import uploadSaga from "./uploadSaga";
import albumSaga from "./albumSaga";
import downloadSaga from "./downloadSaga";
import generateSaga from "./generateSaga";
import inviteSaga from "./inviteSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    createProject(),
    uploadSaga(),
    albumSaga(),
    downloadSaga(),
    generateSaga(),
    inviteSaga(),
  ]);
}
