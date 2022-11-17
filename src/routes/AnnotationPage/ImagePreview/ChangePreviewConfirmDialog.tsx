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
import { DrawObject } from "reduxes/annotation/type";
import {
  requestChangePreviewImage,
  saveAnnotationStateManager,
} from "reduxes/annotationmanager/action";
import { selectorIsSavingAnnotation } from "reduxes/annotationmanager/selecetor";
import { QUIT_ANNOTATION_EDITOR_ALERT_MESSAGE } from "../constants";

function ChangePreviewConfirmDialog({
  isOpen,
  drawObjectById,
  onClose,
  imageName,
  nextPreviewImageName,
}: {
  isOpen: boolean;
  imageName: string;
  nextPreviewImageName: string;
  onClose: () => void;
  drawObjectById: Record<string, DrawObject>;
}) {
  const dispatch = useDispatch();
  const [markSavedConfirm, setMarkSavedConfirm] =
    React.useState<boolean>(false);
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
      <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box lineHeight={1.5}>
            <Typography>{QUIT_ANNOTATION_EDITOR_ALERT_MESSAGE}</Typography>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 4, pt: 0 }}>
        <LoadingButton
          onClick={handleSave}
          loading={isSavingAnnotation}
          loadingPosition="end"
          variant="contained"
          color="primary"
          sx={{ mr: 2, backgroundColor: "#888c94c4 !important", width: 100 }}
        >
          Save
        </LoadingButton>
        <Button onClick={handleDontSave} sx={{ mr: 2 }}>
          Don't Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
export default ChangePreviewConfirmDialog;
