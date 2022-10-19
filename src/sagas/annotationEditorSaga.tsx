import { toast } from "react-toastify";
import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  CHANGE_PREVIEW_IMAGE,
  SAVE_ANNOTATION_STATE_MANAGER,
  SAVE_REMOTE_NEW_CLASS_LABEL,
} from "reduxes/annotationmanager/constants";
import {
  selectorAnnotationCurrentProject,
  selectorCurrentAnnotationAndFileInfo,
} from "reduxes/annotationProject/selector";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  CssStyle,
  LabelClassProperties,
} from "components/Annotation/Editor/type";
import { importAnnotationDaita } from "components/Annotation/Formart";
import { exportAnnotationToJson } from "components/Annotation/Formart/daita";
import { loadImage } from "components/UploadFile";
import { ID_TOKEN_NAME } from "constants/defaultValues";
import { resetCurrentStateDrawObject } from "reduxes/annotation/action";
import {
  DrawObject,
  ResetCurrentStateDrawObjectPayload,
} from "reduxes/annotation/type";
import {
  addImagesToAnnotation,
  addNewClassLabel,
  setAnnotationStateManager,
} from "reduxes/annotationmanager/action";
import { selectorLabelClassPropertiesByLabelClass } from "reduxes/annotationmanager/selecetor";
import {
  AnnotationImagesProperty,
  SaveAnnotationStateManagerProps,
} from "reduxes/annotationmanager/type";
import { FETCH_ANNOTATION_AND_FILE_INFO } from "reduxes/annotationProject/constants";
import {
  AnnotationAndFileInfoApi,
  AnnotationProjectInfo,
} from "reduxes/annotationProject/type";
import { selectorS3 } from "reduxes/general/selector";
import annotationProjectApi from "services/annotationProjectApi";
import { getLocalStorage } from "utils/general";

function getKeyS3(s3Key: string) {
  const splitKey = s3Key.split("/");
  const bucketName = splitKey.splice(0, 1)[0];
  const key = splitKey.join("/");
  return { bucketName, key };
}

