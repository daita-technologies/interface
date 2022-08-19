import { Box, Typography } from "@mui/material";
import { QUIT_FEEDBACK_ALERT_MESSAGE } from "constants/defaultValues";
import useConfirmDialog from "hooks/useConfirmDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetFeedBack } from "reduxes/feedback/action";
import {
  selectorAttachedFilesFeedback,
  selectorContentFeedback,
} from "reduxes/feedback/selector";
import { FeedbackFormSlack } from "./FeedbackForm";
import FeedbackWidget from "./FeedbackWidget";

const FeedbackComponent = function () {
  const { openConfirmDialog, closeConfirmDialog } = useConfirmDialog();
  const [openForm, setOpenForm] = useState<boolean>(false);
  const content = useSelector(selectorContentFeedback);
  const attachedFiles = useSelector(selectorAttachedFilesFeedback);
  const dispath = useDispatch();
  const handleSendFeedbackSuccess = () => {
    toast.success("You have successfully sent feedback.");
    dispath(resetFeedBack());
    setOpenForm(false);
  };
  const handleSendFeedbackFail = () => {
    toast.error("Feedback message failed to send");
  };

  const handleClose = () => {
    if (content.length !== 0 || attachedFiles[0] !== null) {
      openConfirmDialog({
        content: (
          <Box lineHeight={1.5}>
            <Typography>{QUIT_FEEDBACK_ALERT_MESSAGE}</Typography>
          </Box>
        ),
        negativeText: "Cancel",
        positiveText: "Ok",
        onClickNegative: closeConfirmDialog,
        onClickPositive: () => {
          dispath(resetFeedBack());
          closeConfirmDialog();
          setOpenForm(false);
        },
      });
    } else {
      setOpenForm(false);
    }
  };
  const handleOpen = () => {
    setOpenForm(true);
  };
  return (
    <FeedbackWidget
      isShow={openForm}
      style={{ position: "fixed", bottom: 50, right: 30 }}
      onClose={handleClose}
      onOpen={handleOpen}
    >
      <FeedbackFormSlack
        style={{ width: 400 }}
        onSendSuccess={handleSendFeedbackSuccess}
        onSendFail={handleSendFeedbackFail}
      />
    </FeedbackWidget>
  );
};
export default FeedbackComponent;
