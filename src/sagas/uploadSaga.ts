import { Upload } from "@aws-sdk/lib-storage";
import MD5 from "crypto-js/md5";
import {
  COMPRESS_FILE_EXTENSIONS,
  IDENTITY_ID_NAME,
  ID_TOKEN_NAME,
  ORIGINAL_SOURCE,
  UPLOAD_TASK_TYPE,
} from "constants/defaultValues";
import { S3_BUCKET_NAME } from "constants/s3Values";
import {
  ADDED_UPLOAD_FILE_STATUS,
  CHECKING_UPLOAD_FILE_STATUS,
  FAILED_UPLOAD_FILE_STATUS,
  QUEUEING_UPLOAD_FILE_STATUS,
  UPLOADED_UPLOAD_FILE_STATUS,
  UPLOADING_UPLOAD_FILE_STATUS,
} from "constants/uploadFile";
import { toast } from "react-toastify";
import { channel } from "redux-saga";
import {
  all,
  call,
  put,
  take,
  takeEvery,
  select,
  actionChannel,
  fork,
  delay,
} from "redux-saga/effects";
import { selectorS3 } from "reduxes/general/selector";
import {
  clearFileArray,
  notifyExistFile,
  setIsOpenDuplicateModal,
  setTotalUploadFileQuantity,
  updateFile,
  updateFiles,
  updateStatusFileArray,
} from "reduxes/upload/actions";
import {
  CHECK_FILES,
  UPDATE_UPLOAD_TO_BACKEND,
  UPLOAD_FILE,
} from "reduxes/upload/constants";
import {
  selectorUploadedFileCount,
  selectorUploadFiles,
  selectorTotalUploadFileQuantity,
} from "reduxes/upload/selector";

import { projectApi } from "services";
import {
  arrayBufferToWordArray,
  generatePhotoKey,
  generateZipFileKey,
  getLocalStorage,
  objectIndexOf,
  readAsArrayBuffer,
} from "utils/general";
import { CheckFileUploadParams, UploadFileParams } from "reduxes/upload/type";
import { addImageToAlbumFromFile } from "reduxes/album/action";
import {
  fetchTaskInfo,
  updateCurrentProjectStatistic,
} from "reduxes/project/action";
import JSZip from "jszip";

