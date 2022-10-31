import { Upload } from "@aws-sdk/lib-storage";
import {
  ID_TOKEN_NAME,
  LIMIT_UPLOAD_IMAGE_SIZE,
  ORIGINAL_SOURCE,
} from "constants/defaultValues";
import {
  ADDED_UPLOAD_FILE_STATUS,
  CHECKING_UPLOAD_FILE_STATUS,
  CHECK_IMAGE,
  FAILED_UPLOAD_FILE_STATUS,
  QUEUEING_UPLOAD_FILE_STATUS,
  UPLOADED_UPLOAD_FILE_STATUS,
  UPLOADING_UPLOAD_FILE_STATUS,
} from "constants/uploadFile";
import MD5 from "crypto-js/md5";
import { toast } from "react-toastify";
import { channel } from "redux-saga";
import {
  actionChannel,
  all,
  call,
  fork,
  put,
  select,
  take,
  takeEvery,
} from "redux-saga/effects";
import { updateCurrentAnnotationProjectStatistic } from "reduxes/annotationProject/action";
import { selectorAnnotationCurrentProject } from "reduxes/annotationProject/selector";
import { AnnotationProjectInfo } from "reduxes/annotationProject/type";
import { selectorS3 } from "reduxes/general/selector";
import {
  CheckFileUploadParams,
  UploadFileParams,
  UploadFilesType,
} from "reduxes/upload/type";
import {
  clearFileArrayAnnotationProject,
  notifyExistFileAnnotationProject,
  setIsOpenDuplicateModalAnnotationProject,
  setTotalUploadFileQuantityAnnotationProject,
  updateFileAnnotationProject,
  updateFilesAnnotationProject,
  updateStatusFileArrayAnnotationProject,
} from "reduxes/uploadAnnotationImage/actions";
import {
  CHECK_FILES_ANNOTATION_PROJECT,
  UPDATE_UPLOAD_TO_BACKEND_ANNOTATION_PROJECT,
  UPLOAD_FILE_ANNOTATION_PROJECT,
} from "reduxes/uploadAnnotationImage/constants";
import {
  selectorFailAndInvalidFileCountAnnotationProject,
  selectorTotalUploadFileQuantityAnnotationProject,
  selectorUploadedFileCountAnnotationProject,
  selectorUploadFilesAnnotationProject,
} from "reduxes/uploadAnnotationImage/selector";
import annotationProjectApi from "services/annotationProjectApi";
import {
  arrayBufferToWordArray,
  formatBytes,
  getLocalStorage,
  objectIndexOf,
  readAsArrayBuffer,
} from "utils/general";
import { getKeyS3 } from "./annotationEditorSaga";

function* handleUpdateUploadToBackend(action: any): any {
  try {
    const { projectId, projectName, fileName, isReplace } = action.payload;
    const uploadFiles = yield select(selectorUploadFilesAnnotationProject);
    const annotationCurrentProject: AnnotationProjectInfo = yield select(
      selectorAnnotationCurrentProject
    );
    const readerResult = yield call(
      readAsArrayBuffer,
      uploadFiles[fileName].file
    );
    if (readerResult) {
      const hash = MD5(arrayBufferToWordArray(readerResult)).toString();

      yield call(annotationProjectApi.uploadedUpdate, {
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        projectId,
        projectName,
        listObjectInfo: [
          {
            s3Key: `${annotationCurrentProject.s3_raw_data}/${fileName}`,
            fileName,
            hash,
            size: uploadFiles[fileName].file.size,
            sizeOld:
              isReplace && typeof uploadFiles[fileName].sizeOld !== "undefined"
                ? Number(uploadFiles[fileName].sizeOld)
                : undefined,
          },
        ],
      });

      yield put({
        type: UPDATE_UPLOAD_TO_BACKEND_ANNOTATION_PROJECT.SUCCEEDED,
      });
      // NOTE: ADD TO ALBUM HERE
    } else {
      yield put({ type: UPDATE_UPLOAD_TO_BACKEND_ANNOTATION_PROJECT.FAILED });
      toast.error(`Failed to read file ${fileName}`);
    }
  } catch (e: any) {
    yield put({ type: UPDATE_UPLOAD_TO_BACKEND_ANNOTATION_PROJECT.FAILED });
    toast.error(e.message);
  }
}

const uploadProgressChannel = channel();

