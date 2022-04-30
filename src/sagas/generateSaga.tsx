import { toast } from "react-toastify";
import { delay, call, put, takeEvery } from "redux-saga/effects";

import { projectApi } from "services";

import { GENERATE_IMAGES } from "reduxes/generate/constants";
import { GenerateImagePayload } from "reduxes/generate/type";
import {
  capitalizeFirstLetter,
  getGenerateMethodLabel,
  getLocalStorage,
} from "utils/general";
import {
  AUGMENT_GENERATE_IMAGES_TYPE_LABEL,
  ID_TOKEN_NAME,
} from "constants/defaultValues";
import { fetchTaskInfo } from "reduxes/project/action";

function* handleGenerateImages(action: {
  type: string;
  payload: GenerateImagePayload;
}): any {
  const { generateMethod, projectId } = action.payload;
  try {
    const generateImagesResponse = yield call(
      projectApi.generateImages,
      action.payload
    );

    if (generateImagesResponse.error === false) {
      let label = getGenerateMethodLabel(generateMethod);
      if (label === AUGMENT_GENERATE_IMAGES_TYPE_LABEL) {
        label = `Data ${AUGMENT_GENERATE_IMAGES_TYPE_LABEL}`;
      } else {
        label = capitalizeFirstLetter(label);
      }
      yield toast.success(`${label} successfully initiated.`);

      yield delay(2000);
      yield put(
        fetchTaskInfo({
          idToken: getLocalStorage(ID_TOKEN_NAME) || "",
          taskId: generateImagesResponse.data.task_id,
          isNotify: true,
          processType: generateImagesResponse.data.process_type,
          projectId,
          generateMethod,
        })
      );
    } else {
      yield put({
        type: GENERATE_IMAGES.FAILED,
        payload: {
          generateMethod,
        },
      });
      toast.error(generateImagesResponse.message);
    }
  } catch (e: any) {
    yield put({
      type: GENERATE_IMAGES.FAILED,
      payload: {
        generateMethod,
      },
    });
    toast.error(e.message);
  }
}

function* generateSaga() {
  yield takeEvery(GENERATE_IMAGES.REQUESTED, handleGenerateImages);
}

export default generateSaga;
