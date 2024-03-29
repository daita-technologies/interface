import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import React, { useEffect } from "react";
import { UploadFromMenuProps } from "./type";

const UploadFromMenu = function ({
  inputRef,
  anchorEl,
  isOpen,
  relativeMousePosition = { top: 0, left: 0 },
  onClose,
}: UploadFromMenuProps) {
  const [anchorElClone, setAnchorElClone] =
    React.useState<HTMLElement | null>();
  const open = Boolean(anchorElClone);
  useEffect(() => {
    if (isOpen == true) {
      setAnchorElClone(anchorEl);
    } else {
      setAnchorElClone(null);
    }
  }, [isOpen]);
  const handleClose = () => {
    onClose();
  };

  const removeDirectoryAttribute = () => {
    if (inputRef) {
      inputRef.current?.removeAttribute("webkitdirectory");
      inputRef.current?.removeAttribute("mozdirectory");
      inputRef.current?.removeAttribute("directory");

      window.removeEventListener("focus", removeDirectoryAttribute);
    }
  };

  const onClickUploadFile = () => {
    handleClose();

    removeDirectoryAttribute();

    if (inputRef) {
      setTimeout(() => {
        inputRef.current?.click();
      }, 200);
    }
  };

  const onClickUploadFolder = () => {
    handleClose();
    if (inputRef) {
      inputRef.current?.setAttribute("webkitdirectory", "true");
      inputRef.current?.setAttribute("mozdirectory", "true");
      inputRef.current?.setAttribute("directory", "true");

      // TODO: check on focus to set input back to upload file
      window.addEventListener("focus", removeDirectoryAttribute);

      setTimeout(() => {
        inputRef.current?.click();
      }, 200);
    }
  };
  return (
    <Popover
      anchorEl={anchorElClone}
      open={open}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: -relativeMousePosition.top,
        horizontal: -relativeMousePosition.left,
      }}
      transitionDuration={0}
      onClose={handleClose}
    >
      <ListItemButton onClick={onClickUploadFile}>
        <ListItemIcon sx={{ color: "text.primary" }}>
          <UploadFileIcon />
        </ListItemIcon>
        <ListItemText>Select Files</ListItemText>
      </ListItemButton>
      <ListItemButton onClick={onClickUploadFolder}>
        <ListItemIcon sx={{ color: "text.primary" }}>
          <DriveFolderUploadIcon />
        </ListItemIcon>
        <ListItemText>Select Folder</ListItemText>
      </ListItemButton>
    </Popover>
  );
};

export default UploadFromMenu;
