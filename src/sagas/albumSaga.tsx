import { GetObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { ID_TOKEN_NAME, VIEW_ALBUM_PAGE_SIZE } from "constants/defaultValues";
import { S3_BUCKET_NAME } from "constants/s3Values";
import { toast } from "react-toastify";
// import { channel } from "redux-saga";
import {
  actionChannel,
  // actionChannel,
  all,
  call,
  fork,
  put,
  select,
  take,
  takeEvery,
} from "redux-saga/effects";
import {
  fetchImages,
  loadImageContent,
  loadImageContentToDownload,
} from "reduxes/album/action";
import {
  CHANGE_ACTIVE_IMAGES_TAB,
  DELETE_IMAGES,
  FETCH_IMAGES,
  LOAD_IMAGE_CONTENT,
} from "reduxes/album/constants";
import {
  selectorActiveImagesTabId,
  selectorImages,
} from "reduxes/album/selector";
import {
  AlbumImagesFields,
  ChangeActiveImagesTabIdPayload,
  DeleteImagePayload,
  FetchImagesParams,
  LoadImageContentPayload,
} from "reduxes/album/type";
import { LOG_OUT } from "reduxes/auth/constants";
import { zipAllFiles } from "reduxes/download/action";
import {
  FETCH_IMAGES_TO_DOWNLOAD,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD1,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD2,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD3,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD4,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD5,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD6,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD7,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD8,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD9,
} from "reduxes/download/constants";
import {
  selectorDownloadImagesLength,
  selectorTotalNeedDownload,
} from "reduxes/download/selector";
import { selectorS3 } from "reduxes/general/selector";
import { updateCurrentProjectStatistic } from "reduxes/project/action";
import {
  selectorCurrentProjectId,
  selectorCurrentProjectName,
} from "reduxes/project/selector";

import { projectApi } from "services";
import { DeleteObjectInfo } from "services/projectApi";
import {
  convertArrayAlbumImageToObjectKeyFileName,
  getLocalStorage,
  removeListToken,
  switchTabIdToSource,
} from "utils/general";

function* handleLoadImageContent(action: {
  type: string;
  payload: LoadImageContentPayload;
}): any {
  const {
    fileName,
    photoKey,
    isFetchToDownload,
    isSelectedDownload,
    projectId,
    typeMethod,
    imageInfo,
  } = action.payload;

  try {
    if (isSelectedDownload) {
      if (imageInfo && imageInfo.blob) {
        yield put({
          type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD.SUCCEEDED,
          payload: {
            ...imageInfo,
            filename: fileName,
            // url: window.URL.createObjectURL(blob),
            blob: imageInfo.blob,
            size: imageInfo.blob.size,
          },
        });
      }
    } else {
      const s3 = yield select(selectorS3);

      const photoContent = yield s3.send(
        new GetObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: photoKey,
        })
      );

      if (photoContent.Body) {
        const res = new Response(photoContent.Body as any);
        const blob = yield res.blob();

        if (isFetchToDownload) {
          yield put({
            type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD.SUCCEEDED,
            payload: {
              ...imageInfo,
              filename: fileName,
              // url: window.URL.createObjectURL(blob),
              blob,
              size: blob.size,
            },
            data: blob,
          });
          if (isSelectedDownload) {
            //
          } else {
            const downloadImagesLength = yield select(
              selectorDownloadImagesLength
            );
            const totalNeedDownload = yield select(selectorTotalNeedDownload);

            const projectName = yield select(selectorCurrentProjectName);
            // const isZipping = yield select(selectorIsZipping);

            if (totalNeedDownload === downloadImagesLength) {
              yield put(zipAllFiles({ projectId, projectName }));
            }
          }
        } else {
          const currentProjectId = yield select(selectorCurrentProjectId);
          const currentActiveImageTab = yield select(selectorActiveImagesTabId);
          // TODO: cancel saga LOAD_IMAGE_CONTENT
          if (
            projectId === currentProjectId &&
            typeMethod === switchTabIdToSource(currentActiveImageTab)
          ) {
            yield put({
              type: LOAD_IMAGE_CONTENT.SUCCEEDED,
              payload: {
                projectId,
                filename: fileName,
                blob,
                url: window.URL.createObjectURL(blob),
                size: blob.size,
              },
            });
          }
        }
      }
    }
  } catch (e: any) {
    yield put({
      type: isFetchToDownload
        ? LOAD_IMAGE_CONTENT_TO_DOWNLOAD.FAILED
        : LOAD_IMAGE_CONTENT.FAILED,
    });
    // toast.error(e.message);

    if (e instanceof Error) {
      if (e.message.indexOf("expired") > -1) {
        removeListToken();
        yield put({ type: LOG_OUT.SUCCEEDED });
      }
      // toast.error(`There was an error viewing your project: ${e.message}`);
    }
  }
}

