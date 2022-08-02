import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { resetFeedBack } from "reduxes/feedback/action";
import { FeedbackFormSlack } from "./FeedbackForm";
import FeedbackWidget from "./FeedbackWidget";

const FeedbackComponent = function () {
  const [openForm, setOpenForm] = useState<boolean>(true);
  const dispath = useDispatch();
  const handleSendFeedbackSuccess = () => {
    toast.success("You have successfully sent feedback.");
    setOpenForm(false);
    dispath(resetFeedBack());
  };
  const handleSendFeedbackFail = () => {
    toast.error("Feedback message failed to send");
  };

  return (
    <FeedbackWidget
      isShow={openForm}
      style={{ position: "fixed", bottom: 50, right: 30 }}
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