function* watchUploadProgressChannel() {
  while (true) {
    // @ts-ignore
    const action = yield take(uploadProgressChannel);
    yield put(action);
  }
}
function* processUploadDone() {
  const UpdatedUploadFiles: UploadFilesType = yield select(
    selectorUploadFilesAnnotationProject
  );
  const listDeleteFile = Object.keys(UpdatedUploadFiles).filter(
    (nameOfFile) =>
      UpdatedUploadFiles[nameOfFile].status === UPLOADED_UPLOAD_FILE_STATUS
  );
  yield put(clearFileArrayAnnotationProject({ fileNameArray: listDeleteFile }));
  yield put(
    setTotalUploadFileQuantityAnnotationProject({
      totalUploadFileQuantity: null,
    })
  );
}
function* isImageValid(action: {
  type: string;
  payload: UploadFileParams;
}): any {
  const { fileName } = action.payload;
  const uploadFiles = yield select(selectorUploadFilesAnnotationProject);
  const { file } = uploadFiles[fileName];
  if (file.size > LIMIT_UPLOAD_IMAGE_SIZE) {
    yield put(
      updateFileAnnotationProject({
        fileName,
        updateInfo: {
          error: `The image size exceeds the limit allowed (${formatBytes(
            file.size
          )}/${formatBytes(
            LIMIT_UPLOAD_IMAGE_SIZE
          )}). Please remove it to start a new uploading`,
          status: FAILED_UPLOAD_FILE_STATUS,
        },
      })
    );
    return false;
  }
  return true;
}
function* handleUploadFile(action: {
  type: string;
  payload: UploadFileParams;
}): any {
  try {
    const {
      fileName,
      projectId,
      projectName,
      isReplace,
      isReplaceSingle,
      isExist,
    } = action.payload;
    const uploadFiles = yield select(selectorUploadFilesAnnotationProject);
    const annotationCurrentProject: AnnotationProjectInfo = yield select(
      selectorAnnotationCurrentProject
    );
    const s3 = yield select(selectorS3);
    const keyS3 = getKeyS3(annotationCurrentProject.s3_raw_data);

    try {
      if (uploadFiles[fileName]) {
        const isValid = yield call(isImageValid, {
          type: CHECK_IMAGE,
          payload: action.payload,
        });
        if (isValid === false) {
          return;
        }
        const s3KeyFile = `${keyS3.key}/${fileName}`;
        const uploadParams = {
          Bucket: keyS3.bucketName,
          Key: s3KeyFile,
          Body: uploadFiles[fileName].file,
        };

        yield put(
          updateFileAnnotationProject({
            fileName,
            updateInfo: {
              error: "",
              status: UPLOADING_UPLOAD_FILE_STATUS,
            },
          })
        );

        const parallelUploads3 = new Upload({
          client: s3,
          queueSize: 4,
          params: uploadParams,
        });
        parallelUploads3.on("httpUploadProgress", (progress) => {
          uploadProgressChannel.put(
            updateFileAnnotationProject({
              fileName,
              updateInfo: {
                uploadProgress: Number(
                  Number(
                    ((progress.loaded || 0) / (progress.total || 1)) * 100
                  ).toFixed(0) || "0"
                ),
              },
            })
          );
        });
        yield parallelUploads3.done();

        // yield put(
        //   clearFileArray({
        //     fileNameArray: [fileName],
        //   })
        // );
        yield put(
          updateFileAnnotationProject({
            fileName,
            updateInfo: {
              error: "",
              status: UPLOADED_UPLOAD_FILE_STATUS,
            },
          })
        );

        yield put(
          updateCurrentAnnotationProjectStatistic({
            projectId,
            updateInfo: {
              typeMethod: ORIGINAL_SOURCE,
              fileInfo: {
                isExist,
                size: uploadFiles[fileName].file.size,
                sizeOld: Number(uploadFiles[fileName].sizeOld),
              },
            },
          })
        );

        yield put({
          type: UPDATE_UPLOAD_TO_BACKEND_ANNOTATION_PROJECT.REQUESTED,
          payload: {
            fileName,
            projectId,
            projectName,
            isReplace,
          },
        });
        const uploadedFile = yield select(
          selectorUploadedFileCountAnnotationProject
        );
        const totalUploadFile = yield select(
          selectorTotalUploadFileQuantityAnnotationProject
        );
        const failAndInvalidFileCount = yield select(
          selectorFailAndInvalidFileCountAnnotationProject
        );
        if (isReplaceSingle) {
          yield put(
            clearFileArrayAnnotationProject({ fileNameArray: [fileName] })
          );
          yield put(
            setTotalUploadFileQuantityAnnotationProject({
              totalUploadFileQuantity: null,
            })
          );
        } else if (uploadedFile + failAndInvalidFileCount >= totalUploadFile) {
          yield toast.success("Images are successfully uploaded.");
          yield processUploadDone();
          yield put(
            setTotalUploadFileQuantityAnnotationProject({
              totalUploadFileQuantity: null,
            })
          );
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`There was an error uploading your photo: ${err.message}`);
        yield put(
          updateFileAnnotationProject({
            fileName,
            updateInfo: {
              error: err.message,
              status: FAILED_UPLOAD_FILE_STATUS,
            },
          })
        );
      }
    }
  } catch (e: any) {
    yield put({ type: UPLOAD_FILE_ANNOTATION_PROJECT.FAILED });
    toast.error(e.message);
  }
}

