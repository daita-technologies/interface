import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import {
  AlbumImagesFields,
  FetchImagesParams,
  ImageSourceType,
} from "reduxes/album/type";
import {
  downloadZipEc2Progress,
  updateTotalNeedDownload,
  zipSelectedFiles,
} from "reduxes/download/action";
import {
  DOWNLOAD_ALL_FILES,
  DOWNLOAD_SELECTED_FILES,
  DOWNLOAD_ZIP_EC2,
  DOWNLOAD_ZIP_EC2_CREATE,
  DOWNLOAD_ZIP_EC2_PROGRESS,
  FETCH_IMAGES_TO_DOWNLOAD,
  ZIP_ALL_FILES,
  ZIP_SELECTED_FILES,
} from "reduxes/download/constants";
import {
  selectorDownloadImages,
  selectorTotalSelectedFilesNeedDownload,
} from "reduxes/download/selector";

import { projectApi } from "services";
import {
  convertArrayAlbumImageToObjectKeyFileName,
  getLoadImageContentToDownloadActionName,
} from "utils/general";
import {
  AUGMENT_SOURCE,
  ERROR_TASK_STATUS,
  MAXIMUM_FETCH_IMAGES_AMOUNT,
  ORIGINAL_SOURCE,
  PREPROCESS_SOURCE,
} from "constants/defaultValues";
import {
  DownloadAllFilesPayload,
  DownloadFilesType,
  DownloadSelectedFilesPayload,
  ZipFilesPayload,
} from "reduxes/download/type";
import {
  selectorCurrentProjectId,
  selectorCurrentProjectName,
  selectorCurrentProjectTotalAugmentImage,
  selectorCurrentProjectTotalImage,
  selectorCurrentProjectTotalOriginalImage,
  selectorCurrentProjectTotalPreprocessImage,
} from "reduxes/project/selector";
import { selectorImages } from "reduxes/album/selector";
import { downloadApi } from "services";
import {
  DownloadZipEc2Params,
  DownloadZipEc2Progress,
} from "services/downloadApi";

const ALL_SOURCE_TYPES = [ORIGINAL_SOURCE, PREPROCESS_SOURCE, AUGMENT_SOURCE];

function mapTotalImageSelectorFunc(targetImageSource?: ImageSourceType) {
  switch (targetImageSource) {
    case ORIGINAL_SOURCE:
      return selectorCurrentProjectTotalOriginalImage;
    case PREPROCESS_SOURCE:
      return selectorCurrentProjectTotalPreprocessImage;
    case AUGMENT_SOURCE:
      return selectorCurrentProjectTotalAugmentImage;
    default:
      return selectorCurrentProjectTotalImage;
  }
}

// NOTE: TODO need to check type of this payload
function* handleDownloadAllFiles(action: {
  type: string;
  payload: FetchImagesParams & DownloadAllFilesPayload;
}): any {
  const { projectId, typeMethod, targetImageSource } = action.payload;
  try {
    const totalNeedDownload = yield select(
      mapTotalImageSelectorFunc(targetImageSource)
    );

    yield put(updateTotalNeedDownload({ totalNeedDownload }));

    const TARGET_SOURCE_TYPES = targetImageSource
      ? [targetImageSource]
      : ALL_SOURCE_TYPES;

    yield all(
      TARGET_SOURCE_TYPES.map(function* (source: string) {
        let loopNextToken: any = "";
        while (loopNextToken !== null) {
          const fetchImagesResponse = yield call(projectApi.listData, {
            ...action.payload,
            nextToken: loopNextToken,
            numLimit: MAXIMUM_FETCH_IMAGES_AMOUNT,
            typeMethod: source as ImageSourceType,
          });

          if (!fetchImagesResponse.error) {
            const { items, next_token } = fetchImagesResponse.data;

            const images = convertArrayAlbumImageToObjectKeyFileName(
              items,
              source as ImageSourceType
            );
            yield (loopNextToken = next_token);
            yield put({
              type: FETCH_IMAGES_TO_DOWNLOAD.SUCCEEDED,
              payload: {
                previousToken: action.payload.nextToken,
                images,
                nextToken: next_token,
              },
            });

            yield all(
              Object.keys(images).map((fileName: string, index: number) =>
                put({
                  type: getLoadImageContentToDownloadActionName(index),
                  payload: {
                    typeMethod,
                    imageInfo: images[fileName],
                    fileName,
                    projectId,
                    photoKey: images[fileName].photoKey,
                    isFetchToDownload: true,
                  },
                })
              )
            );
          }
        }
      })
    );
  } catch (e: any) {
    yield put({
      type: DOWNLOAD_ALL_FILES.FAILED,
    });
    toast.error(e.message);
  }
}