function* handleFetchImages(action: {
  type: string;
  payload: FetchImagesParams;
}): any {
  try {
    const { isFetchToDownload, typeMethod, projectId } = action.payload;
    const fetchImagesResponse = yield call(projectApi.listData, action.payload);
    if (!fetchImagesResponse.error) {
      const { items, next_token } = fetchImagesResponse.data;
      const images = convertArrayAlbumImageToObjectKeyFileName(
        items,
        typeMethod
      );
      const currentActiveProjectId = yield select(selectorCurrentProjectId);

      if (currentActiveProjectId === projectId) {
        yield put({
          type: isFetchToDownload
            ? FETCH_IMAGES_TO_DOWNLOAD.SUCCEEDED
            : FETCH_IMAGES.SUCCEEDED,
          payload: {
            previousToken: action.payload.nextToken,
            images,
            nextToken: next_token,
          },
        });

        yield all(
          Object.keys(images).map((fileName: string) =>
            call(
              handleLoadImageContent,
              isFetchToDownload
                ? loadImageContentToDownload({
                    fileName,
                    projectId,
                    typeMethod,
                    photoKey: images[fileName].photoKey,
                    isFetchToDownload,
                  })
                : loadImageContent({
                    fileName,
                    projectId,
                    typeMethod,
                    photoKey: images[fileName].photoKey,
                    isFetchToDownload,
                  })
            )
          )
        );
      }
    } else {
      yield put({
        type: FETCH_IMAGES.FAILED,
        payload: {
          previousToken: action.payload.nextToken,
        },
      });
      if (
        fetchImagesResponse.message &&
        fetchImagesResponse.message.indexOf("expired") > -1
      ) {
        removeListToken();
        yield put({ type: LOG_OUT.SUCCEEDED });
      } else {
        toast.error(fetchImagesResponse.message || `Can't fetch images.`);
      }
    }
  } catch (e: any) {
    yield put({
      type: FETCH_IMAGES.FAILED,
      payload: {
        previousToken: action.payload.nextToken,
      },
    });
    toast.error(e.message);
  }
}

function* handleChangeActiveImagesTab(action: {
  type: string;
  payload: ChangeActiveImagesTabIdPayload;
}): any {
  try {
    const { tabId, projectId } = action.payload;
    yield put(
      fetchImages({
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        projectId,
        typeMethod: switchTabIdToSource(tabId),
        nextToken: "",
        numLimit: VIEW_ALBUM_PAGE_SIZE,
      })
    );
  } catch (e: any) {
    // yield put({
    //   type: FETCH_IMAGES.FAILED,
    //   payload: {
    //     previousToken: action.payload.nextToken,
    //   },
    // });
    // yield;
    toast.error(e.message);
  }
}

// function* handleDeleteImage(action: {
//   type: string;
//   payload: DeleteObjectInfo;
// }): any {
//   const { filename,  } = action.payload;
//   try {
//     yield all (imagesInfo.map((imageObjectInfo: DeleteObjectInfo) => yield call))
//     // const s3 = yield select(selectorS3);
//     // const photoContent = yield s3.send(
//     //   new GetObjectCommand({
//     //     Bucket: S3_BUCKET_NAME,
//     //     Key: photoKey,
//     //   })
//     // );
//   } catch (e: any) {
//     yield put({
//       type: DELETE_IMAGES.FAILED,
//     });
//     toast.error(e.message);

