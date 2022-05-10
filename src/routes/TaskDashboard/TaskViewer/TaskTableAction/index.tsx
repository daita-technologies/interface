import { IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { TaskItemApiFields } from "services/taskApi";

function TaskTableAction({ taskInfo }: { taskInfo: TaskItemApiFields }) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleStopActionClick = () => {
    setAnchorEl(null);
    setOpen(false);
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
      </Menu>
    </>
  );
}

export default TaskTableAction;
