import React from "react";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { UploadFromMenuProps } from "./type";

const UploadFromMenu = function ({
  inputRef,
  isDisabledUpload,
}: UploadFromMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    <>
      <Button
        sx={{ mb: 2 }}
        startIcon={<AddCircleIcon />}
        variant="outlined"
        color="inherit"
        onClick={handleClick}
        disabled={isDisabledUpload}
      >
        From ...
      </Button>
      <Menu
        sx={{ mt: 1 }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={onClickUploadFile}>
          <ListItemIcon sx={{ color: "text.primary" }}>
            <UploadFileIcon />
          </ListItemIcon>
          <ListItemText>Files upload</ListItemText>
        </MenuItem>
        <MenuItem onClick={onClickUploadFolder}>
          <ListItemIcon sx={{ color: "text.primary" }}>
            <DriveFolderUploadIcon />
          </ListItemIcon>
          <ListItemText>Folder upload</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UploadFromMenu;
