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
import { deleteAnnotatonProject } from "reduxes/annotationProject/action";
import { selectorDeleteAnnotationProjectConfirmDialogInfo } from "reduxes/annotationProject/selector";
import { setIsOpenDeleteProject } from "reduxes/project/action";
import { getLocalStorage } from "utils/general";

const DeleteAnnotationProjectConfirmDialog = function () {
  const dispatch = useDispatch();
  const confirmDialogInfo = useSelector(
    selectorDeleteAnnotationProjectConfirmDialogInfo
  );

  if (confirmDialogInfo) {
    const { isOpen, projectId, projectName } = confirmDialogInfo;
    const handleClickDeleteProject = () =>
      dispatch(
        deleteAnnotatonProject({
          idToken: getLocalStorage(ID_TOKEN_NAME) || "",
          projectId,
          projectName,
        })
      );
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
            onClick={handleClickDeleteProject}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return null;
};

export default DeleteAnnotationProjectConfirmDialog;
