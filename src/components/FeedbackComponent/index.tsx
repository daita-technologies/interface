import * as React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "reduxes";
import { FeedbackFormSlack } from "./FeedbackForm";
import FeedbackWidget from "./FeedbackWidget";

const FeedbackComponent = function () {
  const [openForm, setOpenForm] = useState<boolean>(true);
  const userInfo = useSelector(
    (state: RootState) => state.authReducer.userInfo
  );

  const handleSendFeedbackSuccess = () => {
    toast.success("Send feedback success");
    setOpenForm(false);
  };
  const handleSendFeedbackFail = () => {
    toast.error("Send feedback fail");
  };

  return (
    <FeedbackWidget
      isShow={openForm}
      style={{ position: "fixed", bottom: 80, right: 30 }}
    >
      <FeedbackFormSlack
        style={{ height: 500, width: 400 }}
        feedbackSlackParam={{ username: userInfo.username }}
        onSendSuccess={handleSendFeedbackSuccess}
        onSendFail={handleSendFeedbackFail}
      />
    </FeedbackWidget>
  );
};
export default FeedbackComponent;
