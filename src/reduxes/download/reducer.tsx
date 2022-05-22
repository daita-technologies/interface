import { DOWNLOAD_TASK_PROCESS_TYPE } from "constants/defaultValues";
import { FETCH_DETAIL_PROJECT } from "reduxes/project/constants";
import { DownloadZipEc2Params } from "services/downloadApi";
import { TaskItemApiFields } from "services/taskApi";
import {
  DOWNLOAD_ALL_FILES,
  DOWNLOAD_SELECTED_FILES,
  DOWNLOAD_ZIP_EC2,
  DOWNLOAD_ZIP_EC2_CREATE,
  FETCH_IMAGES_TO_DOWNLOAD,
  LOAD_IMAGE_CONTENT_TO_DOWNLOAD,
  RESET_DOWNLOAD_STATE,
  UPDATE_TOTAL_NEED_DOWNLOAD,
  UPDATE_TOTAL_SELECTED_FILES_NEED_DOWNLOAD,
  ZIP_ALL_FILES,
} from "./constants";
import {
  DownloadAllFilesPayload,
  DownloadReducer,
  DownloadSelectedFilesPayload,
  DownloadZipEc2CreateSucceedPayload,
} from "./type";

const inititalState: DownloadReducer = {
  images: {},
  nextToken: "",

  isDownloading: null,
  isDownloadingZipEc2: false,
  downloadZipEc2TaskId: undefined,
  totalSelectedFilesNeedDownload: null,
  isZippingSelectedFiles: null,

  isDownloadingSelectedFiles: null,
  totalNeedDownload: null,
  isZipping: null,

  currentProjectIdDownloading: null,
};

const downloadReducer = (state = inititalState, action: any) => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case DOWNLOAD_ALL_FILES.REQUESTED: {
      const { projectId } = payload as DownloadAllFilesPayload;
      return {
        ...inititalState,
        isDownloading: true,
        currentProjectIdDownloading: projectId,
      };
    }
    case DOWNLOAD_ZIP_EC2_CREATE.SUCCEEDED: {
      const { taskId } = payload as DownloadZipEc2CreateSucceedPayload;
      return {
        ...state,
        downloadZipEc2TaskId: taskId,
      };
    }
    case DOWNLOAD_ZIP_EC2.SUCCEEDED: {
      return {
        ...state,
        isDownloadingZipEc2: false,
        isDownloading: false,
        downloadZipEc2TaskId: undefined,
        images: {},
        totalNeedDownload: null,
        currentProjectIdDownloading: null,
      };
    }
    case DOWNLOAD_ALL_FILES.SUCCEEDED: {
      return {
        ...state,
        isDownloading: false,
        images: {},
        totalNeedDownload: null,
        currentProjectIdDownloading: null,
      };
    }
    case DOWNLOAD_ZIP_EC2_CREATE.FAILED:
      return {
        ...state,
        isDownloading: false,
        isDownloadingZipEc2: false,
        images: {},
        totalNeedDownload: null,
        currentProjectIdDownloading: null,
      };
    case DOWNLOAD_ALL_FILES.FAILED: {
      return {
        ...state,
        isDownloading: false,
        images: {},
        totalNeedDownload: null,
        currentProjectIdDownloading: null,
        downloadZipEc2TaskId: undefined,
      };
    }

    case ZIP_ALL_FILES.REQUESTED: {
      return {
        ...state,
        isZipping: true,
      };
    }
    case ZIP_ALL_FILES.SUCCEEDED: {
      return {
        ...state,
        isZipping: false,
      };
    }
    case ZIP_ALL_FILES.FAILED: {
      return {
        ...state,
        isZipping: false,
      };
    }

    // case FETCH_IMAGES_TO_DOWNLOAD.REQUESTED: {
    //   return {
    //     ...state,
    //   };
    // }
    case FETCH_IMAGES_TO_DOWNLOAD.SUCCEEDED: {
      // let images;
      // if (payload.previousToken) {
      //   images = { ...state.images, ...payload.images };
      // } else {
      //   images = payload.images;
      // }

      return {
        ...state,
        // images: { ...state.images, ...payload.images },
        nextToken: payload.nextToken,
      };
    }
    // case FETCH_IMAGES_TO_DOWNLOAD.FAILED: {
    //   return {
    //     ...state,
    //     isFetchingImages: false,
    //   };
    // }
    case LOAD_IMAGE_CONTENT_TO_DOWNLOAD.SUCCEEDED: {
      return {
        ...state,
        images: {
          ...state.images,
          [payload.filename]: {
            ...state.images[payload.filename],
            ...payload,
          },
        },
      };
    }

    case UPDATE_TOTAL_NEED_DOWNLOAD:
      return {
        ...state,
        totalNeedDownload: payload.totalNeedDownload,
      };

    case RESET_DOWNLOAD_STATE:
      return inititalState;
    case DOWNLOAD_SELECTED_FILES.REQUESTED: {
      const { selectedList, projectId } =
        payload as DownloadSelectedFilesPayload;
      return {
        ...state,
        totalSelectedFilesNeedDownload: selectedList.length,
        isDownloadingSelectedFiles: true,
        currentProjectIdDownloading: projectId,
      };
    }
    case DOWNLOAD_SELECTED_FILES.FAILED: {
      return {
        ...state,
        totalSelectedFilesNeedDownload: null,
        isDownloadingSelectedFiles: false,
        images: {},
        currentProjectIdDownloading: null,
      };
    }
    case DOWNLOAD_SELECTED_FILES.SUCCEEDED: {
      return {
        ...state,
        totalSelectedFilesNeedDownload: null,
        isDownloadingSelectedFiles: false,
        images: {},
        currentProjectIdDownloading: null,
      };
    }
    case UPDATE_TOTAL_SELECTED_FILES_NEED_DOWNLOAD:
      return {
        ...state,
        totalNeedDownload: payload.totalSelectedFilesNeedDownload,
      };
    case DOWNLOAD_ZIP_EC2_CREATE.REQUESTED: {
      const { projectId } = payload as DownloadZipEc2Params;
      return {
        ...inititalState,
        isDownloading: true,
        isDownloadingZipEc2: true,
        currentProjectIdDownloading: projectId,
      };
    }

    case FETCH_DETAIL_PROJECT.SUCCEEDED: {
      const { project_id, ls_task } = payload.currentProjectInfo;

      const isHaveDownloadingTask = ls_task.some(
        (taskRunning: TaskItemApiFields) =>
          taskRunning.process_type === DOWNLOAD_TASK_PROCESS_TYPE
      );

      return {
        ...state,
        isDownloading: isHaveDownloadingTask,
        isDownloadingZipEc2: isHaveDownloadingTask,
        currentProjectIdDownloading: project_id,
      };
    }
    default:
      return state;
  }
};

export default downloadReducer;
