import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetCurrentStateDrawObject } from "reduxes/annotation/action";
import { selectorDrawObjectById } from "reduxes/annotation/selector";
import {
  requestChangePreviewImage,
  saveAnnotationStateManager,
} from "reduxes/annotationmanager/action";
import { selectorIsSavingAnnotation } from "reduxes/annotationmanager/selecetor";
import { QUIT_ANNOTATION_EDITOR_ALERT_MESSAGE } from "../constants";
import SaveIcon from "@mui/icons-material/Save";

function ChangePreviewConfirmDialog({
  isOpen,
  onClose,
  imageName,
  nextPreviewImageName,
}: {
  isOpen: boolean;
  imageName: string;
  nextPreviewImageName: string;
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const [markSavedConfirm, setMarkSavedConfirm] =
    React.useState<boolean>(false);
  const drawObjectById = useSelector(selectorDrawObjectById);

  const isSavingAnnotation = useSelector(selectorIsSavingAnnotation);
  React.useEffect(() => {
    if (isSavingAnnotation === false && markSavedConfirm === true) {
      dispatch(
        resetCurrentStateDrawObject({
          drawObjectById,
        })
      );
      dispatch(requestChangePreviewImage({ imageName: nextPreviewImageName }));
      setMarkSavedConfirm(false);
      onClose();
    }
  }, [isSavingAnnotation]);

  const handleSave = () => {
    dispatch(
      saveAnnotationStateManager({
        imageName,
        drawObjectById,
      })
    );
    setMarkSavedConfirm(true);
  };
  const handleDontSave = () => {
    dispatch(
      resetCurrentStateDrawObject({
        drawObjectById,
      })
    );
    dispatch(requestChangePreviewImage({ imageName: nextPreviewImageName }));
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">NOTIFICATION</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {QUIT_ANNOTATION_EDITOR_ALERT_MESSAGE}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 4, pt: 0 }}>
        <LoadingButton
          onClick={handleSave}
          loading={isSavingAnnotation}
          loadingPosition="end"
          variant="contained"
          color="primary"
          endIcon={<SaveIcon />}
          sx={{ mr: 2, width: 100 }}
        >
          Save
        </LoadingButton>
        <Button onClick={handleDontSave} sx={{ mr: 2 }}>
          <Typography color="text.primary" fontSize={14} fontWeight="medium">
            Don't Save
          </Typography>
        </Button>
        <Button onClick={onClose}>
          <Typography color="text.primary" fontSize={14} fontWeight="medium">
            Cancel
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ChangePreviewConfirmDialog;
