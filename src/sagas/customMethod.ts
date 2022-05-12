import {
  GENERATE_REFERENCE_IMAGE_TYPE,
  ID_TOKEN_NAME,
} from "constants/defaultValues";
import { toast } from "react-toastify";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { fetchReferenceImageInfoSuccess } from "reduxes/customPreprocessing/action";
import {
  FETCH_REFERENCE_IMAGE_INFO,
  GENERATE_REFERENCE_IMAGES,
} from "reduxes/customPreprocessing/constants";
import {
  GenerateReferenceImagesProps,
  ReferenceInfoApiFields,
} from "reduxes/customPreprocessing/type";
import { fetchTaskInfo } from "reduxes/project/action";
import { selectorMethodList } from "reduxes/project/selector";
import { ListMethodType } from "reduxes/project/type";
import customMethodApi, {
  ReferenceImagesParams,
} from "services/customMethodApi";
import { getLocalStorage } from "utils/general";

function* handleGenerateReferenceImages(action: {
  type: string;
  payload: GenerateReferenceImagesProps;
}): any {
  const { projectId } = action.payload;
  try {
    const genRefImagesResp = yield call(
      customMethodApi.generateReferenceImages,
      { projectId }
    );
    if (genRefImagesResp.error === false) {
      yield put(
        fetchTaskInfo({
          idToken: getLocalStorage(ID_TOKEN_NAME) || "",
          taskId: genRefImagesResp.data.task_id,
          processType: GENERATE_REFERENCE_IMAGE_TYPE,
          isNotify: true,
          projectId,
        })
      );
      yield put({
        type: GENERATE_REFERENCE_IMAGES.SUCCEEDED,
      });
    } else {
      yield put({
        type: GENERATE_REFERENCE_IMAGES.FAILED,
      });
      toast.error(genRefImagesResp.message);
    }
  } catch (e: any) {
    yield put({
      type: GENERATE_REFERENCE_IMAGES.FAILED,
    });
    toast.error(e.message);
  }
}
function* handleFetchReferenceImageInfo(action: {
  type: string;
  payload: ReferenceImagesParams;
}): any {
  try {
    const referenceImageInfoResp = yield call(
      customMethodApi.getReferenceImageInfo,
      action.payload
    );
    if (referenceImageInfoResp.error === false) {
      const methodList: ListMethodType | null = yield select(
        selectorMethodList
      );
      if (methodList && methodList.preprocessing) {
        referenceImageInfoResp.data = referenceImageInfoResp.data.map(
          (refInfoApiField: ReferenceInfoApiFields) => ({
            ...refInfoApiField,
            method_name: methodList.preprocessing.find(
              (method) => method.method_id === refInfoApiField.method_id
            )?.method_name,
          })
        );
      }
      yield put(fetchReferenceImageInfoSuccess(referenceImageInfoResp.data));
    } else {
      yield put({
        type: FETCH_REFERENCE_IMAGE_INFO.FAILED,
      });
      toast.error(referenceImageInfoResp.message);
    }
  } catch (e: any) {
    yield put({
      type: FETCH_REFERENCE_IMAGE_INFO.FAILED,
    });
    toast.error(e.message);
  }
}
function* customMethod() {
  yield all([
    takeLatest(
      GENERATE_REFERENCE_IMAGES.REQUESTED,
      handleGenerateReferenceImages
    ),
    takeLatest(
      FETCH_REFERENCE_IMAGE_INFO.REQUESTED,
      handleFetchReferenceImageInfo
    ),
  ]);
}

export default customMethod;
