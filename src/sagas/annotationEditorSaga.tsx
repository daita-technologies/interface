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
  selectorCurrentAnnotationFiles,
  selectorLsCategory,
} from "reduxes/annotationProject/selector";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  CssStyle,
  LabelClassProperties,
} from "components/Annotation/Editor/type";
import { importAnnotationDaita } from "components/Annotation/Formart";
import {
  exportAnnotationToJson,
  importFileAndAnnotationFromDaitaAI,
} from "components/Annotation/Formart/daita";
import { AnnotationImportInfo } from "components/Annotation/Formart/daita/type";
import { loadImage } from "components/UploadFile";
import { ID_TOKEN_NAME } from "constants/defaultValues";
import {
  addDrawObjectStateIdByAI,
  resetCurrentStateDrawObject,
} from "reduxes/annotation/action";
import { selectorDrawObjectStateIdByAI } from "reduxes/annotation/selector";
import {
  DrawObject,
  DrawObjectByAIState,
  ResetCurrentStateDrawObjectPayload,
} from "reduxes/annotation/type";
import {
  addImagesToAnnotation,
  addNewClassLabel,
  requestChangePreviewImageFail,
  requestChangePreviewImageSuccess,
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
  AnnotationFilesApi,
  AnnotationProjectInfo,
  CategoryInfoApi,
} from "reduxes/annotationProject/type";
import { selectorS3 } from "reduxes/general/selector";
import annotationProjectApi from "services/annotationProjectApi";
import { getLocalStorage } from "utils/general";
import { convertStrokeColorToFillColor } from "routes/AnnotationPage/LabelAnnotation/ClassLabel";
import { LINE_STYLE } from "components/Annotation/Editor/const";
import {
  hashCode,
  intToRGB,
} from "routes/AnnotationPage/LabelAnnotation/ClassManageModal/useListClassView";
import { addNewListClassInfo } from "reduxes/annotationProject/action";

export function getKeyS3(s3Key: string) {
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
      ResponseCacheControl: "no-cache",
    })
  );
  if (photoContent.Body) {
    const res = new Response(photoContent.Body as any);
    const blob = yield res.blob();
    const labelFile = new File([blob], photoKey);
    return labelFile;
  }
  return null;
}

