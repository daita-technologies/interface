import { LOG_OUT } from "reduxes/auth/constants";
import { DELETE_PROJECT } from "reduxes/project/constants";
import generateS3Client from "utils/s3";
import {
  SET_PAGE_LOADING,
  GENERATE_S3_CLIENT,
  EMPTY_S3_CLIENT,
  SET_IS_CHECKING_APP,
} from "./constants";
import { GeneralReducer, SetIsCheckingAppPayload } from "./type";

const inititalState: GeneralReducer = {
  isShow: false,
  s3: generateS3Client(),
  isCheckingApp: true,
};

const generalReducer = (state = inititalState, action: any): GeneralReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case SET_PAGE_LOADING:
      return { ...state, isShow: payload.isShow };
    case GENERATE_S3_CLIENT:
      return { ...state, s3: generateS3Client() };
    case LOG_OUT.SUCCEEDED:
    case EMPTY_S3_CLIENT:
      return { ...state, s3: null };
    case DELETE_PROJECT.REQUESTED:
      return { ...state, isShow: true };
    case DELETE_PROJECT.SUCCEEDED:
      return { ...state, isShow: false };
    case DELETE_PROJECT.FAILED:
      return { ...state, isShow: false };
    case SET_IS_CHECKING_APP: {
      const { isChecking } = payload as SetIsCheckingAppPayload;
      return { ...state, isCheckingApp: isChecking };
    }

    default:
      return state;
  }
};

export default generalReducer;
