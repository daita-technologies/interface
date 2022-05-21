import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, LinearProgress, Typography } from "@mui/material";
import {
  AUGMENT_SOURCE,
  DOWNLOAD_TASK_PROCESS_TYPE,
  ERROR_TASK_STATUS,
  FINISH_ERROR_TASK_STATUS,
  FINISH_TASK_STATUS,
  GENERATE_REFERENCE_IMAGE_TYPE,
  HEALTHCHECK_TASK_PROCESS_TYPE,
  ID_TOKEN_NAME,
  ORIGINAL_IMAGES_TAB,
  ORIGINAL_SOURCE,
  PREPROCESS_SOURCE,
  RUNNING_TASK_STATUS,
  UPLOADING_TASK_STATUS,
  UPLOAD_TASK_PROCESS_TYPE,
} from "constants/defaultValues";
import useInterval from "hooks/useInterval";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { changeActiveImagesTab, fetchImages } from "reduxes/album/action";
import { selectorActiveImagesTabId } from "reduxes/album/selector";
import { fetchReferenceImageInfo } from "reduxes/customPreprocessing/action";
import { DOWNLOAD_ZIP_EC2 } from "reduxes/download/constants";
import { getProjectHealthCheckInfoAction } from "reduxes/healthCheck/action";
import { fetchTaskInfo } from "reduxes/project/action";
import {
  FETCH_DETAIL_PROJECT,
  FETCH_LIST_PROJECTS,
} from "reduxes/project/constants";
import {
  selectorCurrentProjectId,
  selectorCurrentProjectName,
  selectorCurrentTaskListInfo,
  selectorListProjects,
} from "reduxes/project/selector";
import { TaskStatusType } from "reduxes/project/type";
import {
  HEALTH_CHECK_TASK_PLACEMENT_PAGE_NAME,
  PROJECT_DETAIL_TASK_PLACEMENT_PAGE_NAME,
} from "reduxes/task/constants";

import {
  capitalizeFirstLetter,
  getGenerateMethodLabel,
  getLocalStorage,
  switchTabIdToSource,
} from "utils/general";
import { getTaskStatusMergedValue } from "utils/task";
import {
  TaskListImageSourceItemProps,
  TaskListItemProps,
  TaskListUploadItemProps,
} from "./type";

const returnColorOfTask = (targetStatus: TaskStatusType) => {
  switch (targetStatus) {
    case UPLOADING_TASK_STATUS:
      return "success";
    case FINISH_ERROR_TASK_STATUS:
      return "warning";
    case ERROR_TASK_STATUS:
      return "error";
    default:
      return undefined;
  }
};

const returnColorOfStatusText = (targetStatus: TaskStatusType) => {
  switch (targetStatus) {
    case FINISH_ERROR_TASK_STATUS:
      return "warning.main";
    case ERROR_TASK_STATUS:
      return "error.main";
    default:
      return undefined;
  }
};

