import { Box, Button, TextField, Typography } from "@mui/material";
import { MyButton } from "components";
import { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import feedbackApi from "services/feedbackApi";
import {
  FeedbackFields,
  FeedbackFormProps,
  ACTION_FEEDBACK_FORM,
  FeedbackSlackParam,
  ResponseSubmitType,
} from "./type";

export const FeedbackForm = function ({
  style,
  feedback = { content: "" },
  note,
  onSubmit,
  onContentChange,
}: FeedbackFormProps) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackFields>();
  const onSubmitFeedback = (data: FeedbackFields) => {
    setIsProcessing(true);
    onSubmit(data).then((resp: ResponseSubmitType) => {
      if (resp.action === ACTION_FEEDBACK_FORM.NO_ACTION) {
        setIsProcessing(false);
      } else if (resp.action === ACTION_FEEDBACK_FORM.PROCESSING) {
        setIsProcessing(true);
      }
    });
  };
  const handleFeedbackContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onContentChange) {
      onContentChange({ content: e.target.value });
    }
  };
  return (
    <Box
      style={{
        padding: 20,
        outline: "none",
        borderRadius: 2,
        ...style,
      }}
    >
      <Typography variant="h6" component="h2">
        YOUR FEEDBACK
      </Typography>
      <Box
        marginTop={1}
        component="form"
        onSubmit={handleSubmit(onSubmitFeedback)}
      >
        <TextField
          required
          {...register("content", {
            required: true,
            maxLength: 75,
          })}
          error={!!errors.content}
          helperText={(errors.content && errors.content.message) || ""}
          defaultValue={feedback.content}
          margin="normal"
          fullWidth
          autoFocus
          multiline
          rows={9}
          inputProps={{ maxLength: 500 }}
          onChange={handleFeedbackContentChange}
          disabled={isProcessing}
        />
        <Typography fontStyle="italic" variant="body2" fontSize={15}>
          {note}
        </Typography>
        <Button sx={{ display: "none" }} type="submit" />
      </Box>

      <Box display="flex" justifyContent="flex-end" marginTop={2}>
        <MyButton
          type="button"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmitFeedback)}
          isLoading={isProcessing}
        >
          Send us your feedback
        </MyButton>
      </Box>
    </Box>
  );
};
export const FeedbackFormSlack = function ({
  style,
  feedbackSlackParam,
  onContentChange,
  onSendSuccess,
  onSendFail,
}: {
  style: React.CSSProperties;
  feedbackSlackParam: Partial<FeedbackSlackParam>;
  onContentChange: (feedbackFields: FeedbackFields) => void;
  onSendSuccess: () => void;
  onSendFail: () => void;
}) {
  const handleOnSubmit = (data: FeedbackFields): Promise<ResponseSubmitType> =>
    new Promise((resolve) => {
      feedbackApi
        .sendFeedbackToSlack({ ...feedbackSlackParam, text: data.content })
        .then((resp: any) => {
          if (resp.status === 200 && resp.data?.error === false) {
            if (onSendSuccess) onSendSuccess();
          } else if (onSendFail) onSendFail();
          resolve({ action: ACTION_FEEDBACK_FORM.NO_ACTION });
        })
        .catch(() => {
          if (onSendFail) onSendFail();
          resolve({ action: ACTION_FEEDBACK_FORM.NO_ACTION });
        });
    });

  return (
    <FeedbackForm
      onSubmit={handleOnSubmit}
      note="* Your highly appreciated input will be sent directly to our Slack channel and please be assured that all your feedback will find its way into our product backlog."
      feedback={{
        content: feedbackSlackParam.text ? feedbackSlackParam.text : "",
      }}
      onContentChange={onContentChange}
      style={style}
    />
  );
};