//     if (e instanceof Error) {
//       if (e.message.indexOf("expired") > -1) {
//         removeListToken();
//         yield put({ type: LOG_OUT.SUCCEEDED });
//       }
//       toast.error(`There was an error deleting your image: ${e.message}`);
//     }
//   }
// }

function* handleDeleteImages(action: {
  type: string;
  payload: DeleteImagePayload;
}): any {
  const { imagesInfo, projectId } = action.payload;
  try {
    const images: AlbumImagesFields = yield select(selectorImages);

    const s3 = yield select(selectorS3);

    yield s3.send(
      new DeleteObjectsCommand({
        Bucket: S3_BUCKET_NAME,
        Delete: {
          Objects: imagesInfo.map((fileName: string) => ({
            Key: images[fileName].photoKey,
          })),
        },
      })
    );

    const deleteImagesResponse = yield call(projectApi.deleteImages, {
      idToken: getLocalStorage(ID_TOKEN_NAME) || "",
      projectId,
      listObjectInfo: imagesInfo.map(
        (fileName: string): DeleteObjectInfo => ({
          filename: fileName,
          size: images[fileName].size || 0,
          type_method: images[fileName].typeOfImage,
        })
      ),
    });

    if (!deleteImagesResponse.error) {
      yield all(
        imagesInfo.map((fileName: string) =>
          put(
            updateCurrentProjectStatistic({
              projectId,
              updateInfo: {
                typeMethod: images[fileName].typeOfImage,
                fileInfo: {
                  isExist: true,
                  isDelete: true,
                  size: images[fileName].size || 0,
                },
              },
            })
          )
        )
      );

      yield toast.success(
        `${imagesInfo.length} image${imagesInfo.length > 1 ? "s" : ""} ${
          imagesInfo.length > 1 ? "have" : "has"
        } been deleted.`
      );

      yield put({
        type: DELETE_IMAGES.SUCCEEDED,
        payload: {
          imagesInfo,
        },
      });
    } else {
      yield put({
        type: DELETE_IMAGES.FAILED,
      });
      toast.error(deleteImagesResponse.message);
    }
  } catch (e: any) {
    yield put({
      type: DELETE_IMAGES.FAILED,
    });

    if (e instanceof Error) {
      if (e.message.indexOf("expired") > -1) {
        removeListToken();
        yield put({ type: LOG_OUT.SUCCEEDED });
      } else {
        toast.error(e.message);
      }
      // toast.error(`There was an error deleting your image: ${e.message}`);
    }
  }
}

function* watchLoadImageContentToDownload() {
  // @ts-ignore
  const requestChan = yield actionChannel(
    LOAD_IMAGE_CONTENT_TO_DOWNLOAD.REQUESTED
  );

  while (true) {
    const { payload } = yield take(requestChan);

    yield call(handleLoadImageContent, {
      type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD.REQUESTED,
      payload,
    });
  }
}

function* watchLoadImageContentToDownload1() {
  // @ts-ignore
  const requestChan = yield actionChannel(
    LOAD_IMAGE_CONTENT_TO_DOWNLOAD1.REQUESTED
  );

  while (true) {
    const { payload } = yield take(requestChan);

    yield call(handleLoadImageContent, {
      type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD1.REQUESTED,
      payload,
    });
  }
}

function* watchLoadImageContentToDownload2() {
  // @ts-ignore
  const requestChan = yield actionChannel(
    LOAD_IMAGE_CONTENT_TO_DOWNLOAD2.REQUESTED
  );

  while (true) {
    const { payload } = yield take(requestChan);

    yield call(handleLoadImageContent, {
      type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD2.REQUESTED,
      payload,
    });
  }
}