function* handleUpdateUploadToBackend(action: any): any {
  try {
    const { projectId, projectName, fileName, isReplace } = action.payload;
    const uploadFiles = yield select(selectorUploadFiles);
    const IDENTITY_ID = yield getLocalStorage(IDENTITY_ID_NAME) || "";
    const readerResult = yield call(
      readAsArrayBuffer,
      uploadFiles[fileName].file
    );
    if (readerResult) {
      const hash = MD5(arrayBufferToWordArray(readerResult)).toString();

      yield call(projectApi.uploadedUpdate, {
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        projectId,
        projectName,
        listObjectInfo: [
          {
            s3Key: `${S3_BUCKET_NAME}/${IDENTITY_ID}/${projectId}/${fileName}`,
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

      yield put({ type: UPDATE_UPLOAD_TO_BACKEND.SUCCEEDED });
      // NOTE: ADD TO ALBUM HERE
    } else {
      yield put({ type: UPDATE_UPLOAD_TO_BACKEND.FAILED });
      toast.error(`Failed to read file ${fileName}`);
    }
  } catch (e: any) {
    yield put({ type: UPDATE_UPLOAD_TO_BACKEND.FAILED });
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

function* handleUploadZipFile(action: {
  type: string;
  payload: UploadFileParams;
}): any {
  try {
    const { fileName, projectId, projectName } = action.payload;
    const uploadFiles = yield select(selectorUploadFiles);
    const s3 = yield select(selectorS3);
    const IDENTITY_ID = yield getLocalStorage(IDENTITY_ID_NAME) || "";

    const zipFileKey = generateZipFileKey({
      indentityId: IDENTITY_ID,
      projectId,
      fileName,
    });
    try {
      if (uploadFiles[fileName]) {
        const uploadParams = {
          Bucket: S3_BUCKET_NAME,
          Key: zipFileKey,
          Body: uploadFiles[fileName].file,
        };

        yield put(
          updateFile({
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
            updateFile({
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
        const uploadFilesForChecking = yield select(selectorUploadFiles);
        if (!uploadFilesForChecking[fileName]) {
          yield put({ type: UPLOAD_FILE.FAILED });
          return;
        }
        yield put(
          updateFile({
            fileName,
            updateInfo: {
              error: "",
              status: UPLOADED_UPLOAD_FILE_STATUS,
            },
          })
        );
        const uploadZipFileResponse = yield call(projectApi.uploadZipFile, {
          idToken: getLocalStorage(ID_TOKEN_NAME) || "",
          projectId,
          projectName,
          typeMethod: ORIGINAL_SOURCE,
          fileUrl: `s3://${S3_BUCKET_NAME}/${zipFileKey}`,
        });
        if (uploadZipFileResponse.error === false) {
          yield delay(2000);
          yield put(
            fetchTaskInfo({
              idToken: getLocalStorage(ID_TOKEN_NAME) || "",
              taskId: uploadZipFileResponse.data.task_id,
              processType: UPLOAD_TASK_TYPE,
              isNotify: true,
              projectId,
            })
          );
        }
        const uploadedFile = yield select(selectorUploadedFileCount);
        const totalUploadFile = yield select(selectorTotalUploadFileQuantity);
        if (uploadedFile >= totalUploadFile) {
          yield toast.success("Zip file are successfully uploaded");
          yield put(
            clearFileArray({ fileNameArray: Object.keys(uploadFiles) })
          );
          yield put(
            setTotalUploadFileQuantity({ totalUploadFileQuantity: null })
          );
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`There was an error uploading your file: ${err.message}`);
        yield put(
          updateFile({
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
    yield put({ type: UPLOAD_FILE.FAILED });
    toast.error(e.message);
  }
}

function* handleUploadFile(action: {
  type: string;
  payload: UploadFileParams;
}): any {
  try {
    const { fileName, projectId, projectName, isReplace, isReplaceSingle } =
      action.payload;
    const uploadFiles = yield select(selectorUploadFiles);
    const s3 = yield select(selectorS3);
    const IDENTITY_ID = yield getLocalStorage(IDENTITY_ID_NAME) || "";

    const photoKey = generatePhotoKey({
      indentityId: IDENTITY_ID,
      projectId,
      fileName,
    });

    try {
      if (uploadFiles[fileName]) {
        const uploadParams = {
          Bucket: S3_BUCKET_NAME,
          Key: photoKey,
          Body: uploadFiles[fileName].file,
        };

        yield put(
          updateFile({
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
            updateFile({
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
          updateFile({
            fileName,
            updateInfo: {
              error: "",
              status: UPLOADED_UPLOAD_FILE_STATUS,
            },
          })
        );

        // TODO: MOVE ADD TO ALBUM TO ABOVE UPDATE BACKEND
        yield put(
          addImageToAlbumFromFile({
            filename: fileName,
            typeOfImage: ORIGINAL_SOURCE,
            url: window.URL.createObjectURL(uploadFiles[fileName].file),
            size: uploadFiles[fileName].file.size,
            s3_key: `${S3_BUCKET_NAME}/${photoKey}`,
            photoKey,
          })
        );

        yield put(
          updateCurrentProjectStatistic({
            projectId,
            updateInfo: {
              typeMethod: ORIGINAL_SOURCE,
              fileInfo: {
                isExist: !!isReplace,
                size: uploadFiles[fileName].file.size,
                sizeOld: Number(uploadFiles[fileName].sizeOld),
              },
            },
          })
        );

        yield put({
          type: UPDATE_UPLOAD_TO_BACKEND.REQUESTED,
          payload: {
            fileName,
            projectId,
            projectName,
            isReplace,
          },
        });
        const uploadedFile = yield select(selectorUploadedFileCount);
        const totalUploadFile = yield select(selectorTotalUploadFileQuantity);

        if (isReplaceSingle) {
          yield put(clearFileArray({ fileNameArray: [fileName] }));
          yield put(
            setTotalUploadFileQuantity({ totalUploadFileQuantity: null })
          );
        } else if (uploadedFile >= totalUploadFile) {
          yield toast.success("Images are successfully uploaded");
          yield put(
            clearFileArray({ fileNameArray: Object.keys(uploadFiles) })
          );
          yield put(
            setTotalUploadFileQuantity({ totalUploadFileQuantity: null })
          );
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`There was an error uploading your photo: ${err.message}`);
        yield put(
          updateFile({
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
    yield put({ type: UPLOAD_FILE.FAILED });
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
      updateFiles({
        fileNames: listFileName,
        updateInfo: {
          status: CHECKING_UPLOAD_FILE_STATUS,
        },
      })
    );
    const checkedFileResponse = yield call(projectApi.uploadCheck, {
      idToken,
      projectId,
      listFileName,
    });

    if (checkedFileResponse.error === false) {
      yield put({
        type: CHECK_FILES.SUCCEEDED,
      });

      if (checkedFileResponse.data && checkedFileResponse.data.length > 0) {
        const duplicateFileArrayResponse = checkedFileResponse.data;
        yield put(
          notifyExistFile({ existFileInfo: duplicateFileArrayResponse })
        );
        yield put(setIsOpenDuplicateModal({ isOpen: true }));
        yield put(
          updateStatusFileArray({
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
          setTotalUploadFileQuantity({
            totalUploadFileQuantity: listFileName.length,
          })
        );
        yield put(
          updateStatusFileArray({
            fileArray: listFileName,
            targetStatus: QUEUEING_UPLOAD_FILE_STATUS,
          })
        );

        yield all(
          listFileName.map((validFileName: string) =>
            put({
              type: UPLOAD_FILE.REQUESTED,
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
        type: CHECK_FILES.FAILED,
        payload: { errorMessage: checkedFileResponse.message },
      });

      yield put(
        updateStatusFileArray({
          fileArray: listFileName,
          targetStatus: ADDED_UPLOAD_FILE_STATUS,
        })
      );

      // yield toast.error(
      //   checkedFileResponse.message || "Can't call check files right now."
      // );
    }
  } catch (e: any) {
    yield put({ type: CHECK_FILES.FAILED, errorMessage: e.message });
    yield put(
      updateStatusFileArray({
        fileArray: listFileName,
        targetStatus: ADDED_UPLOAD_FILE_STATUS,
      })
    );
    // yield toast.error(e.message);
  }
}
function* validateZipFile(action: {
  type: string;
  payload: UploadFileParams;
}): any {
  const { fileName, projectId, projectName } = action.payload;
  const uploadFiles = yield select(selectorUploadFiles);
  const f = uploadFiles[fileName].file;
  JSZip.loadAsync(f)
    .then((zip) => {
      zip.forEach((relativePath, zipEntry) => {
        console.log(" zipEntry.name", zipEntry.name);
      });
    })
    .catch((e) => console.log(e));
}
function* handleUploadRequest(requestChannel: any) {
  while (true) {
    const { payload } = yield take(requestChannel);
    const { fileName } = payload;
    let isZipUploadRequest = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const compressFileExtension of COMPRESS_FILE_EXTENSIONS) {
      if (
        fileName.indexOf(compressFileExtension) ===
        fileName.length - compressFileExtension.length
      ) {
        isZipUploadRequest = true;
        break;
      }
    }
    if (isZipUploadRequest) {
      // yield call(validateZipFile, {
      //   type: "CHECK_ZIP_FILE",
      //   payload,
      // });
      yield call(handleUploadZipFile, {
        type: UPLOAD_FILE.REQUESTED,
        payload,
      });
    } else {
      yield call(handleUploadFile, {
        type: UPLOAD_FILE.REQUESTED,
        payload,
      });
    }
  }
}

function* watchUploadFiles() {
  // @ts-ignore
  const uploadRequestChannel = yield actionChannel(UPLOAD_FILE.REQUESTED);
  for (let i = 0; i < 6; i += 1) {
    yield fork(handleUploadRequest, uploadRequestChannel);
  }
}

function* uploadSaga() {
  yield all([
    takeEvery(CHECK_FILES.REQUESTED, handleCheckFilesToUpload),
    takeEvery(UPDATE_UPLOAD_TO_BACKEND.REQUESTED, handleUpdateUploadToBackend),
    watchUploadFiles(),
    watchUploadProgressChannel(),
  ]);
}

export default uploadSaga;
