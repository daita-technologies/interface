import { LinearProgress, TableCell, TableRow, Typography } from "@mui/material";
import { CircularProgressWithLabel } from "components";
import {
  AUGMENT_TASK_PROCESS_TYPE,
  ERROR_TASK_STATUS,
  FINISH_TASK_STATUS,
  ID_TOKEN_NAME,
  PREPROCESS_TASK_PROCESS_TYPE,
  RUNNING_TASK_STATUS,
  SYSTEM_DATE_TIME_FORMAT,
} from "constants/defaultValues";
import { TaskStatusMergedType } from "constants/taskType";
import useInterval from "hooks/useInterval";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";
import { fetchTaskInfo } from "reduxes/project/action";
import { selectorSpecificProcessTaskInfo } from "reduxes/task/selector";
import { limitTwoLineStyle } from "styles/generalStyle";
import { getLocalStorage } from "utils/general";
import { getTaskStatusMergedValue } from "utils/task";
import TaskTableAction from "../TaskTableAction";

import { TaskTableRowProps } from "./type";

const getStyledStatus = (taskStatus: TaskStatusMergedType) => {
  switch (taskStatus) {
    case FINISH_TASK_STATUS:
      return "success";
    case ERROR_TASK_STATUS:
      return "error";
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

  const { task_id, project_id, status, created_time, process_type } = taskInfo;

  const dispatch = useDispatch();

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
    status === FINISH_TASK_STATUS ? null : 10000
  );

  const getProjectNameByProjectId = (targetProjectId: string) => {
    const matchProjectIndex = listProject.findIndex(
      (p) => p.project_id === targetProjectId
    );

    if (matchProjectIndex > -1) {
      return listProject[matchProjectIndex].project_name;
    }

    return "";
  };

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
      return "-";
    }

    return isTaskRunning ? <LinearProgress /> : "-";
  };

  if (taskInfo) {
    return (
      <TableRow
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
        <TableCell align="left">
          <Typography sx={limitTwoLineStyle} component="span" variant="body2">
            {getProjectNameByProjectId(project_id)}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography component="span" variant="body2">
            {moment(created_time).format(SYSTEM_DATE_TIME_FORMAT)}
          </Typography>
        </TableCell>

        <TableCell align="center">{renderProcessCell()}</TableCell>
        <TableCell align="center">
          <Typography
            variant="body2"
            color={`${getStyledStatus(getTaskStatusMergedValue(status))}.dark`}
            // color="success.first = (second) => {third}"
          >
            {getTaskStatusMergedValue(status)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <TaskTableAction taskInfo={taskInfo} />
        </TableCell>
      </TableRow>
    );
  }
  return null;
};
export default TaskTableRow;