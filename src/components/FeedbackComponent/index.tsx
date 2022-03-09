import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "reduxes";
import { resetFeedBack, setFeedBack } from "reduxes/feedback/action";
import { initFeedback } from "reduxes/feedback/reducer";
import { selectorContentFeedback } from "reduxes/feedback/selector";
import { FeedbackFormSlack } from "./FeedbackForm";
import FeedbackWidget from "./FeedbackWidget";
import { FeedbackFields } from "./type";

const FeedbackComponent = function () {
  const [openForm, setOpenForm] = useState<boolean>(true);
  const contentFeedback = useSelector(selectorContentFeedback);
  const dispath = useDispatch();
  const userInfo = useSelector(
    (state: RootState) => state.authReducer.userInfo
  );
  const handleSendFeedbackSuccess = () => {
    toast.success("You have successfully sent feedback");
    setOpenForm(false);
    dispath(resetFeedBack());
  };
  const handleSendFeedbackFail = () => {
    toast.error("Feedback messages fail to send");
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
        style={{ height: 500, width: 400 }}
        feedbackSlackParam={{
          username: userInfo.username,
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
