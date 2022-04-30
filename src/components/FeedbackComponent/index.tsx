import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetFeedBack, setFeedBack } from "reduxes/feedback/action";
import { selectorContentFeedback } from "reduxes/feedback/selector";
import { FeedbackFormSlack } from "./FeedbackForm";
import FeedbackWidget from "./FeedbackWidget";
import { FeedbackFields } from "./type";

const FeedbackComponent = function () {
  const [openForm, setOpenForm] = useState<boolean>(true);
  const contentFeedback = useSelector(selectorContentFeedback);
  const dispath = useDispatch();
  const handleSendFeedbackSuccess = () => {
    toast.success("You have successfully sent feedback");
    setOpenForm(false);
    dispath(resetFeedBack());
  };
  const handleSendFeedbackFail = () => {
    toast.error("Feedback message failed to send");
  };
  const handleContentChange = (content: FeedbackFields) => {
    dispath(setFeedBack(content));
  };

  return (
    <FeedbackWidget
      isShow={openForm}
      style={{ position: "fixed", bottom: 80, right: 30 }}
    >
      <FeedbackFormSlack
        style={{ width: 400 }}
        feedbackSlackParam={{
          text: contentFeedback.content,
        }}
        onContentChange={handleContentChange}
        onSendSuccess={handleSendFeedbackSuccess}
        onSendFail={handleSendFeedbackFail}
      />
    </FeedbackWidget>
  );
};
export default FeedbackComponent;
