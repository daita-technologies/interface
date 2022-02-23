import {
  SET_SPLIT_DATA_NUMBER,
  UPDATE_STATISTIC_PROJECT,
  FETCH_METHOD_LIST,
  CHANGE_SELECTED_DATA_SOURCE,
  FETCH_PROJECT_TASK_LIST,
  FETCH_TASK_INFO,
  CREATE_SAMPLE_PROJECT,
  DELETE_PROJECT,
  SET_IS_OPEN_DELETE_CONFIRM,
  SET_IS_EDITING_SPLIT_DATA,
  LOAD_PROJECT_THUMBNAIL_IMAGE,
} from "./constants";
import {
  ChangeSelectedDatSourcePayload,
  CreateSamplePayload,
  DeleteProjectPayload,
  FetchProjectTaskListPayload,
  FetchTaskInfoPayload,
  LoadProjectThumbnailImagePayload,
  SetIsEditingSplitDataPayload,
  SetIsOpenDeleteConfirmPayload,
  SetSplitDataNumberPayload,
  UpdateProjectStatisticPayload,
} from "./type";

export const updateCurrentProjectStatistic = (
  payload: UpdateProjectStatisticPayload
) => ({
  type: UPDATE_STATISTIC_PROJECT,
  payload,
});

export const changeSelectedDataSource = (
  payload: ChangeSelectedDatSourcePayload
) => ({
  type: CHANGE_SELECTED_DATA_SOURCE,
  payload,
});

export const setSplitDataNumber = (payload: SetSplitDataNumberPayload) => ({
  type: SET_SPLIT_DATA_NUMBER,
  payload,
});

export const fetchMethodList = (payload: { idToken: string }) => ({
  type: FETCH_METHOD_LIST.REQUESTED,
  payload,
});

export const fetchProjectTaskList = (payload: FetchProjectTaskListPayload) => ({
  type: FETCH_PROJECT_TASK_LIST.REQUESTED,
  payload,
});

export const fetchTaskInfo = (payload: FetchTaskInfoPayload) => ({
  type: FETCH_TASK_INFO.REQUESTED,
  payload,
});

export const setIsOpenDeleteProject = (
  payload: null | SetIsOpenDeleteConfirmPayload
) => ({
  type: SET_IS_OPEN_DELETE_CONFIRM,
  payload,
});

export const deleteProject = (payload: DeleteProjectPayload) => ({
  type: DELETE_PROJECT.REQUESTED,
  payload,
});

export const createSampleProject = (payload: CreateSamplePayload) => ({
  type: CREATE_SAMPLE_PROJECT.REQUESTED,
  payload,
});

export const setIsEditingSplitData = (
  payload: SetIsEditingSplitDataPayload
) => ({
  type: SET_IS_EDITING_SPLIT_DATA,
  payload,
});

export const loadProjectThumbnailImage = (
  payload: LoadProjectThumbnailImagePayload
) => ({
  type: LOAD_PROJECT_THUMBNAIL_IMAGE.REQUESTED,
  payload,
});