function updateDrawObject(
  value: DrawObject,
  labelClassPropertiesByLabelClass: Record<string, LabelClassProperties>
): any {
  const drawObjectRet: DrawObject = { ...value };
  const css = drawObjectRet.data.cssStyle;
  const { label } = value.data.label;
  const classLabel = labelClassPropertiesByLabelClass[label];
  if (classLabel) {
    const newCss = classLabel.cssStyle;
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
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
  const lsCategory = annotationCurrentProject.ls_category;
  const fetchDetailProjectResponse = yield call(
    annotationProjectApi.annotationAndFileInfo,
    {
      idToken: getLocalStorage(ID_TOKEN_NAME) || "",
      categoryId: lsCategory.category_id,
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
    const idToLabelStr: Record<string, string> = {};
    lsCategory.ls_class.forEach((t) => {
      idToLabelStr[t.class_id] = t.class_name;
    });
    if (label_info && label_info) {
      const labelFile = yield handleGetAnnotationFile(
        label_info.s3key_jsonlabel
      );
      const annotationTmp = yield importAnnotationDaita(
        labelFile,
        idToLabelStr
      );

      if (annotationTmp) {
        annotation = annotationTmp;
      }
    }
    const labelClassPropertiesByLabelClass = yield select(
      selectorLabelClassPropertiesByLabelClass
    );
    const { drawObjectById } = annotation;
    Object.entries(drawObjectById).forEach(([key, value]) => {
      drawObjectById[key] = updateDrawObject(
        value,
        labelClassPropertiesByLabelClass
      );
    });
    const currentAnnotationFiles: AnnotationFilesApi = yield select(
      selectorCurrentAnnotationFiles
    );
    const annotationFile = currentAnnotationFiles.items.find(
      (t) => t.filename === action.payload.imageName
    );
    if (annotationFile && annotationFile.s3_key_segm) {
      const labelFile = yield handleGetAnnotationFile(
        annotationFile.s3_key_segm
      );
      const annotationDaitaAITmp: AnnotationImportInfo =
        yield importFileAndAnnotationFromDaitaAI(labelFile);
      if (annotationDaitaAITmp) {
        const drawObjectByIdFromDaitaAI = annotationDaitaAITmp.drawObjectById;
        Object.entries(drawObjectByIdFromDaitaAI).forEach(([key, value]) => {
          drawObjectById[key] = updateDrawObject(
            value,
            labelClassPropertiesByLabelClass
          );
        });
        yield put(
          addDrawObjectStateIdByAI({
            drawObjectStateIds: Object.keys(drawObjectByIdFromDaitaAI),
          })
        );
        yield put(
          setAnnotationStateManager({
            imageName: file_info.filename,
            drawObjectById,
          })
        );
      }
    }
    yield put(
      setAnnotationStateManager({
        imageName: file_info.filename,
        drawObjectById,
      })
    );

    yield put(
      resetCurrentStateDrawObject({
        drawObjectById,
      })
    );
    if (image) {
      yield put(addImagesToAnnotation({ annotationImagesProperties: [image] }));
      yield put(requestChangePreviewImageSuccess());
    } else {
      toast.error("Failed to get image data.");
      yield put(requestChangePreviewImageFail());
    }
  } catch (e: any) {
    toast.error(e.message);
  }
}
function* handleChangeImagePreview(action: any): any {
  yield handleFetchAnnotationAndFileInfo(action);
}
function* handleAddNewClassLabel(action: any): any {
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
    toast.success("New class was successfully added.");
  } else {
    toast.error(saveLabelResp.message);
  }
}
function* handleSaveAnnotationStateManager(action: any): any {
  try {
    const { imageName, drawObjectById } =
      action.payload as SaveAnnotationStateManagerProps;
    const currentAnnotationAndFileInfo: AnnotationAndFileInfoApi = yield select(
      selectorCurrentAnnotationAndFileInfo
    );
    const annotationCurrentProject: AnnotationProjectInfo = yield select(
      selectorAnnotationCurrentProject
    );

    const s3 = yield select(selectorS3);
    let s3keyJsonlabel = "";
    if (
      currentAnnotationAndFileInfo.label_info &&
      currentAnnotationAndFileInfo.label_info.length > 0
    ) {
      s3keyJsonlabel =
        currentAnnotationAndFileInfo.label_info[0].s3key_jsonlabel;
    } else {
      const splitKey = imageName.split(".");
      splitKey.splice(splitKey.length - 1, 1);
      const filename = `${splitKey.join("")}.json`;
      s3keyJsonlabel = `${annotationCurrentProject.s3_label}/${filename}`;
    }

    const drawObjectStateIdByAI: Record<string, DrawObjectByAIState> =
      yield select(selectorDrawObjectStateIdByAI);
    const drawObjectByIdExcluceAIDetect: Record<string, DrawObject> = {};
    Object.entries(drawObjectById).forEach(([key, value]) => {
      if (!drawObjectStateIdByAI[key]) {
        if (value.data.label.label) {
          drawObjectByIdExcluceAIDetect[key] = value;
        }
      }
    });
    const localLabels: string[] = [];
    Object.entries(drawObjectByIdExcluceAIDetect).forEach(([, value]) => {
      const lsCategory = annotationCurrentProject?.ls_category;
      if (lsCategory) {
        const classInfoApi = lsCategory.ls_class.find(
          (t) => t.class_name === value.data.label.label
        );
        if (!classInfoApi) {
          localLabels.push(value.data.label.label);
        }
      }
      //     if (annotationCurrentProjectName) {
      //       savedCurrentAnnotationProjectName.current =
      //         annotationCurrentProjectName;
      //     }
      // value.data.label.label
    });
    const saveLabelResp = yield call(
      annotationProjectApi.addListOfClassNameToCategory,
      {
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        categoryId: annotationCurrentProject.ls_category.category_id,
        lsClassName: localLabels,
      }
    );
    const lsCategory: CategoryInfoApi = yield select(selectorLsCategory);
    if (saveLabelResp.error === false) {
      // eslint-disable-next-line no-restricted-syntax
      for (const label of saveLabelResp.data.ls_name_ok) {
        const [name, id] = label;

        const strokeColor = `#${intToRGB(hashCode(name))}`;
        lsCategory.ls_class.push({
          class_id: id,
          class_name: name,
        });
        yield put(
          addNewListClassInfo({
            lsClass: [{ class_id: name, class_name: id }],
          })
        );
        yield put(
          addNewClassLabel({
            labelClassProperties: {
              label: { label: name, attributes: [] },
              cssStyle: {
                fill: convertStrokeColorToFillColor(strokeColor),
              },
            },
          })
        );
      }
    }
    const labelStrToId: Record<string, string> = {};
    lsCategory.ls_class.forEach((t) => {
      labelStrToId[t.class_name] = t.class_id;
    });
    const json = exportAnnotationToJson(
      drawObjectByIdExcluceAIDetect,
      labelStrToId
    );
    const { bucketName, key } = getKeyS3(s3keyJsonlabel);
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
        [annotationCurrentProject.ls_category.category_id]: s3keyJsonlabel,
      },
    });
    if (saveLabelResponse.error !== true) {
      yield put({ type: SAVE_ANNOTATION_STATE_MANAGER.SUCCEEDED });
      toast.success("Annotation data is successfully saved.");
    } else {
      yield put({ type: SAVE_ANNOTATION_STATE_MANAGER.FAILED });
      toast.error(saveLabelResponse.message);
    }
  } catch (e: any) {
    console.log(e);
  }
}
function* annotationEditorSaga() {
  yield takeLatest(CHANGE_PREVIEW_IMAGE.REQUESTED, handleChangeImagePreview);
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