function mapImageSourceTypeToFolderName(typeOfImage: ImageSourceType) {
  switch (typeOfImage) {
    case PREPROCESS_SOURCE:
      return "pre process";
    case AUGMENT_SOURCE:
      return "augmentation";
    case ORIGINAL_SOURCE:
    default:
      return "origin";
  }
}

function* handleZipFiles(action: {
  type: string;
  payload: ZipFilesPayload;
}): any {
  const { projectId, projectName, isDownloadSelectedFiles } = action.payload;
  try {
    const imagesToZip: AlbumImagesFields = yield select(selectorDownloadImages);

    const jsonContentObject: DownloadFilesType = {};
    yield Object.keys(imagesToZip).forEach((fileName: string) => {
      jsonContentObject[fileName] = {
        name: fileName,
        typeOfImage: imagesToZip[fileName].typeOfImage || "",
        methodToCreate: imagesToZip[fileName].gen_id || "",
        class: imagesToZip[fileName].classtype || "",
        size: imagesToZip[fileName].size || "",
        nameOfProject: projectName,
      };
    });

    const zipInstance = new JSZip();
    yield zipInstance.file(
      `${projectId}/${projectId}${
        isDownloadSelectedFiles ? "selected-files" : ""
      }.json`,
      JSON.stringify(jsonContentObject)
    );

    const imagesToZipFileNameArray = Object.keys(imagesToZip);

    yield all(
      imagesToZipFileNameArray.map(function* (fileName: string) {
        const { blob } = imagesToZip[fileName];

        if (blob) {
          yield zipInstance.file(
            `${projectId}/${mapImageSourceTypeToFolderName(
              imagesToZip[fileName].typeOfImage
            )}/${fileName}`,
            blob
          );
        }
      })
    );

    // if (index + 1 >= imagesToZipFileNameArray.length) {
    yield zipInstance.generateAsync({ type: "blob" }).then((zipBlob: Blob) => {
      saveAs(zipBlob, `${projectId}.zip`);
    });
    // }

    if (isDownloadSelectedFiles) {
      yield put({
        type: ZIP_SELECTED_FILES.SUCCEEDED,
      });
      yield put({
        type: DOWNLOAD_SELECTED_FILES.SUCCEEDED,
      });
    } else {
      yield put({
        type: ZIP_ALL_FILES.SUCCEEDED,
      });
      yield put({
        type: DOWNLOAD_ALL_FILES.SUCCEEDED,
      });
    }
  } catch (e: any) {
    if (isDownloadSelectedFiles) {
      yield put({
        type: ZIP_SELECTED_FILES.FAILED,
      });
    } else {
      yield put({
        type: ZIP_ALL_FILES.FAILED,
      });
    }
    toast.error(e.message);
  }
}

function* handleDownloadSelectedFiles(action: {
  type: string;
  payload: DownloadSelectedFilesPayload;
}): any {
  try {
    const { selectedList } = action.payload;
    const albumImages: AlbumImagesFields = yield select(selectorImages);

    yield all(
      selectedList.map(function* (fileName: string, index: number) {
        const image = albumImages[fileName];

        if (image.url) {
          const { blob } = image;
          if (blob) {
            return yield put({
              type: getLoadImageContentToDownloadActionName(index),
              payload: { fileName, imageInfo: image, isSelectedDownload: true },
            });
          }
        }

        return null;
      })
    );

    const totalSelectedFilesNeedDownload = yield select(
      selectorTotalSelectedFilesNeedDownload
    );
    const projectId = yield select(selectorCurrentProjectId);
    const projectName = yield select(selectorCurrentProjectName);

    if (totalSelectedFilesNeedDownload === selectedList.length) {
      yield put(
        zipSelectedFiles({
          projectId,
          projectName,
          isDownloadSelectedFiles: true,
        })
      );
    }
  } catch (e: any) {
    yield put({
      type: DOWNLOAD_ALL_FILES.FAILED,
    });
    toast.error(e.message);
  }
}

