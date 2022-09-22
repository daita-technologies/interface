import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";
import { CLONE_PROJECT_TO_ANNOTATION } from "reduxes/annotationProject/constants";
import { CloneProjectToAnnotationProps } from "reduxes/annotationProject/type";
import history from "routerHistory";
import annotationProjectApi from "services/annotationProjectApi";

function* handleCloneProjectToAnnotation(action: {
  type: string;
  payload: CloneProjectToAnnotationProps;
}): any {
  try {
    const updateProjectInfoResponse = yield call(
      annotationProjectApi.cloneProbjectToAnnotation,
      action.payload
    );
    if (!updateProjectInfoResponse.error) {
      yield put({
        type: CLONE_PROJECT_TO_ANNOTATION.SUCCEEDED,
        payload: {
          ...updateProjectInfoResponse.data,
        },
      });
      yield history.push("/dashboard");
    } else {
      yield put({ type: CLONE_PROJECT_TO_ANNOTATION.FAILED });
      toast.error(updateProjectInfoResponse.message);
    }
  } catch (e: any) {
    yield put({ type: CLONE_PROJECT_TO_ANNOTATION.FAILED });
    toast.error(e.message);
  }
}
function* annotationProjectSaga() {
  yield takeLatest(
    CLONE_PROJECT_TO_ANNOTATION.REQUESTED,
    handleCloneProjectToAnnotation
  );
}

export default annotationProjectSaga;