function* handleCheckFilesToUpload(action: {
  type: string;
  payload: CheckFileUploadParams;
}): any {
  const { idToken, projectName, projectId, listFileName } = action.payload;
  try {
    yield put(
      updateFilesAnnotationProject({
        fileNames: listFileName,
        updateInfo: {
          status: CHECKING_UPLOAD_FILE_STATUS,
        },
      })
    );
    const checkedFileResponse = yield call(annotationProjectApi.uploadCheck, {
      idToken,
      projectId,
      listFileName,
    });

    if (checkedFileResponse.error === false) {
      yield put({
        type: CHECK_FILES_ANNOTATION_PROJECT.SUCCEEDED,
      });

      if (checkedFileResponse.data && checkedFileResponse.data.length > 0) {
        const duplicateFileArrayResponse = checkedFileResponse.data;
        yield put(
          notifyExistFileAnnotationProject({
            existFileInfo: duplicateFileArrayResponse,
          })
        );
        yield put(setIsOpenDuplicateModalAnnotationProject({ isOpen: true }));
        yield put(
          updateStatusFileArrayAnnotationProject({
            fileArray: listFileName.filter(
              (fileName: string) =>
                objectIndexOf(
                  duplicateFileArrayResponse,
                  fileName,
                  "filename"
                ) < 0
            ),
            targetStatus: ADDED_UPLOAD_FILE_STATUS,
          })
        );
      } else {
        yield put(
          setTotalUploadFileQuantityAnnotationProject({
            totalUploadFileQuantity: listFileName.length,
          })
        );
        yield put(
          updateStatusFileArrayAnnotationProject({
            fileArray: listFileName,
            targetStatus: QUEUEING_UPLOAD_FILE_STATUS,
          })
        );

        yield all(
          listFileName.map((validFileName: string) =>
            put({
              type: UPLOAD_FILE_ANNOTATION_PROJECT.REQUESTED,
              payload: {
                fileName: validFileName,
                projectId: action.payload.projectId,
                projectName,
              },
            })
          )
        );
      }
    } else {
      yield put({
        type: CHECK_FILES_ANNOTATION_PROJECT.FAILED,
        payload: { errorMessage: checkedFileResponse.message },
      });

      yield put(
        updateStatusFileArrayAnnotationProject({
          fileArray: listFileName,
          targetStatus: ADDED_UPLOAD_FILE_STATUS,
        })
      );

      // yield toast.error(
      //   checkedFileResponse.message || "Can't call check files right now."
      // );
    }
  } catch (e: any) {
    yield put({
      type: CHECK_FILES_ANNOTATION_PROJECT.FAILED,
      errorMessage: e.message,
    });
    yield put(
      updateStatusFileArrayAnnotationProject({
        fileArray: listFileName,
        targetStatus: ADDED_UPLOAD_FILE_STATUS,
      })
    );
    // yield toast.error(e.message);
  }
}

function* handleUploadRequest(requestChannel: any) {
  while (true) {
    const { payload } = yield take(requestChannel);

    yield call(handleUploadFile, {
      type: UPLOAD_FILE_ANNOTATION_PROJECT.REQUESTED,
      payload,
    });
  }
}

function* watchUploadFiles() {
  // @ts-ignore
  const uploadRequestChannel = yield actionChannel(
    UPLOAD_FILE_ANNOTATION_PROJECT.REQUESTED
  );
  for (let i = 0; i < 6; i += 1) {
    yield fork(handleUploadRequest, uploadRequestChannel);
  }
}

function* uploadSaga() {
  yield all([
    takeEvery(
      CHECK_FILES_ANNOTATION_PROJECT.REQUESTED,
      handleCheckFilesToUpload
    ),
    takeEvery(
      UPDATE_UPLOAD_TO_BACKEND_ANNOTATION_PROJECT.REQUESTED,
      handleUpdateUploadToBackend
    ),
    watchUploadFiles(),
    watchUploadProgressChannel(),
  ]);
}

export default uploadSaga;
