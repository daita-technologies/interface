import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

import { ID_TOKEN_NAME } from "constants/defaultValues";
import { useDispatch, useSelector } from "react-redux";
import { deleteProject, setIsOpenDeleteProject } from "reduxes/project/action";
import { selectorDeleteConfirmDialogInfo } from "reduxes/project/selector";
import { getLocalStorage } from "utils/general";

const DeleteConfirmDialog = function () {
  const dispatch = useDispatch();
  const confirmDialogInfo = useSelector(selectorDeleteConfirmDialogInfo);
  if (confirmDialogInfo) {
    const { isOpen, projectId, projectName } = confirmDialogInfo;
    return (
      <Dialog fullWidth maxWidth="sm" open={isOpen}>
        <DialogTitle sx={{ p: 4 }}>Delete Project</DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          <DialogContentText color="text.primary">
            Are you sure you want to delete project:{" "}
            <Typography component="span" fontWeight="bold">
              {projectName}
            </Typography>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 3 }}>
          <Button
            sx={{ color: "text.primary", mr: 4 }}
            onClick={() => dispatch(setIsOpenDeleteProject(null))}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              dispatch(
                deleteProject({
                  idToken: getLocalStorage(ID_TOKEN_NAME) || "",
                  projectId,
                  projectName,
                })
              )
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return null;
};

export default DeleteConfirmDialog;
