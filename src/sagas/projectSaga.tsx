import { GetObjectCommand } from "@aws-sdk/client-s3";
import {
  DOWNLOAD_TASK_PROCESS_TYPE,
  GENERATE_REFERENCE_IMAGE_TYPE,
  HEALTHCHECK_TASK_PROCESS_TYPE,
  ID_TOKEN_NAME,
  UPLOAD_TASK_PROCESS_TYPE,
} from "constants/defaultValues";
import { toast } from "react-toastify";
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { fetchReferenceImageInfoSuccess } from "reduxes/customPreprocessing/action";
import { selectorS3 } from "reduxes/general/selector";
import { GENERATE_IMAGES } from "reduxes/generate/constants";
import {
  CREATE_PROJECT,
  CREATE_SAMPLE_PROJECT,
  DELETE_PROJECT,
  FETCH_DETAIL_PROJECT,
  FETCH_LIST_PROJECTS,
  FETCH_METHOD_LIST,
  FETCH_PROJECT_TASK_LIST,
  FETCH_TASK_INFO,
  LOAD_PROJECT_THUMBNAIL_IMAGE,
  SET_IS_OPEN_CREATE_PROJECT_MODAL,
  UPDATE_PROJECT_INFO,
} from "reduxes/project/constants";
import { selectorCurrentTaskList } from "reduxes/project/selector";
import {
  ApiListProjectsItem,
  CreateSamplePayload,
  CreateSampleSucceedPayload,
  DeleteProjectPayload,
  FetchProjectTaskListPayload,
  FetchTaskInfoPayload,
  LoadProjectThumbnailImagePayload,
  TaskInfo,
  UpdateProjectInfoPayload,
} from "reduxes/project/type";
import history from "routerHistory";
import { downloadApi, healthCheckApi, projectApi } from "services";
import customMethodApi from "services/customMethodApi";
import { getLocalStorage } from "utils/general";

function* handleCreateProject(action: any): any {
  try {
    const createProjectResponse = yield call(
      projectApi.createProject,
      action.payload
    );
    const { projectName } = action.payload;

    if (!createProjectResponse.error) {
      const projectJustCreated: ApiListProjectsItem = {
        project_name: projectName,
        project_id: createProjectResponse.data.project_id,
        s3_prefix: createProjectResponse.data.s3_prefix,
        ls_task: [],
        groups: null,
        gen_status: createProjectResponse.data.gen_status,
        thum_key: "",
        description: "",
      };
      yield put({
        type: CREATE_PROJECT.SUCCEEDED,
        payload: { createdProject: projectJustCreated },
      });
      yield put({
        type: SET_IS_OPEN_CREATE_PROJECT_MODAL,
        payload: { isOpen: false },
      });
      toast.success("Project successfully created.");
      history.push(`/project/${encodeURIComponent(projectName)}`);
    } else {
      yield put({
        type: CREATE_PROJECT.FAILED,
      });
      toast.error(createProjectResponse.message || "Create project failed.");
    }
  } catch (e: any) {
    yield put({ type: CREATE_PROJECT.FAILED });
    toast.error(e.message);
  }
}

function* handleFetchListProjects(action: any): any {
  try {
    const fetchListProjectsResponse = yield call(
      projectApi.listProjects,
      action.payload
    );

    if (!fetchListProjectsResponse.error) {
      yield put({
        type: FETCH_LIST_PROJECTS.SUCCEEDED,
        payload: {
          listProjects: fetchListProjectsResponse.data,
        },
      });
    } else {
      yield put({
        type: FETCH_LIST_PROJECTS.FAILED,
      });
      toast.error(
        fetchListProjectsResponse.message || "Can't fetch list projects."
      );
    }
  } catch (e: any) {
    yield put({ type: FETCH_LIST_PROJECTS.FAILED });
    toast.error(e.message);
  }
}

function* handleFetchDetailProject(action: any): any {
  try {
    const fetchDetailProjectResponse = yield call(
      projectApi.detailProject,
      action.payload
    );

    if (!fetchDetailProjectResponse.error) {
      yield put({
        type: FETCH_DETAIL_PROJECT.SUCCEEDED,
        payload: {
          currentProjectInfo: fetchDetailProjectResponse.data,
        },
      });

      const referenceImages = fetchDetailProjectResponse.data.reference_images;
      const referenceInfoApiFields: any = [];

      if (Object.keys(referenceImages).length !== 0) {
        Object.entries(referenceImages).forEach(([key, value]) => {
          const ref = value as any;
          referenceInfoApiFields.push({
            method_id: key,
            filename: ref.filename,
            image_s3_path: ref.s3_path,
          });
        });
      }
      yield put(fetchReferenceImageInfoSuccess(referenceInfoApiFields));
    } else {
      yield put({
        type: FETCH_DETAIL_PROJECT.FAILED,
      });
      toast.error(fetchDetailProjectResponse.message);
      history.push("/dashboard");
    }
  } catch (e: any) {
    yield put({ type: FETCH_DETAIL_PROJECT.FAILED });
    toast.error(e.message);
  }
}

