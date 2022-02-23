import { Box, CircularProgress } from "@mui/material";
import { ID_TOKEN_NAME } from "constants/defaultValues";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectTaskList } from "reduxes/project/action";
import {
  selectorCurrentProjectId,
  selectorCurrentTaskList,
  selectorCurrentTaskListInfo,
  selectorIsFetchingProjectTaskList,
} from "reduxes/project/selector";
import { getLocalStorage } from "utils/general";
import TaskListItem from "./TaskListItem";
import { TaskListProps } from "./type";

const TaskList = function (props: TaskListProps) {
  const currentProjectId = useSelector(selectorCurrentProjectId);
  const currentTaskList = useSelector(selectorCurrentTaskList);
  const currentTaskListInfo = useSelector(selectorCurrentTaskListInfo);
  const isFetchingProjectTaskList = useSelector(
    selectorIsFetchingProjectTaskList
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentTaskList.length > 0) {
      dispatch(
        fetchProjectTaskList({
          idToken: getLocalStorage(ID_TOKEN_NAME) || "",
          projectId: currentProjectId,
        })
      );
    }
  }, [currentTaskList]);

  if (currentTaskList.length > 0) {
    if (isFetchingProjectTaskList === null || isFetchingProjectTaskList) {
      return (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={24} />
        </Box>
      );
    }
    return (
      <Box
        maxHeight={(60 + 16 * 2) * 3}
        sx={{ overflowY: "auto", overflowX: "hidden" }}
      >
        {Object.keys(currentTaskListInfo).map((taskId: string) => (
          <TaskListItem
            key={`task-list-item-${taskId}`}
            taskInfo={currentTaskListInfo[taskId]}
          />
        ))}
      </Box>
    );
  }

  return null;
};

export default TaskList;
