import {
  GENERATE_REFERENCE_IMAGE_TYPE,
  ID_TOKEN_NAME,
} from "constants/defaultValues";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { getAugmentCustomMethodPreviewImageInfoSucceeded } from "reduxes/customAugmentation/action";
import { GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO } from "reduxes/customAugmentation/constants";
import { GetAugmentCustomMethodPreviewImageInfoRequestActionPayload } from "reduxes/customAugmentation/type";
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
import { alertGoToTaskDashboard } from "reduxes/task/action";
import customMethodApi, {
  ReferenceImagesParams,
} from "services/customMethodApi";
import { getLocalStorage } from "utils/general";

function* handleGenerateReferenceImages(action: {
  type: string;
  payload: GenerateReferenceImagesProps;
}): any {
  const { projectId, selectedMethodIds, projectName } = action.payload;
  try {
    const genRefImagesResp = yield call(
      customMethodApi.generateReferenceImages,
      { projectId, selectedMethodIds, projectName }
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

      yield put(
        alertGoToTaskDashboard({
          message: (
            <Box>
              <Typography fontSize={14}>
                Reference image generation successfully initiated. Please go to{" "}
                <a className="text-link" href={`/my-task/${projectName}`}>
                  &quot;My Tasks&quot;
                </a>{" "}
                for the details
              </Typography>
            </Box>
          ),
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

function* handleGetAugmentCustomMethodPreviewImageInfo(action: {
  type: string;
  payload: GetAugmentCustomMethodPreviewImageInfoRequestActionPayload;
}): any {
  try {
    const getAugmentCustomMethodPreviewImageInfoResponse = yield call(
      customMethodApi.getAugmentCustomMethodPreviewImage,
      action.payload
    );
    if (getAugmentCustomMethodPreviewImageInfoResponse.error === false) {
      yield put(
        getAugmentCustomMethodPreviewImageInfoSucceeded(
          getAugmentCustomMethodPreviewImageInfoResponse.data
        )
      );
    } else {
      yield put({
        type: GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO.FAILED,
      });
      toast.error(getAugmentCustomMethodPreviewImageInfoResponse.message);
    }
  } catch (e: any) {
    yield put({
      type: GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO.FAILED,
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
    takeLatest(
      GET_AUGMENT_CUSTOM_METHOD_PREVIEW_IMAGE_INFO.REQUESTED,
      handleGetAugmentCustomMethodPreviewImageInfo
    ),
  ]);
}

export default customMethod;
