import { Box, Button, TextField, Typography } from "@mui/material";
import { MyButton } from "components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import feedbackApi from "services/feedbackApi";
import {
  FeedbackFields,
  FeedbackFormProps,
  ACTION_FEEDBACK_FORM,
  FeedbackSlackParam,
  ResponseSubmitType,
} from "./type";

export const FeedbackForm = function ({ style, onSubmit }: FeedbackFormProps) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeedbackFields>();
  const onSubmitFeedback = (data: FeedbackFields) => {
    setIsProcessing(true);
    onSubmit(data).then((resp: ResponseSubmitType) => {
      console.log("resp", resp);
      if (resp.action == ACTION_FEEDBACK_FORM.NO_ACTION) {
        setIsProcessing(false);
      } else if (resp.action == ACTION_FEEDBACK_FORM.PROCESSING) {
        setIsProcessing(true);
      }
    });
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
      <Typography variant="h4" component="h2">
        Feedback
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
          defaultValue=""
          margin="normal"
          fullWidth
          autoFocus
          multiline
          rows={9}
          inputProps={{ maxLength: 500 }}
          disabled={isProcessing}
        />

        <Button sx={{ display: "none" }} type="submit" />
      </Box>

      <Box display="flex" justifyContent="flex-end" marginTop={6}>
        <MyButton
          type="button"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmitFeedback)}
          isLoading={isProcessing}
        >
          Send us feedback
        </MyButton>
      </Box>
    </Box>
  );
};
export const FeedbackFormSlack = function ({
  style,
  feedbackSlackParam,
  onSendSuccess,
  onSendFail,
}: {
  style: React.CSSProperties;
  feedbackSlackParam: Omit<FeedbackSlackParam, "text">;
  onSendSuccess?: () => void;
  onSendFail?: () => void;
}) {
  const handleOnSubmit = (
    data: FeedbackFields
  ): Promise<ResponseSubmitType> => {
    return new Promise<ResponseSubmitType>((resolve, reject) => {
      feedbackApi
        .sendFeedbackToSlack({ ...feedbackSlackParam, text: data.content })
        .then((resp: any) => {
          if (resp.status == 200) {
            if (onSendSuccess) onSendSuccess();
          } else {
            if (onSendFail) onSendFail();
          }
          resolve({ action: ACTION_FEEDBACK_FORM.NO_ACTION });
        })
        .catch((e) => {
          if (onSendFail) onSendFail();
          resolve({ action: ACTION_FEEDBACK_FORM.NO_ACTION });
        });
    });
  };
  return <FeedbackForm onSubmit={handleOnSubmit} style={style} />;
};
