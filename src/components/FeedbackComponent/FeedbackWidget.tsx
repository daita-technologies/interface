import MessageIcon from "@mui/icons-material/Message";
import { Fab } from "@mui/material";
import Popover from "@mui/material/Popover";
import * as React from "react";
import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { FeedbackWidgetParam } from "./type";

const FeedbackWidget = function ({
  style,
  children,
  isShow,
  onClose,
}: FeedbackWidgetParam) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  useEffect(() => {
    setAnchorEl(null);
  }, [isShow]);
  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (open) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setAnchorEl(null);
  };

  return (
    <div style={{ zIndex: 99999, ...style }}>
      <Fab
        id="widget_id"
        color="primary"
        aria-label="feedback"
        aria-describedby={id}
        onClick={handleClick}
      >
        {anchorEl != null ? <CloseIcon /> : <MessageIcon />}
      </Fab>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {children}
      </Popover>
    </div>
  );
};
export default FeedbackWidget;
