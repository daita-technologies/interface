import {
  Box,
  LinearProgress,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { CircularProgressWithLabel, Link } from "components";
import {
  AUGMENT_SOURCE,
  AUGMENT_TASK_PROCESS_TYPE,
  CANCEL_TASK_STATUS,
  DOWNLOAD_TASK_PROCESS_TYPE,
  ERROR_TASK_STATUS,
  FINISH_TASK_STATUS,
  GENERATE_REFERENCE_IMAGE_TYPE,
  HEALTHCHECK_TASK_PROCESS_TYPE,
  ID_TOKEN_NAME,
  PREPROCESS_SOURCE,
  PREPROCESS_TASK_PROCESS_TYPE,
  PROGRESS_POOLING_INTERVAL,
  RUNNING_TASK_STATUS,
  SYSTEM_DATE_TIME_FORMAT,
  UPLOAD_TASK_PROCESS_TYPE,
} from "constants/defaultValues";
import { MY_TASKS_ROUTE_NAME } from "constants/routeName";
import { TaskStatusMergedType } from "constants/taskType";
import useInterval from "hooks/useInterval";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "reduxes";
import { DOWNLOAD_ZIP_EC2 } from "reduxes/download/constants";
import { fetchTaskInfo } from "reduxes/project/action";
import { TaskStatusType } from "reduxes/project/type";
import { selectorSpecificProcessTaskInfo } from "reduxes/task/selector";
import { limitTwoLineStyle } from "styles/generalStyle";
import {
  capitalizeFirstLetter,
  getGenerateMethodLabel,
  getLocalStorage,
  getMomentWithCurrentTimeZone,
} from "utils/general";
import { getTaskStatusMergedValue } from "utils/task";
import TaskTableAction from "../TaskTableAction";
import { TaskTableRowProps } from "./type";

const getStyledStatus = (taskStatus: TaskStatusMergedType) => {
  switch (taskStatus) {
    case FINISH_TASK_STATUS:
      return "success";
    case ERROR_TASK_STATUS:
      return "error";
    case CANCEL_TASK_STATUS:
      return "warning";
    case RUNNING_TASK_STATUS:
    default:
      return "info";
  }
};

const getProcessColor = (value: number): string => {
  if (value <= 10) {
    return "error.dark";
  }
  if (value <= 20) {
    return "error";
  }
  if (value <= 30) {
    return "error.light";
  }
  if (value <= 40) {
    return "warning.dark";
  }
  if (value <= 50) {
    return "warning";
  }
  if (value <= 60) {
    return "warning.light";
  }
  if (value <= 70) {
    return "success.light";
  }
  if (value <= 80) {
    return "success";
  }
  return "success.dark";
};

const getNegativeStatusWord = (status: string) => {
  switch (status) {
    case FINISH_TASK_STATUS:
      return `${FINISH_TASK_STATUS}ED`;
    case CANCEL_TASK_STATUS:
      return `${CANCEL_TASK_STATUS}LED`;
    default:
      return status;
  }
};

const TaskTableRow = function ({
  taskId,
  processType,
  listProject,
}: TaskTableRowProps) {
  const taskInfo = useSelector((state: RootState) =>
    selectorSpecificProcessTaskInfo(processType, taskId, state)
  );

  if (!taskInfo) {
    return null;
  }

  const {
    task_id,
    project_id,
    status,
    created_time,
    process_type,
    presign_url,
  } = taskInfo;

  const savedTaskStatus = useRef<TaskStatusType>();
  const dispatch = useDispatch();

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

  const currentProjectName = useMemo(
    () => getProjectNameByProjectId(project_id),
    [project_id]
  );

  useInterval(
    () => {
      dispatch(
        fetchTaskInfo({
          idToken: getLocalStorage(ID_TOKEN_NAME) || "",
          taskId: task_id,
          projectId: project_id,
          processType: process_type,
        })
      );
    },
    getTaskStatusMergedValue(status) === RUNNING_TASK_STATUS
      ? PROGRESS_POOLING_INTERVAL
      : null
  );

  const actionWhenTaskFinish = () => {
    switch (process_type) {
      case PREPROCESS_SOURCE:
      case AUGMENT_SOURCE:
        toast.success(
          `${capitalizeFirstLetter(
            getGenerateMethodLabel(process_type)
          )} of the dataset has been completed successfully.`
        );
        break;
      case UPLOAD_TASK_PROCESS_TYPE:
        toast.success("Images have been uploaded successfully.");
        break;
      case HEALTHCHECK_TASK_PROCESS_TYPE:
        toast.success(
          `Dataset health check of ${currentProjectName} has been completed successfully.`
        );
        break;
      case GENERATE_REFERENCE_IMAGE_TYPE:
        toast.success("Reference images have been generated successfully.");
        break;
      case DOWNLOAD_TASK_PROCESS_TYPE:
        if (presign_url) {
          dispatch({ type: DOWNLOAD_ZIP_EC2.SUCCEEDED });

          toast.success(
            <Box>
              <Typography fontSize={14}>
                Your download link is ready, you can go to{" "}
                <a
                  className="text-link"
                  href={`/${MY_TASKS_ROUTE_NAME}/${getProjectNameByProjectId(
                    project_id
                  )}`}
                >
                  &quot;My Tasks&quot;
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

  useEffect(() => {
    if (taskInfo) {
      if (
        savedTaskStatus.current &&
        savedTaskStatus.current !== FINISH_TASK_STATUS &&
        taskInfo.status === FINISH_TASK_STATUS
      ) {
        savedTaskStatus.current = FINISH_TASK_STATUS;

        actionWhenTaskFinish();
      } else {
        savedTaskStatus.current = taskInfo.status;
      }
    }
  }, [taskInfo]);

  const renderProcessCell = () => {
    const isTaskRunning =
      getTaskStatusMergedValue(status) === RUNNING_TASK_STATUS;

    const { number_finished, number_gen_images } = taskInfo;

    if (
      process_type === PREPROCESS_TASK_PROCESS_TYPE ||
      process_type === AUGMENT_TASK_PROCESS_TYPE
    ) {
      if (isTaskRunning) {
        if (
          typeof number_finished !== "undefined" &&
          typeof number_gen_images !== "undefined" &&
          number_gen_images !== 0
        ) {
          return (
            <CircularProgressWithLabel
              sx={{
                "& 	.MuiCircularProgress-colorPrimary": {
                  backgroundColor: getProcessColor(
                    (number_finished * 100) / number_gen_images
                  ),
                },
              }}
              value={(number_finished * 100) / number_gen_images}
            />
          );
        }

        return <LinearProgress />;
      }
      return <Box textAlign="center">-</Box>;
    }

    return isTaskRunning ? <LinearProgress /> : <Box textAlign="center">-</Box>;
  };

  if (taskInfo) {
    return (
      <TableRow
        sx={{ height: 73 }}
        hover
        role="checkbox"
        // aria-checked={isItemSelected}
        tabIndex={-1}
      >
        {/* <TableCell align="left">
          <Typography
            sx={limitTwoLineStyle}
            component="span"
            variant="body2"
          >
            {task_id}
          </Typography>
        </TableCell> */}
        <TableCell align="left" width="30%">
          <Link to={`/project/${currentProjectName}`}>
            <Typography sx={limitTwoLineStyle} component="span" variant="body2">
              {getProjectNameByProjectId(project_id)}
            </Typography>
          </Link>
        </TableCell>
        <TableCell align="left" width="30%">
          <Typography component="span" variant="body2">
            {getMomentWithCurrentTimeZone(moment(created_time)).format(
              SYSTEM_DATE_TIME_FORMAT
            )}
          </Typography>
        </TableCell>

        <TableCell align="center" width="14%">
          {renderProcessCell()}
        </TableCell>
        <TableCell align="center" width="14%">
          <Typography
            variant="body2"
            color={`${getStyledStatus(getTaskStatusMergedValue(status))}.dark`}
            // color="success.first = (second) => {third}"
          >
            {getNegativeStatusWord(status.replace(/_/g, " "))}
          </Typography>
        </TableCell>
        <TableCell align="right" width="12%">
          <TaskTableAction taskInfo={taskInfo} />
        </TableCell>
      </TableRow>
    );
  }
  return null;
};
export default TaskTableRow;