function* handleGetDataImage(s3_key: string, filename: string): any {
  const s3 = yield select(selectorS3);
  const { bucketName, key } = getKeyS3(s3_key);

  const photoContent = yield s3.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
  if (photoContent.Body) {
    const res = new Response(photoContent.Body as any);
    const blob = yield res.blob();
    const img: { image: HTMLImageElement; filename?: string } = yield loadImage(
      blob
    );
    const image: AnnotationImagesProperty = {
      image: new File([blob], filename, {
        type: blob.type,
      }),
      width: img.image.width,
      height: img.image.height,
    };
    return image;
  }
  return null;
}
function* handleGetAnnotationFile(s3_key: string): any {
  const s3 = yield select(selectorS3);
  const splitPhotoKey = s3_key.split("/");
  const bucketName = splitPhotoKey.splice(0, 1)[0];
  const photoKey = splitPhotoKey.join("/");

  const photoContent = yield s3.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: photoKey,
    })
  );
  if (photoContent.Body) {
    const res = new Response(photoContent.Body as any);
    const blob = yield res.blob();
    const labelFile = new File([blob], photoKey);
    const annotation = yield importAnnotationDaita(labelFile);
    return annotation;
  }
  return null;
}
function* handleChangeImagePreview(action: any): any {
  yield handleFetchAnnotationAndFileInfo(action);
}
function updateDrawObject(
  value: DrawObject,
  labelClassPropertiesByLabelClass: Record<string, LabelClassProperties>
): any {
  const drawObjectRet: DrawObject = { ...value };
  const css = drawObjectRet.data.cssStyle;
  const label = value.data.label.label;
  let classLabel = labelClassPropertiesByLabelClass[label];
  if (classLabel) {
    const newCss = classLabel.cssStyle;
    for (const prop in css) {
      drawObjectRet.data.cssStyle = {
        ...drawObjectRet.data.cssStyle,
        [prop]:
          newCss && newCss[prop as keyof CssStyle]
            ? newCss[prop as keyof CssStyle]
            : css[prop as keyof CssStyle],
      };
    }
  }
  return drawObjectRet;
}
function* handleFetchAnnotationAndFileInfo(action: any): any {
  const annotationCurrentProject: AnnotationProjectInfo = yield select(
    selectorAnnotationCurrentProject
  );

  const fetchDetailProjectResponse = yield call(
    annotationProjectApi.annotationAndFileInfo,
    {
      idToken: getLocalStorage(ID_TOKEN_NAME) || "",
      categoryId: annotationCurrentProject.ls_category.category_id,
      filename: action.payload.imageName,
      projectId: annotationCurrentProject.project_id,
    }
  );
  if (fetchDetailProjectResponse.error === true) {
    toast.error(fetchDetailProjectResponse.message);
    return;
  }
  yield put({
    type: FETCH_ANNOTATION_AND_FILE_INFO.SUCCEEDED,
    payload: {
      currentAnnotationAndFileInfo: fetchDetailProjectResponse.data,
    },
  });
  const { file_info, label_info } = fetchDetailProjectResponse.data;
  try {
    const image = yield handleGetDataImage(
      file_info.s3_key,
      file_info.filename
    );

    // const annotationCurrentProject: AnnotationProjectInfo = yield select(
    //   selectorAnnotationCurrentProject
    // );
    let annotation: ResetCurrentStateDrawObjectPayload = { drawObjectById: {} };
    if (label_info && label_info) {
      const annotationTmp = yield handleGetAnnotationFile(
        label_info.s3key_jsonlabel
      );
      if (annotationTmp) {
        annotation = annotationTmp;
      }
    }
    const labelClassPropertiesByLabelClass = yield select(
      selectorLabelClassPropertiesByLabelClass
    );
    const drawObjectById = annotation.drawObjectById;
    Object.entries(drawObjectById).map(([key, value]) => {
      drawObjectById[key] = updateDrawObject(
        value,
        labelClassPropertiesByLabelClass
      );
    });
    yield put(
      setAnnotationStateManager({
        imageName: file_info.filename,
        drawObjectById: drawObjectById,
      })
    );

    yield put(
      resetCurrentStateDrawObject({
        drawObjectById: drawObjectById,
      })
    );
    if (image) {
      yield put(addImagesToAnnotation({ annotationImagesProperties: [image] }));
    } else {
      toast.error("Fail to get image data");
    }
  } catch (e: any) {
    toast.error(e.message);
  }
}
function* handleAddNewClassLabel(action: any): any {
  console.log(action.payload);
  const annotationCurrentProject: AnnotationProjectInfo = yield select(
    selectorAnnotationCurrentProject
  );
  const saveLabelResp = yield call(
    annotationProjectApi.addListOfClassNameToCategory,
    {
      idToken: getLocalStorage(ID_TOKEN_NAME) || "",
      categoryId: annotationCurrentProject.ls_category.category_id,
      lsClassName: [action.payload.labelClassProperties.label.label],
    }
  );
  if (saveLabelResp.error === false) {
    yield put(addNewClassLabel(action.payload));
    toast.success("Add new class success");
  } else {
    toast.error(saveLabelResp.message);
  }
}
function* handleSaveAnnotationStateManager(action: any): any {
  const { imageName, drawObjectById } =
    action.payload as SaveAnnotationStateManagerProps;
  const currentAnnotationAndFileInfo: AnnotationAndFileInfoApi = yield select(
    selectorCurrentAnnotationAndFileInfo
  );
  const s3 = yield select(selectorS3);
  let s3key_jsonlabel = "";
  const annotationCurrentProject: AnnotationProjectInfo = yield select(
    selectorAnnotationCurrentProject
  );
  if (
    currentAnnotationAndFileInfo.label_info &&
    currentAnnotationAndFileInfo.label_info.length > 0
  ) {
    s3key_jsonlabel =
      currentAnnotationAndFileInfo.label_info[0].s3key_jsonlabel;
  } else {
    const splitKey = imageName.split(".");
    splitKey.splice(splitKey.length - 1, 1);
    const filename = splitKey.join("") + ".json";
    s3key_jsonlabel = annotationCurrentProject.s3_label + "/" + filename;
  }
  const json = exportAnnotationToJson(drawObjectById);
  const { bucketName, key } = getKeyS3(s3key_jsonlabel);

  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: Buffer.from(JSON.stringify(json)),
  };

  const parallelUploads3 = new Upload({
    client: s3,
    queueSize: 1,
    params: uploadParams,
  });
  yield parallelUploads3.done();
  const saveLabelResponse = yield call(annotationProjectApi.saveLabel, {
    idToken: getLocalStorage(ID_TOKEN_NAME) || "",
    fileId: currentAnnotationAndFileInfo.file_info.file_id,
    dictS3Key: {
      [annotationCurrentProject.ls_category.category_id]: s3key_jsonlabel,
    },
  });
  if (saveLabelResponse.error !== true) {
    yield put({ type: SAVE_ANNOTATION_STATE_MANAGER.SUCCEEDED });
    toast.success("Save annotation success");
  } else {
    yield put({ type: SAVE_ANNOTATION_STATE_MANAGER.FAILED });
    toast.error(saveLabelResponse.message);
  }
}
function* annotationEditorSaga() {
  yield takeLatest(CHANGE_PREVIEW_IMAGE, handleChangeImagePreview);
  yield takeLatest(
    SAVE_REMOTE_NEW_CLASS_LABEL.REQUESTED,
    handleAddNewClassLabel
  );
  yield takeLatest(
    SAVE_ANNOTATION_STATE_MANAGER.REQUESTED,
    handleSaveAnnotationStateManager
  );
}

export default annotationEditorSaga;
