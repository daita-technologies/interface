import {
  ANNOTATION_PROJECT_DETAIL_ROUTE_NAME,
  ANNOTATION_PROJECT_ROUTE_NAME,
} from "constants/routeName";
import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";
import { addNewClassLabel } from "reduxes/annotationmanager/action";
import {
  CLONE_PROJECT_TO_ANNOTATION,
  FETCH_ANNOTATION_AND_FILE_INFO,
  FETCH_ANNOTATION_FILES,
  FETCH_DETAIL_ANNOTATION_PROJECT,
  FETCH_LIST_ANNOTATION_PROJECTS,
} from "reduxes/annotationProject/constants";
import {
  AnnotationProjectInfo,
  CloneProjectToAnnotationProps,
} from "reduxes/annotationProject/type";
import history from "routerHistory";
import { hashCode, intToRGB } from "routes/AnnotationPage/LabelAnnotation";
import { convertStrokeColorToFillColor } from "routes/AnnotationPage/LabelAnnotation/ClassLabel";
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

      yield history.push(
        `/${ANNOTATION_PROJECT_DETAIL_ROUTE_NAME}/${action.payload.annotationProjectName}`
      );
    } else {
      yield put({ type: CLONE_PROJECT_TO_ANNOTATION.FAILED });
      toast.error(updateProjectInfoResponse.message);
    }
  } catch (e: any) {
    yield put({ type: CLONE_PROJECT_TO_ANNOTATION.FAILED });
    toast.error(e.message);
  }
}

function* handleFetchListProjects(action: any): any {
  try {
    const fetchListProjectsResponse = yield call(
      annotationProjectApi.listProjects,
      action.payload
    );
    if (!fetchListProjectsResponse.error) {
      yield put({
        type: FETCH_LIST_ANNOTATION_PROJECTS.SUCCEEDED,
        payload: {
          listProjects: fetchListProjectsResponse.data.items,
        },
      });
    } else {
      yield put({
        type: FETCH_LIST_ANNOTATION_PROJECTS.FAILED,
      });
      toast.error(
        fetchListProjectsResponse.message || "Can't fetch list projects."
      );
    }
  } catch (e: any) {
    yield put({ type: FETCH_LIST_ANNOTATION_PROJECTS.FAILED });
    toast.error(e.message);
  }
}

function* handleFetchAnnotationFiles(action: any): any {
  try {
    const fetchAnnotationFilesOfProject = yield call(
      annotationProjectApi.getAnnotationFilesOfProject,
      action.payload
    );

    if (!fetchAnnotationFilesOfProject.error) {
      yield put({
        type: FETCH_ANNOTATION_FILES.SUCCEEDED,
        payload: {
          ...fetchAnnotationFilesOfProject.data,
          projectId: action.payload.projectId,
        },
      });
    } else {
      yield put({
        type: FETCH_ANNOTATION_FILES.FAILED,
      });
      toast.error(fetchAnnotationFilesOfProject.message);
      history.push(`/${ANNOTATION_PROJECT_ROUTE_NAME}/`);
    }
  } catch (e: any) {
    yield put({ type: FETCH_ANNOTATION_FILES.FAILED });
    toast.error(e.message);
  }
}
function* handleAnnotationAndFileInfo(action: any): any {
  try {
    const fetchDetailProjectResponse = yield call(
      annotationProjectApi.annotationAndFileInfo,
      action.payload
    );
    if (!fetchDetailProjectResponse.error) {
      yield put({
        type: FETCH_ANNOTATION_AND_FILE_INFO.SUCCEEDED,
        payload: {
          currentAnnotationAndFileInfo: fetchDetailProjectResponse.data,
        },
      });
    } else {
      yield put({
        type: FETCH_ANNOTATION_AND_FILE_INFO.FAILED,
      });
      toast.error(fetchDetailProjectResponse.message);
      history.push(`/${ANNOTATION_PROJECT_ROUTE_NAME}/`);
    }
  } catch (e: any) {
    yield put({ type: FETCH_ANNOTATION_AND_FILE_INFO.FAILED });
    toast.error(e.message);
  }
}
function* handleFetchDetailProject(action: any): any {
  try {
    const fetchDetailProjectResponse = yield call(
      annotationProjectApi.detailProject,
      action.payload
    );
    if (!fetchDetailProjectResponse.error) {
      const annotationProjectInfo =
        fetchDetailProjectResponse.data as AnnotationProjectInfo;
      yield put({
        type: FETCH_DETAIL_ANNOTATION_PROJECT.SUCCEEDED,
        payload: {
          currentProjectInfo: annotationProjectInfo,
        },
      });
      for (const classLabel of annotationProjectInfo.ls_category.ls_class) {
        const strokeColor = "#" + intToRGB(hashCode(classLabel.class_name));
        yield put(
          addNewClassLabel({
            labelClassProperties: {
              label: { label: classLabel.class_name },
              cssStyle: {
                fill: convertStrokeColorToFillColor(strokeColor),
              },
            },
          })
        );
      }
    } else {
      yield put({
        type: FETCH_DETAIL_ANNOTATION_PROJECT.FAILED,
      });
      toast.error(fetchDetailProjectResponse.message);
    }
  } catch (e: any) {
    yield put({ type: FETCH_DETAIL_ANNOTATION_PROJECT.FAILED });
    toast.error(e.message);
  }
}
function* annotationProjectSaga() {
  yield takeLatest(
    CLONE_PROJECT_TO_ANNOTATION.REQUESTED,
    handleCloneProjectToAnnotation
  );
  yield takeLatest(
    FETCH_LIST_ANNOTATION_PROJECTS.REQUESTED,
    handleFetchListProjects
  );
  yield takeLatest(
    FETCH_DETAIL_ANNOTATION_PROJECT.REQUESTED,
    handleFetchDetailProject
  );
  yield takeLatest(
    FETCH_ANNOTATION_AND_FILE_INFO.REQUESTED,
    handleAnnotationAndFileInfo
  );
  yield takeLatest(
    FETCH_ANNOTATION_FILES.REQUESTED,
    handleFetchAnnotationFiles
  );
}

export default annotationProjectSaga;
