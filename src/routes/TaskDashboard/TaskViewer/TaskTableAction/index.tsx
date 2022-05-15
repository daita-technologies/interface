import { IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { TaskItemApiFields } from "services/taskApi";
import { DOWNLOAD_TASK_PROCESS_TYPE } from "constants/defaultValues";
import { triggerPresignedURLDownload } from "utils/download";

function TaskTableAction({ taskInfo }: { taskInfo: TaskItemApiFields }) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { process_type, presign_url, project_id } = taskInfo;

  const handleStopActionClick = () => {
    setAnchorEl(null);
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
        <MenuItem disabled onClick={handleStopActionClick}>
          <ListItemText>Stop</ListItemText>
        </MenuItem>
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

export default TaskTableAction;
