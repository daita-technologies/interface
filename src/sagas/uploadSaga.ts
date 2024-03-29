import { Upload } from "@aws-sdk/lib-storage";
import {
  IDENTITY_ID_NAME,
  ID_TOKEN_NAME,
  LIMIT_UPLOAD_IMAGE_SIZE,
  MAXIMUM_ZIP_FILE_SIZE,
  MAX_ALLOW_UPLOAD_IMAGES,
  ORIGINAL_SOURCE,
  UPLOAD_TASK_PROCESS_TYPE,
} from "constants/defaultValues";
import { S3_BUCKET_NAME } from "constants/s3Values";
import {
  ADDED_UPLOAD_FILE_STATUS,
  CHECKING_UPLOAD_FILE_STATUS,
  CHECK_IMAGE,
  CHECK_ZIP_FILE,
  FAILED_UPLOAD_FILE_STATUS,
  QUEUEING_UPLOAD_FILE_STATUS,
  UPLOADED_UPLOAD_FILE_STATUS,
  UPLOADING_UPLOAD_FILE_STATUS,
} from "constants/uploadFile";
import MD5 from "crypto-js/md5";
import JSZip from "jszip";
import { toast } from "react-toastify";
import { channel } from "redux-saga";
import {
  actionChannel,
  all,
  call,
  delay,
  fork,
  put,
  select,
  take,
  takeEvery,
} from "redux-saga/effects";
import { addImageToAlbumFromFile } from "reduxes/album/action";
import { selectorS3 } from "reduxes/general/selector";
import {
  fetchTaskInfo,
  updateCurrentProjectStatistic,
} from "reduxes/project/action";
import { selectorCurrentProjectTotalOriginalImage } from "reduxes/project/selector";
import { alertGoToTaskDashboard } from "reduxes/task/action";
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
  selectorFailAndInvalidFileCount,
  selectorTotalUploadFileQuantity,
  selectorUploadedFileCount,
  selectorUploadFiles,
} from "reduxes/upload/selector";
import {
  CheckFileUploadParams,
  UploadFileParams,
  UploadFilesType,
} from "reduxes/upload/type";
import { projectApi } from "services";
import {
  arrayBufferToWordArray,
  formatBytes,
  generatePhotoKey,
  generateZipFileKey,
  getLocalStorage,
  isImageFile,
  isZipFile,
  objectIndexOf,
  readAsArrayBuffer,
} from "utils/general";

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
function* isZipFileValid(action: {
  type: string;
  payload: UploadFileParams;
}): any {
  const totalOriginalImage = yield select(
    selectorCurrentProjectTotalOriginalImage
  );
  const { fileName } = action.payload;
  const uploadFiles = yield select(selectorUploadFiles);
  const { file } = uploadFiles[fileName];

  try {
    if (file.size >= MAXIMUM_ZIP_FILE_SIZE) {
      yield put(
        updateFile({
          fileName,
          updateInfo: {
            error: `The file size exceeds the limit allowed (${formatBytes(
              file.size
            )}/${formatBytes(
              MAXIMUM_ZIP_FILE_SIZE
            )}). Please remove it to start a new uploading`,
            status: FAILED_UPLOAD_FILE_STATUS,
          },
        })
      );
      return false;
    }
    const zip = yield JSZip.loadAsync(file);
    let countImages = 0;
    let validateFileSizeCounter = 0;
    zip.forEach((relativePath: any, zipEntry: any) => {
      const { name } = zipEntry;
      if (isImageFile(name)) {
        // eslint-disable-next-line no-underscore-dangle
        if (zipEntry._data.uncompressedSize <= LIMIT_UPLOAD_IMAGE_SIZE) {
          validateFileSizeCounter += 1;
        }
        countImages += 1;
      }
    });
    if (countImages === 0) {
      yield put(
        updateFile({
          fileName,
          updateInfo: {
            error: `Not found any images in the zip files. Please remove it to start a new uploading`,
            status: FAILED_UPLOAD_FILE_STATUS,
          },
        })
      );
      return false;
    }
    if (validateFileSizeCounter === 0) {
      yield put(
        updateFile({
          fileName,
          updateInfo: {
            error: `Not found any images with a size of less than ${formatBytes(
              LIMIT_UPLOAD_IMAGE_SIZE
            )}. Please remove it to start a new uploading`,
            status: FAILED_UPLOAD_FILE_STATUS,
          },
        })
      );
      return false;
    }
    if (countImages + totalOriginalImage <= MAX_ALLOW_UPLOAD_IMAGES) {
      return true;
    }
    const totalImage = totalOriginalImage + countImages;
    const exceedCount = totalImage - MAX_ALLOW_UPLOAD_IMAGES;
    yield put(
      updateFile({
        fileName,
        updateInfo: {
          error: `The number of images exceed ${exceedCount} (${totalImage}/ ${MAX_ALLOW_UPLOAD_IMAGES}). Please remove it to start a new uploading`,
          status: FAILED_UPLOAD_FILE_STATUS,
        },
      })
    );
  } catch (e) {
    yield put(
      updateFile({
        fileName,
        updateInfo: {
          error: `Failed to parse zip file ${fileName}. Please remove it to start a new uploading`,
          status: FAILED_UPLOAD_FILE_STATUS,
        },
      })
    );
  }
  return false;
}
function* processUploadDone() {
  const UpdatedUploadFiles: UploadFilesType = yield select(selectorUploadFiles);
  const listDeleteFile = Object.keys(UpdatedUploadFiles).filter(
    (nameOfFile) =>
      UpdatedUploadFiles[nameOfFile].status === UPLOADED_UPLOAD_FILE_STATUS
  );
  yield put(clearFileArray({ fileNameArray: listDeleteFile }));
  yield put(setTotalUploadFileQuantity({ totalUploadFileQuantity: null }));
}
function* handleUploadZipFile(action: {
  type: string;
  payload: UploadFileParams;
}): any {
  try {
    const isValid = yield call(isZipFileValid, {
      type: CHECK_ZIP_FILE,
      payload: action.payload,
    });
    if (isValid === false) {
      return;
    }
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
              processType: UPLOAD_TASK_PROCESS_TYPE,
              isNotify: true,
              projectId,
            })
          );
        }
        const uploadedFile = yield select(selectorUploadedFileCount);
        const totalUploadFile = yield select(selectorTotalUploadFileQuantity);
        const failAndInvalidFileCount = yield select(
          selectorFailAndInvalidFileCount
        );
        if (uploadedFile + failAndInvalidFileCount >= totalUploadFile) {
          yield put(
            alertGoToTaskDashboard({
              message: `Uploading of the ZIP file has been started successfully. Please wait a moment until we unzip the file. You can check the status under "My Tasks".`,
              projectId,
            })
          );
          yield processUploadDone();
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
function* isImageValid(action: {
  type: string;
  payload: UploadFileParams;
}): any {
  const { fileName } = action.payload;
  const uploadFiles = yield select(selectorUploadFiles);
  const { file } = uploadFiles[fileName];
  if (file.size > LIMIT_UPLOAD_IMAGE_SIZE) {
    yield put(
      updateFile({
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
        const isValid = yield call(isImageValid, {
          type: CHECK_IMAGE,
          payload: action.payload,
        });
        if (isValid === false) {
          return;
        }
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
            thumbnailUrl: window.URL.createObjectURL(
              uploadFiles[fileName].file
            ),
            url: window.URL.createObjectURL(uploadFiles[fileName].file),
            size: uploadFiles[fileName].file.size,
            s3_key: `${S3_BUCKET_NAME}/${photoKey}`,
            thumbnail: `${S3_BUCKET_NAME}/${photoKey}`,
            photoKey,
          })
        );

        yield put(
          updateCurrentProjectStatistic({
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
        const failAndInvalidFileCount = yield select(
          selectorFailAndInvalidFileCount
        );
        if (isReplaceSingle) {
          yield put(clearFileArray({ fileNameArray: [fileName] }));
          yield put(
            setTotalUploadFileQuantity({ totalUploadFileQuantity: null })
          );
        } else if (uploadedFile + failAndInvalidFileCount >= totalUploadFile) {
          yield toast.success("Images are successfully uploaded.");
          yield processUploadDone();
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

function* handleUploadRequest(requestChannel: any) {
  while (true) {
    const { payload } = yield take(requestChannel);
    const { fileName } = payload;
    if (isZipFile(fileName)) {
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