const TaskListImageSourceItem = function ({
  taskInfo,
}: TaskListImageSourceItemProps) {
  const dispatch = useDispatch();
  const currentProjectId = useSelector(selectorCurrentProjectId);
  const currentTaskListInfo = useSelector(selectorCurrentTaskListInfo);
  const activeImagesTabId = useSelector(selectorActiveImagesTabId);
  const { status, process_type, number_finished, number_gen_images } = taskInfo;
  const progress = useMemo(() => {
    if (
      typeof number_finished !== "undefined" &&
      typeof number_gen_images !== "undefined" &&
      number_gen_images !== 0
    ) {
      if (number_gen_images !== 0) {
        const progressing = (
          (number_finished * 100) /
          number_gen_images
        ).toFixed(2);
        const parseNumber = Number(progressing);
        if (parseNumber === 0 || parseNumber === 100) {
          return parseNumber.toFixed(0);
        }
        return progressing;
      }
      return "100";
    }
    return "0";
  }, [number_finished, number_gen_images]);

  useEffect(() => {
    let allFinsh = true;
    let isTheSameTab = false;
    const source = switchTabIdToSource(activeImagesTabId);
    Object.entries(currentTaskListInfo).forEach(([, value]) => {
      if (value.process_type === source) {
        isTheSameTab = true;
      }
      if (value.status !== "FINISH") {
        allFinsh = false;
      }
    });
    if (allFinsh && isTheSameTab) {
      dispatch(
        changeActiveImagesTab({
          tabId: activeImagesTabId,
          projectId: currentProjectId,
        })
      );
    }
  }, [currentTaskListInfo]);

  return (
    <Box display="flex" flexDirection="column" my={2}>
      <Typography variant="body2" fontWeight={500}>
        Status:{" "}
        <Typography
          sx={{
            color: returnColorOfStatusText(status),
          }}
          fontWeight={400}
          component="span"
          variant="body2"
        >
          {status === RUNNING_TASK_STATUS
            ? "EXECUTING"
            : status.replace(/_/g, " ")}
        </Typography>
      </Typography>
      {status !== ERROR_TASK_STATUS && status !== FINISH_ERROR_TASK_STATUS && (
        <Box display="flex" alignItems="center">
          <Box sx={{ width: "calc(100% - 35px)" }} mr={1} my={1}>
            <LinearProgress
              variant={
                status === RUNNING_TASK_STATUS ? "determinate" : "indeterminate"
              }
              value={
                status === RUNNING_TASK_STATUS ? Number(progress) : undefined
              }
              color={returnColorOfTask(status)}
            />
          </Box>
          {status === RUNNING_TASK_STATUS && (
            <Box minWidth={35}>
              <Typography variant="body2">{progress}%</Typography>
            </Box>
          )}
        </Box>
      )}

      <Box display="flex" justifyContent="space-between">
        <Typography variant="caption">{process_type}</Typography>
        {status === RUNNING_TASK_STATUS && (
          <Typography variant="caption">
            {number_finished}/{number_gen_images} images
          </Typography>
        )}
      </Box>
      {status === FINISH_ERROR_TASK_STATUS && (
        <Box display="flex" alignItems="center" color="warning.main">
          <WarningAmberIcon sx={{ mr: 1, color: "inherit" }} />
          <Typography variant="caption">
            Some images is NOT executed successfully.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const TaskListUploadItem = function ({ taskInfo }: TaskListUploadItemProps) {
  const { status, process_type } = taskInfo;
  return (
    <Box display="flex" flexDirection="column" my={2}>
      <Typography variant="body2" fontWeight={500}>
        Status:{" "}
        <Typography
          sx={{
            color: returnColorOfStatusText(status),
          }}
          fontWeight={400}
          component="span"
          variant="body2"
        >
          {status === RUNNING_TASK_STATUS
            ? "EXECUTING"
            : status.replace(/_/g, " ")}
        </Typography>
      </Typography>
      {status !== ERROR_TASK_STATUS && status !== FINISH_ERROR_TASK_STATUS && (
        <Box display="flex" alignItems="center">
          <Box sx={{ width: "calc(100% - 35px)" }} mr={1} my={1}>
            <LinearProgress
              variant="indeterminate"
              color={returnColorOfTask(status)}
            />
          </Box>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between">
        <Typography variant="caption">{process_type}</Typography>
      </Box>
      {status === FINISH_ERROR_TASK_STATUS && (
        <Box display="flex" alignItems="center" color="warning.main">
          <WarningAmberIcon sx={{ mr: 1, color: "inherit" }} />
          <Typography variant="caption">
            Some images is NOT executed successfully.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
const TaskListItem = function ({ taskInfo, pageName }: TaskListItemProps) {
  const dispatch = useDispatch();
  const currentProjectName = useSelector(selectorCurrentProjectName);
  const currentProjectId = useSelector(selectorCurrentProjectId);
  const listProject = useSelector(selectorListProjects);
  const { status, task_id, process_type, project_id, presign_url } = taskInfo;
  const savedTaskStatus = useRef<TaskStatusType>();

  const activeImagesTabId = useSelector(selectorActiveImagesTabId);

  const getProjectNameByProjectId = useCallback(
    (targetProjectId: string) => {
      const matchProjectIndex = listProject.findIndex(
        (p) => p.project_id === targetProjectId
      );

      if (matchProjectIndex > -1) {
        return listProject[matchProjectIndex].project_name;
      }

      return "";
    },
    [listProject]
  );

  useEffect(() => {
    if (status === ERROR_TASK_STATUS) {
      toast.error("Unexpected error, please re-run your task again.");
    }
  }, [status]);

  useEffect(() => {
    dispatch(
      fetchTaskInfo({
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        taskId: task_id,
        projectId: currentProjectId,
        processType: process_type,
      })
    );
  }, []);

  const callFetchTaskInfo = () => {
    dispatch(
      fetchTaskInfo({
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        taskId: task_id,
        projectId: currentProjectId,
        processType: process_type,
      })
    );
  };

  useInterval(
    () => {
      if (pageName === HEALTH_CHECK_TASK_PLACEMENT_PAGE_NAME) {
        if (process_type === HEALTHCHECK_TASK_PROCESS_TYPE) {
          callFetchTaskInfo();
        }
      } else {
        callFetchTaskInfo();
      }
    },
    getTaskStatusMergedValue(status) === RUNNING_TASK_STATUS ? 10000 : null
  );

  const actionWhenTaskFinish = () => {
    switch (process_type) {
      case PREPROCESS_SOURCE:
      case AUGMENT_SOURCE:
        toast.success(
          `${capitalizeFirstLetter(
            getGenerateMethodLabel(process_type)
          )} of the data set has been completed successfully.`
        );
        break;
      case UPLOAD_TASK_PROCESS_TYPE:
        if (activeImagesTabId === ORIGINAL_IMAGES_TAB) {
          dispatch(
            fetchImages({
              idToken: getLocalStorage(ID_TOKEN_NAME) || "",
              projectId: currentProjectId,
              nextToken: "",
              typeMethod: switchTabIdToSource(activeImagesTabId),
            })
          );
        }
        toast.success("Images have been uploaded successfully.");
        break;
      case HEALTHCHECK_TASK_PROCESS_TYPE:
        dispatch(
          getProjectHealthCheckInfoAction({
            projectId: project_id,
            dataType: ORIGINAL_SOURCE,
            notShowLoading: true,
          })
        );
        toast.success(
          `Data health check of ${getProjectNameByProjectId(
            project_id
          )} has been completed successfully.`
        );
        break;
      case GENERATE_REFERENCE_IMAGE_TYPE:
        dispatch(
          fetchReferenceImageInfo({
            idToken: getLocalStorage(ID_TOKEN_NAME) || "",
            projectId: currentProjectId,
          })
        );
        toast.success("Reference images have been generated successfully.");
        break;
      case DOWNLOAD_TASK_PROCESS_TYPE:
        if (presign_url) {
          dispatch({ type: DOWNLOAD_ZIP_EC2.SUCCEEDED });

          toast.success(
            <Box>
              <Typography fontSize={14}>
                Your download link is ready, please go to{" "}
                <a
                  className="text-link"
                  href={`/task-list/${getProjectNameByProjectId(project_id)}`}
                >
                  &quot;My Task&quot;
                </a>{" "}
                to get it.
              </Typography>
            </Box>
          );
        }
        break;
      default:
        break;
    }
  };

  const isReFetchProjectInfoWhenTaskFinish = useMemo(
    () =>
      pageName === PROJECT_DETAIL_TASK_PLACEMENT_PAGE_NAME &&
      process_type !== GENERATE_REFERENCE_IMAGE_TYPE,
    [pageName, process_type]
  );
  useEffect(() => {
    if (taskInfo) {
      if (
        savedTaskStatus.current &&
        savedTaskStatus.current !== FINISH_TASK_STATUS &&
        taskInfo.status === FINISH_TASK_STATUS
      ) {
        savedTaskStatus.current = FINISH_TASK_STATUS;

        if (isReFetchProjectInfoWhenTaskFinish) {
          dispatch({
            type: FETCH_DETAIL_PROJECT.REQUESTED,
            payload: {
              idToken: getLocalStorage(ID_TOKEN_NAME),
              projectName: currentProjectName,
              notShowLoading: true,
            },
          });

          dispatch({
            type: FETCH_LIST_PROJECTS.REQUESTED,
            payload: {
              idToken: getLocalStorage(ID_TOKEN_NAME),
              notShowLoading: true,
            },
          });
        }
        actionWhenTaskFinish();
      } else {
        savedTaskStatus.current = taskInfo.status;
      }
    }
  }, [taskInfo, isReFetchProjectInfoWhenTaskFinish]);

  if (
    status === FINISH_TASK_STATUS ||
    status === ERROR_TASK_STATUS
    // || progress === "100"
  ) {
    return null;
  }

  return (
    <Box display="none">
      {process_type === UPLOAD_TASK_PROCESS_TYPE ||
      process_type === GENERATE_REFERENCE_IMAGE_TYPE ? (
        <TaskListUploadItem taskInfo={taskInfo} />
      ) : (
        <TaskListImageSourceItem taskInfo={taskInfo} />
      )}
    </Box>
  );
};

export default TaskListItem;