function* handleFetchMethodList(action: {
  type: string;
  payload: { idToken: string };
}): any {
  try {
    const fetchMethodListResponse = yield call(
      projectApi.listMethod,
      action.payload
    );

    if (!fetchMethodListResponse.error) {
      yield put({
        type: FETCH_METHOD_LIST.SUCCEEDED,
        payload: {
          listMethod: fetchMethodListResponse.data,
        },
      });
    } else {
      yield put({
        type: FETCH_METHOD_LIST.FAILED,
      });
      toast.error(fetchMethodListResponse.message);
    }
  } catch (e: any) {
    yield put({ type: FETCH_METHOD_LIST.FAILED });
    toast.error(e.message);
  }
}

function* handleFetchTaskInfo(action: {
  type: string;
  payload: FetchTaskInfoPayload;
}): any {
  try {
    const { idToken, generateMethod, projectId, taskId, processType } =
      action.payload;

    let fetchTaskInfoResponse;
    if (processType === UPLOAD_TASK_PROCESS_TYPE) {
      fetchTaskInfoResponse = yield call(
        projectApi.getUploadZipTaskInfo,
        action.payload
      );
    } else if (processType === HEALTHCHECK_TASK_PROCESS_TYPE) {
      fetchTaskInfoResponse = yield call(
        healthCheckApi.getRunHealthCheckStatus,
        { idToken, taskId }
      );
    } else if (processType === GENERATE_REFERENCE_IMAGE_TYPE) {
      fetchTaskInfoResponse = yield call(
        customMethodApi.getReferenceImagesTaskInfo,
        { idToken, taskId }
      );
    } else if (processType === DOWNLOAD_TASK_PROCESS_TYPE) {
      fetchTaskInfoResponse = yield call(downloadApi.downloadUpdate, {
        taskId,
      });
    } else {
      fetchTaskInfoResponse = yield call(
        projectApi.getTaskInfo,
        action.payload
      );
    }

    if (fetchTaskInfoResponse.error === false) {
      yield put({
        type: FETCH_TASK_INFO.SUCCEEDED,
        payload: {
          taskInfo: {
            task_id: taskId,
            project_id: projectId,
            process_type: processType,
            ...fetchTaskInfoResponse.data,
          },
          projectId: fetchTaskInfoResponse.data.project_id,
        },
      });

      if (action.payload.isNotify) {
        if (generateMethod) {
          yield put({
            type: GENERATE_IMAGES.SUCCEEDED,
            payload: {
              taskId,
              generateMethod,
            },
          });
        }
      }
    } else {
      yield put({
        type: FETCH_TASK_INFO.FAILED,
      });
      toast.error(fetchTaskInfoResponse.message);
    }
  } catch (e: any) {
    yield put({
      type: FETCH_TASK_INFO.FAILED,
    });
    toast.error(e.message);
  }
}

function* handleFetchProjectTaskList(action: {
  type: string;
  payload: FetchProjectTaskListPayload;
}): any {
  const { projectId } = action.payload;
  try {
    const idToken = yield getLocalStorage(ID_TOKEN_NAME);
    const currentTaskList: TaskInfo[] = yield select(selectorCurrentTaskList);
    yield all(
      currentTaskList.map(({ task_id, process_type }: TaskInfo) =>
        call(handleFetchTaskInfo, {
          type: FETCH_TASK_INFO.REQUESTED,
          payload: {
            idToken,
            taskId: task_id,
            projectId,
            processType: process_type,
          },
        })
      )
    );

    yield put({ type: FETCH_PROJECT_TASK_LIST.SUCCEEDED });
  } catch (e: any) {
    yield put({ type: FETCH_PROJECT_TASK_LIST.FAILED });
    toast.error(e.message);
  }
}

function* handleDeleteProject(action: {
  type: string;
  payload: DeleteProjectPayload;
}): any {
  try {
    const deleteProjectResponse = yield call(
      projectApi.deleteProject,
      action.payload
    );

    if (!deleteProjectResponse.error) {
      yield put({
        type: DELETE_PROJECT.SUCCEEDED,
        payload: { projectId: action.payload.projectId },
      });
      yield toast.success(
        `The project ${action.payload.projectName} was successfully deleted.`
      );
      yield history.push("/dashboard");
    } else {
      yield put({ type: DELETE_PROJECT.FAILED });
      toast.error(deleteProjectResponse.message);
    }
  } catch (e: any) {
    yield put({ type: DELETE_PROJECT.FAILED });
    toast.error(e.message);
  }
}

