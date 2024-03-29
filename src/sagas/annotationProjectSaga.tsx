import {
  ANNOTATION_PROJECT_DETAIL_ROUTE_NAME,
  ANNOTATION_PROJECT_ROUTE_NAME,
} from "constants/routeName";
import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";
import { addNewClassLabel } from "reduxes/annotationmanager/action";
import {
  CLONE_PROJECT_TO_ANNOTATION,
  DELETE_ANNOTATION_PROJECT,
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
import { convertStrokeColorToFillColor } from "routes/AnnotationPage/LabelAnnotation/ClassLabel";
import {
  hashCode,
  intToRGB,
} from "routes/AnnotationPage/LabelAnnotation/ClassManageModal/useListClassView";
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
      yield toast.info(
        `We are automatically AI-segmenting your images. You will receive an automatic email notification when finished. The segmented images will be green-marked "AI" on the annotation web page.`
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
        fetchListProjectsResponse.message ||
          "Can't fetch project list at the moment. Please try again later!"
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
function* handleDeleteAnnotationProject(action: any): any {
  try {
    const deleteProjectResponse = yield call(
      annotationProjectApi.deleteProject,
      action.payload
    );
    if (!deleteProjectResponse.error) {
      yield put({
        type: DELETE_ANNOTATION_PROJECT.SUCCEEDED,
        payload: { projectId: action.payload.projectId },
      });
      yield toast.success(
        `The annotation project ${action.payload.projectName} was successfully deleted.`
      );
      yield history.push(`/${ANNOTATION_PROJECT_ROUTE_NAME}`);
    } else {
      yield put({ type: DELETE_ANNOTATION_PROJECT.FAILED });
      toast.error(deleteProjectResponse.message);
    }
  } catch (e: any) {
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
      if (annotationProjectInfo.ls_category?.ls_class) {
        // eslint-disable-next-line no-restricted-syntax
        for (const classLabel of annotationProjectInfo.ls_category.ls_class) {
          const strokeColor = `#${intToRGB(hashCode(classLabel.class_name))}`;
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
  yield takeLatest(
    DELETE_ANNOTATION_PROJECT.REQUESTED,
    handleDeleteAnnotationProject
  );
}

export default annotationProjectSaga;