function* watchLoadImageContentToDownload3() {
  // @ts-ignore
  const requestChan = yield actionChannel(
    LOAD_IMAGE_CONTENT_TO_DOWNLOAD3.REQUESTED
  );

  while (true) {
    const { payload } = yield take(requestChan);

    yield call(handleLoadImageContent, {
      type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD3.REQUESTED,
      payload,
    });
  }
}

function* watchLoadImageContentToDownload4() {
  // @ts-ignore
  const requestChan = yield actionChannel(
    LOAD_IMAGE_CONTENT_TO_DOWNLOAD4.REQUESTED
  );

  while (true) {
    const { payload } = yield take(requestChan);

    yield call(handleLoadImageContent, {
      type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD4.REQUESTED,
      payload,
    });
  }
}

function* watchLoadImageContentToDownload5() {
  // @ts-ignore
  const requestChan = yield actionChannel(
    LOAD_IMAGE_CONTENT_TO_DOWNLOAD5.REQUESTED
  );

  while (true) {
    const { payload } = yield take(requestChan);

    yield call(handleLoadImageContent, {
      type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD5.REQUESTED,
      payload,
    });
  }
}

function* watchLoadImageContentToDownload6() {
  // @ts-ignore
  const requestChan = yield actionChannel(
    LOAD_IMAGE_CONTENT_TO_DOWNLOAD6.REQUESTED
  );

  while (true) {
    const { payload } = yield take(requestChan);

    yield call(handleLoadImageContent, {
      type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD6.REQUESTED,
      payload,
    });
  }
}

function* watchLoadImageContentToDownload7() {
  // @ts-ignore
  const requestChan = yield actionChannel(
    LOAD_IMAGE_CONTENT_TO_DOWNLOAD7.REQUESTED
  );

  while (true) {
    const { payload } = yield take(requestChan);

    yield call(handleLoadImageContent, {
      type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD7.REQUESTED,
      payload,
    });
  }
}

function* watchLoadImageContentToDownload8() {
  // @ts-ignore
  const requestChan = yield actionChannel(
    LOAD_IMAGE_CONTENT_TO_DOWNLOAD8.REQUESTED
  );

  while (true) {
    const { payload } = yield take(requestChan);

    yield call(handleLoadImageContent, {
      type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD8.REQUESTED,
      payload,
    });
  }
}

function* watchLoadImageContentToDownload9() {
  // @ts-ignore
  const requestChan = yield actionChannel(
    LOAD_IMAGE_CONTENT_TO_DOWNLOAD9.REQUESTED
  );

  while (true) {
    const { payload } = yield take(requestChan);

    yield call(handleLoadImageContent, {
      type: LOAD_IMAGE_CONTENT_TO_DOWNLOAD9.REQUESTED,
      payload,
    });
  }
}

function* albumSaga() {
  // yield takeEvery(
  //   LOAD_IMAGE_CONTENT_TO_DOWNLOAD.REQUESTED,
  //   handleLoadImageContent
  // );

  yield all([
    takeEvery(LOAD_IMAGE_CONTENT.REQUESTED, handleLoadImageContent),
    takeEvery(FETCH_IMAGES.REQUESTED, handleFetchImages),
    takeEvery(FETCH_IMAGES_TO_DOWNLOAD.REQUESTED, handleFetchImages),
    takeEvery(CHANGE_ACTIVE_IMAGES_TAB, handleChangeActiveImagesTab),
    takeEvery(DELETE_IMAGES.REQUESTED, handleDeleteImages),
    fork(watchLoadImageContentToDownload),
    fork(watchLoadImageContentToDownload1),
    fork(watchLoadImageContentToDownload2),
    fork(watchLoadImageContentToDownload3),
    fork(watchLoadImageContentToDownload4),
    fork(watchLoadImageContentToDownload5),
    fork(watchLoadImageContentToDownload6),
    fork(watchLoadImageContentToDownload7),
    fork(watchLoadImageContentToDownload8),
    fork(watchLoadImageContentToDownload9),
  ]);
}

export default albumSaga;
