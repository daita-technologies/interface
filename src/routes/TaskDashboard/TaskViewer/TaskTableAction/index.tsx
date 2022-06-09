import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  CircularProgress,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  AUGMENT_TASK_PROCESS_TYPE,
  DOWNLOAD_TASK_PROCESS_TYPE,
  PREPROCESS_TASK_PROCESS_TYPE,
  RUNNING_TASK_STATUS,
} from "constants/defaultValues";
import useConfirmDialog from "hooks/useConfirmDialog";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { triggerStopTaskProcess } from "reduxes/task/action";
import downloadApi from "services/downloadApi";
import { TaskItemApiFields } from "services/taskApi";
import { triggerPresignedURLDownload } from "utils/download";
import { getTaskStatusMergedValue } from "utils/task";

function TaskTableActionWithAction({
  taskInfo,
}: {
  taskInfo: TaskItemApiFields;
}) {
  const dispatch = useDispatch();

  const [isGettingDownloadLinkStatus, setIsGettingDownloadLinkStatus] =
    useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { task_id, process_type, presign_url, project_id, status } = taskInfo;
  const [isStopping, setIsStopping] = useState(false);
  const { openConfirmDialog, closeConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    if (
      process_type === PREPROCESS_TASK_PROCESS_TYPE ||
      process_type === AUGMENT_TASK_PROCESS_TYPE
    ) {
      setIsStopping(false);
    }
  }, [status]);

  const handleStopActionClick = () => {
    openConfirmDialog({
      content: (
        <Box lineHeight={1.5}>
          <Typography>
            Your old files in PREPROCESS will be deleted. Are you OK with the
            CANCEL?
          </Typography>
        </Box>
      ),
      negativeText: "Cancel",
      positiveText: "Ok",
      onClickNegative: closeConfirmDialog,
      onClickPositive: () => {
        dispatch(
          triggerStopTaskProcess({
            taskId: task_id,
            projectId: project_id,
          })
        );
        setIsStopping(true);
        setOpen(false);
        closeConfirmDialog();
      },
    });
  };

  const handleClickOnDownloadAction = () => {
    if (presign_url) {
      setIsGettingDownloadLinkStatus(true);
      downloadApi
        .headRequestDownloadLink({ url: presign_url })
        .then((resp) => {
          setIsGettingDownloadLinkStatus(false);
          handleClose();
          if (resp.ok) {
            triggerPresignedURLDownload(presign_url, project_id);
          } else {
            toast.error(
              "Your download link has expired. Please, generate a new one."
            );
          }
        })
        .catch(() => {
          setIsGettingDownloadLinkStatus(false);
          handleClose();
          toast.error("There was an error downloading your data.");
        });
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
              <MenuItem onClick={handleStopActionClick} disabled={isStopping}>
                <ListItemText>Stop</ListItemText>
              </MenuItem>
            )}
          {process_type === DOWNLOAD_TASK_PROCESS_TYPE && (
            <MenuItem
              disabled={!presign_url || isGettingDownloadLinkStatus}
              onClick={handleClickOnDownloadAction}
            >
              <Box display="flex" alignItems="center">
                {isGettingDownloadLinkStatus && (
                  <CircularProgress sx={{ mr: 1 }} size={16} />
                )}
                <ListItemText>Download</ListItemText>
              </Box>
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }

  return <Box mr={2}>-</Box>;
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
