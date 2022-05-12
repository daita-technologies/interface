import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProjectHealthCheckInfoAction,
  runHealthCheckAction,
} from "reduxes/healthCheck/action";
import { ID_TOKEN_NAME, ORIGINAL_SOURCE } from "constants/defaultValues";
import { Empty, Link, MyButton } from "components";

import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

import { RootState } from "reduxes";
import {
  selectorActiveDataHealthCheck,
  selectorDataHealthCheckCurrentListTask,
  selectorDataHealthCheckCurrentTotalImage,
  selectorDataHealthCheckTaskList,
  selectorIsDataHealthCheckGotTaskRunning,
  selectorIsFetchedAllTaskInfo,
  selectorIsFetchingHealthCheckInfo,
  selectorIsRunningHealthCheck,
} from "reduxes/healthCheck/selector";
import { selectorTaskList } from "reduxes/project/selector";
import { fetchTaskInfo } from "reduxes/project/action";
import { FETCH_DETAIL_PROJECT } from "reduxes/project/constants";
import { TaskInfo } from "reduxes/project/type";
import { HEALTH_CHECK_TASK_PLACEMENT_PAGE_NAME } from "reduxes/task/constants";
import TaskListItem from "routes/ProjectDetail/TaskList/TaskListItem";

import { HEALTH_CHECK_ATTRIBUTES_ARRAY } from "constants/healthCheck";
import { getLocalStorage } from "utils/general";

import HealthCheckChart from "../HealthCheckChart";
import {
  DataHealthCheckSelectedAttribute,
  HealthCheckMainContentProps,
} from "./type";

const HealthCheckMainContent = function ({
  projectId,
}: HealthCheckMainContentProps) {
  const dispatch = useDispatch();
  const { projectName } = useParams<{ projectName: string }>();
  const taskList = useSelector((state: RootState) =>
    selectorTaskList(state, projectId)
  );

  const dataHealthCheckTaskListInfo = useSelector(
    selectorDataHealthCheckTaskList
  );

  const dataHealthCheckMatchProjectIdTaskList = useSelector(
    selectorDataHealthCheckCurrentListTask
  );

  const activeDataHealthCheck = useSelector(selectorActiveDataHealthCheck);

  const isFetchingHealthCheckInfo = useSelector(
    selectorIsFetchingHealthCheckInfo
  );

  const isRunningHealthCheck = useSelector(selectorIsRunningHealthCheck);

  const isFetchedAllTaskInfo = useSelector(selectorIsFetchedAllTaskInfo);

  const isDataHealthCheckGotTaskRunning = useSelector((state: RootState) =>
    selectorIsDataHealthCheckGotTaskRunning(state, projectId)
  );

  const dataHealthCheckCurrentTotalImage = useSelector(
    selectorDataHealthCheckCurrentTotalImage
  );

  const [selectedAttribue, setSelectedAttribue] =
    useState<DataHealthCheckSelectedAttribute>(
      HEALTH_CHECK_ATTRIBUTES_ARRAY[0]
    );

  const onClickRunHealthCheck = () => {
    dispatch(runHealthCheckAction({ projectId, dataType: ORIGINAL_SOURCE }));
  };

  useEffect(() => {
    dispatch({
      type: FETCH_DETAIL_PROJECT.REQUESTED,
      payload: {
        idToken: getLocalStorage(ID_TOKEN_NAME),
        projectName: projectName || "",
      },
    });
    dispatch(
      getProjectHealthCheckInfoAction({ projectId, dataType: ORIGINAL_SOURCE })
    );
  }, [projectId]);

  useEffect(() => {
    if (taskList) {
      taskList.forEach((taskItem) => {
        if (taskItem.project_id === projectId) {
          fetchTaskInfo({
            idToken: getLocalStorage(ID_TOKEN_NAME) || "",
            taskId: taskItem.task_id,
            processType: taskItem.process_type,
          });
        }
      });
    }
  }, [taskList, projectId]);

  const renderTaskList = () => {
    if (dataHealthCheckTaskListInfo) {
      return (
        <Box maxHeight={(60 + 16 * 2) * 3} sx={{ display: "none" }}>
          {dataHealthCheckMatchProjectIdTaskList.map(
            (taskItemInfo: TaskInfo) => (
              <TaskListItem
                key={`data-health-check-task-list-item-${taskItemInfo.task_id}`}
                pageName={HEALTH_CHECK_TASK_PLACEMENT_PAGE_NAME}
                taskInfo={
                  dataHealthCheckTaskListInfo[taskItemInfo.task_id] ||
                  taskItemInfo
                }
              />
            )
          )}
        </Box>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (
      isFetchingHealthCheckInfo === null ||
      isFetchingHealthCheckInfo === true ||
      dataHealthCheckTaskListInfo === null
    ) {
      return (
        <Box py={6} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={40} />
        </Box>
      );
    }

    if (!activeDataHealthCheck || activeDataHealthCheck.length <= 0) {
      if (isDataHealthCheckGotTaskRunning) {
        return (
          <Box
            py={6}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography>
              Your infomation about project&lsquo;s Data Health Check is being
              generated, please come back in a few minutes...
            </Typography>
            <CircularProgress sx={{ mt: 4 }} />
          </Box>
        );
      }

      return (
        <Empty
          description={
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              rowGap={2}
            >
              <Typography>
                {dataHealthCheckCurrentTotalImage <= 0
                  ? `You haven't have any image yet.`
                  : "No information about your data health check yet."}
              </Typography>
              {dataHealthCheckCurrentTotalImage <= 0 && (
                <Typography>
                  <Link to={`/project/${projectName}`}>
                    Upload your image now.
                  </Link>
                </Typography>
              )}
              <MyButton
                variant="contained"
                color="primary"
                disabled={dataHealthCheckCurrentTotalImage <= 0}
                isLoading={isRunningHealthCheck}
                onClick={onClickRunHealthCheck}
              >
                Run Data Health Check
              </MyButton>
            </Box>
          }
        />
      );
    }

    // NOTE: activeDataHealthCheck && activeDataHealthCheck?.length > 0
    return (
      <Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={6}
        >
          <MyButton
            variant="contained"
            color="primary"
            disabled={!isFetchedAllTaskInfo}
            isLoading={isRunningHealthCheck || isDataHealthCheckGotTaskRunning}
            onClick={onClickRunHealthCheck}
          >
            {`${
              isDataHealthCheckGotTaskRunning ? "Re-Running" : "Re-run"
            } Data Health Check`}
          </MyButton>

          <Autocomplete
            sx={{ flexBasis: "40%" }}
            disablePortal
            options={HEALTH_CHECK_ATTRIBUTES_ARRAY}
            isOptionEqualToValue={(option, selected) =>
              option.value === selected.value
            }
            value={selectedAttribue}
            onChange={(_, item) => {
              if (item) {
                setSelectedAttribue(item);
              }
            }}
            renderInput={(params) => (
              <TextField label="Attribute" {...params} />
            )}
          />
        </Box>

        <HealthCheckChart
          data={activeDataHealthCheck}
          selectedAttribue={selectedAttribue}
        />
      </Box>
    );
  };

  return (
    <Box py={2}>
      {dataHealthCheckMatchProjectIdTaskList.length > 0 && renderTaskList()}
      {renderContent()}
    </Box>
  );
};

export default HealthCheckMainContent;
