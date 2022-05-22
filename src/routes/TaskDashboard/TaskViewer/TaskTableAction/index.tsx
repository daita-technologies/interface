import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import {
  AUGMENT_TASK_PROCESS_TYPE,
  DOWNLOAD_TASK_PROCESS_TYPE,
  PREPROCESS_TASK_PROCESS_TYPE,
  RUNNING_TASK_STATUS,
} from "constants/defaultValues";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { triggerStopTaskProcess } from "reduxes/task/action";
import { TaskItemApiFields } from "services/taskApi";
import { triggerPresignedURLDownload } from "utils/download";
import { getTaskStatusMergedValue } from "utils/task";

function TaskTableActionWithAction({
  taskInfo,
}: {
  taskInfo: TaskItemApiFields;
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { task_id, process_type, presign_url, project_id, status } = taskInfo;

  const handleStopActionClick = () => {
    dispatch(
      triggerStopTaskProcess({
        taskId: task_id,
        projectId: project_id,
      })
    );
    setOpen(false);
  };

  const handleClickOnDownloadAction = () => {
    if (presign_url) {
      triggerPresignedURLDownload(presign_url, project_id);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const menuItemCount = useMemo(() => {
    let count = 0;

    if (getTaskStatusMergedValue(status) === RUNNING_TASK_STATUS) {
      count += 1;
    }

    if (process_type === DOWNLOAD_TASK_PROCESS_TYPE) {
      count += 1;
    }

    return count;
  }, [status, process_type]);

  if (menuItemCount > 0) {
    return (
      <>
        <IconButton className="dot-option-symbol" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {getTaskStatusMergedValue(status) === RUNNING_TASK_STATUS &&
            (process_type === PREPROCESS_TASK_PROCESS_TYPE ||
              process_type === AUGMENT_TASK_PROCESS_TYPE) && (
              <MenuItem onClick={handleStopActionClick}>
                <ListItemText>Stop</ListItemText>
              </MenuItem>
            )}
          {process_type === DOWNLOAD_TASK_PROCESS_TYPE && (
            <MenuItem
              disabled={!presign_url}
              onClick={handleClickOnDownloadAction}
            >
              <ListItemText>Download</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }

  return null;
}
function TaskTableAction({ taskInfo }: { taskInfo: TaskItemApiFields }) {
  const { process_type } = taskInfo;
  if (
    process_type === PREPROCESS_TASK_PROCESS_TYPE ||
    process_type === AUGMENT_TASK_PROCESS_TYPE ||
    process_type === DOWNLOAD_TASK_PROCESS_TYPE
  ) {
    return <TaskTableActionWithAction taskInfo={taskInfo} />;
  }
  return <Box mr={2}>-</Box>;
}

export default TaskTableAction;
