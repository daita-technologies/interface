import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setDialogClassManageModal } from "reduxes/annotationmanager/action";
import { selectorDialogClassManageModal } from "reduxes/annotationmanager/selecetor";
import useClassManageEditor from "./useClassManageEditor";
import useListClassView from "./useListClassView";

const ClassManageModel = function () {
  const dispatch = useDispatch();
  const listClassView = useListClassView();
  const classManageEditor = useClassManageEditor();
  const dialogClassManageModal = useSelector(selectorDialogClassManageModal);
  const handleClose = () => {
    dispatch(setDialogClassManageModal({ isOpen: false }));
  };
  const getClassManageDialogProps = () => {
    if (!!dialogClassManageModal.isOpen) {
      if (dialogClassManageModal.classManageModalType === "VIEW") {
        return listClassView;
      } else if (dialogClassManageModal.classManageModalType === "EDIT") {
        return classManageEditor;
      } else if (dialogClassManageModal.classManageModalType === "CREATE") {
        return classManageEditor;
      }
    }
    return listClassView;
  };
  return (
    <Dialog
      open={dialogClassManageModal.isOpen}
      onClose={handleClose}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {getClassManageDialogProps().title}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ height: 500 }} dividers>
        {getClassManageDialogProps().content}
      </DialogContent>
      <DialogActions>{getClassManageDialogProps().action}</DialogActions>
    </Dialog>
  );
};
export default ClassManageModel;
