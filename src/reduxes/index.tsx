import { combineReducers } from "redux";
import authReducer from "reduxes/auth/reducer";

import sideBarReducer from "reduxes/sideBar/reducer";
import generalReducer from "reduxes/general/reducer";
import projectReducer from "reduxes/project/reducer";
import uploadReducer from "reduxes/upload/reducer";
import albumReducer from "reduxes/album/reducer";
import downloadReducer from "reduxes/download/reducer";
import generateReducer from "reduxes/generate/reducer";
import inviteReducer from "reduxes/invite/reducer";
import feedbackReducer from "./feedback/reducer";
import healthCheckReducer from "./healthCheck/reducer";
import customPreprocessing from "./customPreprocessing/reducer";
import taskReducer from "./task/reducer";
import customAugmentation from "./customAugmentation/reducer";
import annotationReducer from "./annotation/reducer";
import annotationManagerReducer from "./annotationmanager/reducer";
import annotationProjectReducer from "./annotationProject/reducer";
import uploadAnnotationImageReducer from "reduxes/uploadAnnotationImage/reducer";

const rootReducer = combineReducers({
  authReducer,
  sideBarReducer,
  generalReducer,
  projectReducer,
  uploadReducer,
  albumReducer,
  downloadReducer,
  generateReducer,
  inviteReducer,
  feedbackReducer,
  healthCheckReducer,
  customPreprocessing,
  taskReducer,
  customAugmentation,
  annotationReducer,
  annotationManagerReducer,
  annotationProjectReducer,
  uploadAnnotationImageReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