function* handleDownloadZipEc2Create(action: {
  type: string;
  payload: DownloadZipEc2Params;
}): any {
  const { idToken } = action.payload;
  try {
    const downloadZipEc2Response = yield call(
      downloadApi.downloadCreate,
      action.payload
    );

    if (downloadZipEc2Response && downloadZipEc2Response.error === false) {
      const resTaskId = downloadZipEc2Response.data.task_id;
      yield put({
        type: DOWNLOAD_ZIP_EC2_CREATE.SUCCEEDED,
        payload: {
          taskId: resTaskId,
        },
      });
      yield put(downloadZipEc2Progress({ idToken, taskId: resTaskId }));
    } else {
      yield put({
        type: DOWNLOAD_ZIP_EC2_CREATE.FAILED,
      });
      yield downloadZipEc2Response.message
        ? toast.error(downloadZipEc2Response.message)
        : () => null;
    }
  } catch (e: any) {
    yield put({
      type: DOWNLOAD_ZIP_EC2.FAILED,
    });
    yield toast.error(e.message);
  }
}

function* handleDownloadZipEc2Progress(action: {
  type: string;
  payload: DownloadZipEc2Progress;
}): any {
  try {
    const downloadZipEc2ProgressResponse = yield call(
      downloadApi.downloadUpdate,
      action.payload
    );

    const projectId = yield select(selectorCurrentProjectId);

    if (
      downloadZipEc2ProgressResponse &&
      downloadZipEc2ProgressResponse.error === false &&
      downloadZipEc2ProgressResponse.data
    ) {
      yield put({
        type: DOWNLOAD_ZIP_EC2_PROGRESS.SUCCEEDED,
        payload: downloadZipEc2ProgressResponse.data,
      });

      if (downloadZipEc2ProgressResponse.data.status === ERROR_TASK_STATUS) {
        yield toast.error(
          "Unexpected error occurred when downloading your images."
        );
        yield put({
          type: DOWNLOAD_ALL_FILES.FAILED,
        });
      }

      if (downloadZipEc2ProgressResponse.data.presign_url) {
        yield put({ type: DOWNLOAD_ZIP_EC2.SUCCEEDED });

        const downloadBtn = document.createElement("a");
        downloadBtn.setAttribute("download", `${projectId}.zip`);
        downloadBtn.href = downloadZipEc2ProgressResponse.data.presign_url;
        downloadBtn.style.display = "none";
        document.documentElement.appendChild(downloadBtn);
        downloadBtn.click();

        setTimeout(() => {
          document.documentElement.removeChild(downloadBtn);
        }, 1000);
      }
    } else {
      yield put({
        type: DOWNLOAD_ZIP_EC2_PROGRESS.FAILED,
      });
      yield downloadZipEc2ProgressResponse.message
        ? toast.error(downloadZipEc2ProgressResponse.message)
        : () => null;
    }
  } catch (e: any) {
    yield put({
      type: DOWNLOAD_ZIP_EC2_PROGRESS.FAILED,
    });
    yield toast.error(e.message);
  }
}

function* downloadSaga() {
  yield takeLatest(DOWNLOAD_ALL_FILES.REQUESTED, handleDownloadAllFiles);
  yield takeLatest(
    DOWNLOAD_SELECTED_FILES.REQUESTED,
    handleDownloadSelectedFiles
  );
  yield takeLatest(ZIP_ALL_FILES.REQUESTED, handleZipFiles);
  yield takeLatest(ZIP_SELECTED_FILES.REQUESTED, handleZipFiles);
  yield takeLatest(
    DOWNLOAD_ZIP_EC2_CREATE.REQUESTED,
    handleDownloadZipEc2Create
  );
  yield takeLatest(
    DOWNLOAD_ZIP_EC2_PROGRESS.REQUESTED,
    handleDownloadZipEc2Progress
  );
}

export default downloadSaga;
