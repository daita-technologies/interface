import {
  AUGMENT_GENERATE_IMAGES_TYPE_LABEL,
  ID_TOKEN_NAME,
} from "constants/defaultValues";
import { toast } from "react-toastify";
import { call, delay, put, takeEvery } from "redux-saga/effects";
import { GENERATE_IMAGES } from "reduxes/generate/constants";
import { GenerateImagePayload } from "reduxes/generate/type";
import { fetchTaskInfo } from "reduxes/project/action";
import { alertGoToTaskDashboard } from "reduxes/task/action";
import { projectApi } from "services";
import {
  capitalizeFirstLetter,
  getGenerateMethodLabel,
  getLocalStorage,
} from "utils/general";

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
      yield put(
        alertGoToTaskDashboard({
          message: `${label} successfully initiated. Please go to My Tasks for the details.`,
          projectId,
        })
      );
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