function* handleCreateSampleProject(action: {
  type: string;
  payload: CreateSamplePayload;
}): any {
  try {
    const createSampleProjectResponse = yield call(
      projectApi.createSampleProject,
      action.payload
    );

    if (!createSampleProjectResponse.error) {
      yield toast.success("Sample project has been created.");
      yield put({
        type: CREATE_SAMPLE_PROJECT.SUCCEEDED,
        payload: createSampleProjectResponse.data as CreateSampleSucceedPayload,
      });
      yield history.push(
        `/project/${
          (createSampleProjectResponse.data as CreateSampleSucceedPayload)
            .project_name
        }`
      );
    } else {
      yield put({ type: CREATE_SAMPLE_PROJECT.FAILED });
      toast.error(createSampleProjectResponse.message);
    }
  } catch (e: any) {
    yield put({ type: CREATE_SAMPLE_PROJECT.FAILED });
    toast.error(e.message);
  }
}

function* handleLoadProjectThumbnailImage(action: {
  type: string;
  payload: LoadProjectThumbnailImagePayload;
}): any {
  const { fullPhotoKey, projectId } = action.payload;

  if (fullPhotoKey) {
    const splitPhotoKey = fullPhotoKey.split("/");
    if (splitPhotoKey.length > 0) {
      try {
        const bucketName = splitPhotoKey.splice(0, 1)[0];
        const photoKey = splitPhotoKey.join("/");

        const s3 = yield select(selectorS3);

        const photoContent = yield s3.send(
          new GetObjectCommand({
            Bucket: bucketName,
            Key: photoKey,
          })
        );

        if (photoContent.Body) {
          const res = new Response(photoContent.Body as any);
          const blob = yield res.blob();

          yield put({
            type: LOAD_PROJECT_THUMBNAIL_IMAGE.SUCCEEDED,
            payload: {
              projectThumbnailUrl: window.URL.createObjectURL(blob),
              projectId,
            },
          });
        } else {
          yield put({
            type: LOAD_PROJECT_THUMBNAIL_IMAGE.FAILED,
            payload: {
              projectThumbnailUrl: "",
              projectId,
            },
          });
        }
      } catch (e: any) {
        yield put({
          type: LOAD_PROJECT_THUMBNAIL_IMAGE.FAILED,
          payload: {
            projectThumbnailUrl: "",
            projectId,
          },
        });
        toast.error(e.message);
      }
    }
  } else {
    yield put({
      type: LOAD_PROJECT_THUMBNAIL_IMAGE.FAILED,
      payload: {
        projectThumbnailUrl: "",
        projectId,
      },
    });
  }
}

function* handleUpdateProjectInfo(action: {
  type: string;
  payload: UpdateProjectInfoPayload;
}): any {
  try {
    const updateProjectInfoResponse = yield call(
      projectApi.updateProjectInfo,
      action.payload
    );
    if (!updateProjectInfoResponse.error) {
      yield put({
        type: UPDATE_PROJECT_INFO.SUCCEEDED,
        payload: {
          ...updateProjectInfoResponse.data,
        },
      });
      yield toast.success(
        `The project ${action.payload.updateInfo.projectName} was successfully updated.`
      );
      yield history.push("/dashboard");
    } else {
      yield put({ type: UPDATE_PROJECT_INFO.FAILED });
      toast.error(updateProjectInfoResponse.message);
    }
  } catch (e: any) {
    yield put({ type: UPDATE_PROJECT_INFO.FAILED });
    toast.error(e.message);
  }
}
function* createProjectSaga() {
  yield takeLatest(CREATE_PROJECT.REQUESTED, handleCreateProject);
  yield takeLatest(FETCH_LIST_PROJECTS.REQUESTED, handleFetchListProjects);
  yield takeLatest(FETCH_DETAIL_PROJECT.REQUESTED, handleFetchDetailProject);
  yield takeLatest(FETCH_METHOD_LIST.REQUESTED, handleFetchMethodList);
  yield takeLatest(
    FETCH_PROJECT_TASK_LIST.REQUESTED,
    handleFetchProjectTaskList
  );
  yield takeEvery(FETCH_TASK_INFO.REQUESTED, handleFetchTaskInfo);
  yield takeLatest(DELETE_PROJECT.REQUESTED, handleDeleteProject);
  yield takeLatest(CREATE_SAMPLE_PROJECT.REQUESTED, handleCreateSampleProject);
  yield takeEvery(
    LOAD_PROJECT_THUMBNAIL_IMAGE.REQUESTED,
    handleLoadProjectThumbnailImage
  );
  yield takeLatest(UPDATE_PROJECT_INFO.REQUESTED, handleUpdateProjectInfo);
}

export default createProjectSaga;
