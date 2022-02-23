// @ts-nocheck
import { useEffect, useMemo, useRef } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import useInterval from "hooks/useInterval";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskInfo } from "reduxes/project/action";
import {
  capitalizeFirstLetter,
  getGenerateMethodLabel,
  getLocalStorage,
} from "utils/general";
import {
  ERROR_TASK_STATUS,
  FINISH_ERROR_TASK_STATUS,
  FINISH_TASK_STATUS,
  ID_TOKEN_NAME,
  RUNNING_TASK_STATUS,
  UPLOADING_TASK_STATUS,
} from "constants/defaultValues";
import {
  FETCH_DETAIL_PROJECT,
  FETCH_LIST_PROJECTS,
} from "reduxes/project/constants";
import {
  selectorCurrentProjectId,
  selectorCurrentProjectName,
} from "reduxes/project/selector";
import { TaskStatusType } from "reduxes/project/type";
import { toast } from "react-toastify";
import { TaskListItemProps } from "./type";

const TaskListItem = function ({ taskInfo }: TaskListItemProps) {
  const dispatch = useDispatch();
  const currentProjectName = useSelector(selectorCurrentProjectName);
  const currentProjectId = useSelector(selectorCurrentProjectId);
  const { task_id, number_finished, number_gen_images, process_type, status } =
    taskInfo;
  const savedTaskStatus = useRef(status);

  const progress = useMemo(() => {
    if (number_gen_images !== 0) {
      const progressing = ((number_finished * 100) / number_gen_images).toFixed(
        2
      );
      const parseNumber = Number(progressing);
      if (parseNumber === 0 || parseNumber === 100) {
        return parseNumber.toFixed(0);
      }
      return progressing;
    }
    return "100";
  }, [number_finished, number_gen_images]);

  useEffect(() => {
    if (status === ERROR_TASK_STATUS) {
      toast.error("Unexpected error, please re-run your task again.");
    }
  }, [status]);

  useEffect(() => {
    if (taskInfo) {
      if (
        savedTaskStatus.current !== FINISH_TASK_STATUS &&
        taskInfo.status === FINISH_TASK_STATUS
      ) {
        savedTaskStatus.current = FINISH_TASK_STATUS;
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
        toast.success(
          `${capitalizeFirstLetter(
            getGenerateMethodLabel(process_type)
          )} of the data set has been completed successfully.`
        );
      } else {
        savedTaskStatus.current = taskInfo.status;
      }
    }
  }, [taskInfo]);

  useInterval(
    () => {
      dispatch(
        fetchTaskInfo({
          idToken: getLocalStorage(ID_TOKEN_NAME) || "",
          taskId: task_id,
          projectId: currentProjectId,
        })
      );
    },
    status === FINISH_TASK_STATUS ? null : 10000
  );

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

  if (
    status === FINISH_TASK_STATUS ||
    status === ERROR_TASK_STATUS
    // || progress === "100"
  ) {
    return null;
  }

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
          {status === RUNNING_TASK_STATUS ? "EXECUTING" : status}
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

export default TaskListItem;
