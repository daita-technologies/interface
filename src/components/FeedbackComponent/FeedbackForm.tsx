/* eslint-disable no-async-promise-executor */
/* eslint-disable no-await-in-loop */
import { Box, Button, TextField, Typography } from "@mui/material";
import { BeforeUnload, MyButton } from "components";
import {
  IMAGE_EXTENSIONS,
  MAX_FEEDBACK_MESSAGE_LENGTH,
  MAX_SIZE_FEEDBACK_ATTACHED_FILE,
  UPLOAD_PRESIGN_URL_SUCCESS_CODE,
} from "constants/defaultValues";
import _ from "lodash";
import { ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setFeedBackAttachment,
  setFeedBackContent,
  updateFeedbackProcessingStatus,
} from "reduxes/feedback/action";
import {
  selectorAttachedFilesFeedback,
  selectorContentFeedback,
  selectorFeedbackProcessingStastus,
} from "reduxes/feedback/selector";
import feedbackApi, {
  GetPresignURLResponse,
  PresignURL,
} from "services/feedbackApi";
import { formatBytes } from "utils/general";
import {
  FeedbackFields,
  FeedbackFormAction,
  FeedbackFormProps,
  ResponseSubmitType,
} from "./type";
import UploadZoneWrapper from "./UploadZoneWapper";

export const FeedbackForm = function ({
  style,
  note,
  onSubmit,
}: FeedbackFormProps) {
  const feedbackProccessingStatus = useSelector(
    selectorFeedbackProcessingStastus
  );
  const content = useSelector(selectorContentFeedback);
  const attachedFiles = useSelector(selectorAttachedFilesFeedback);
  const dispatch = useDispatch();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newFiles: (File | null)[] = _.times(
        attachedFiles.length,
        _.constant(null)
      );
      let currentIndexOfacceptedFiles = 0;
      let exceedLimitFileSize = 0;
      for (let i = 0; i < newFiles.length; i += 1) {
        if (
          attachedFiles[i] != null &&
          acceptedFiles.length < newFiles.length
        ) {
          newFiles[i] = attachedFiles[i];
        } else {
          while (currentIndexOfacceptedFiles < acceptedFiles.length) {
            if (
              acceptedFiles[currentIndexOfacceptedFiles].size <
              MAX_SIZE_FEEDBACK_ATTACHED_FILE
            ) {
              newFiles[i] = acceptedFiles[currentIndexOfacceptedFiles];
              currentIndexOfacceptedFiles += 1;
              break;
            } else {
              exceedLimitFileSize += 1;
            }
            currentIndexOfacceptedFiles += 1;
          }
        }
      }
      if (newFiles[newFiles.length] == null && exceedLimitFileSize > 0) {
        toast.warn(
          `Some images have a size that exceeds the limit allowed (${formatBytes(
            MAX_SIZE_FEEDBACK_ATTACHED_FILE
          )})`
        );
      }
      dispatch(setFeedBackAttachment({ attachedFiles: newFiles }));
    }
  };

  const dropZone = useDropzone({
    onDrop,
    accept: IMAGE_EXTENSIONS.join(","),
    disabled: feedbackProccessingStatus.isProcessing,
    noDragEventsBubbling: true,
  });
  const { getRootProps, isDragActive } = dropZone;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackFields>({ mode: "onChange" });

  const onSubmitFeedback = (data: FeedbackFields) => {
    dispatch(updateFeedbackProcessingStatus({ isProcessing: true }));
    const filteredAttachedFiles: File[] = attachedFiles.filter(
      (t) => t !== null
    ) as File[];
    onSubmit({
      ...data,
      attachedFiles: filteredAttachedFiles,
    }).then((resp: ResponseSubmitType) => {
      if (resp.action === FeedbackFormAction.NO_ACTION) {
        dispatch(updateFeedbackProcessingStatus({ isProcessing: false }));
      } else if (resp.action === FeedbackFormAction.PROCESSING) {
        dispatch(updateFeedbackProcessingStatus({ isProcessing: true }));
      }
    });
  };
  const handleFeedbackContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFeedBackContent({ content: e.target.value }));
  };
  return (
    <Box
      style={{
        padding: 20,
        outline: "none",
        borderRadius: 2,
        position: "relative",
        ...style,
      }}
      {...getRootProps()}
    >
      <BeforeUnload
        isActive={content.length !== 0 || attachedFiles[0] !== null}
        message={`Your feedback will be lost.\r\nAre you sure you want to continue?`}
      />
      {isDragActive && (
        <Box
          sx={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(15 23 34 / 90%)",
            position: "absolute",
            zIndex: 9998,
            textAlign: "center",
          }}
        >
          <Box>
            <img
              src="/assets/images/upload-image.svg"
              alt="upload"
              style={{ maxWidth: "40%", marginTop: 150 }}
            />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              Upload to Feedback
            </Typography>
          </Box>
        </Box>
      )}
      <Typography variant="h6" component="h2">
        YOUR FEEDBACK
      </Typography>
      <Box
        marginTop={1}
        component="form"
        onSubmit={handleSubmit(onSubmitFeedback)}
      >
        <Typography variant="caption" fontSize={15} fontWeight="bold">
          Tell us details
        </Typography>
        <TextField
          required
          {...register("content", {
            required: true,
            maxLength: {
              value: MAX_FEEDBACK_MESSAGE_LENGTH,
              message: `Your message must be at the most ${MAX_FEEDBACK_MESSAGE_LENGTH} characters long.`,
            },
          })}
          error={!!errors.content}
          helperText={(errors.content && errors.content.message) || ""}
          defaultValue={content}
          margin="normal"
          fullWidth
          autoFocus
          multiline
          rows={9}
          inputProps={{ maxLength: MAX_FEEDBACK_MESSAGE_LENGTH }}
          onChange={handleFeedbackContentChange}
          disabled={feedbackProccessingStatus.isProcessing}
          sx={{ marginTop: "6px" }}
        />
        <Box mt={1}>
          <Typography variant="caption" fontSize={15} fontWeight="bold">
            Send us screenshot
          </Typography>
          <Typography
            variant="body2"
            fontSize={14}
            color="text.secondary"
            display="inline-block"
          >
            File types supported: JPG, PNG, Max size: 5 MB
          </Typography>
          <Box mt={1}>
            <UploadZoneWrapper
              isProcessing={feedbackProccessingStatus.isProcessing}
              onDrop={onDrop}
            />
          </Box>
        </Box>
        <Typography
          fontStyle="italic"
          sx={{ mt: 1 }}
          variant="body2"
          fontSize={14}
          color="text.secondary"
        >
          {note}
        </Typography>
        <Button sx={{ display: "none" }} type="submit" />
      </Box>

      <Box display="flex" justifyContent="flex-end" marginTop={3}>
        <MyButton
          type="button"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmitFeedback)}
          isLoading={feedbackProccessingStatus.isProcessing}
        >
          Send us your feedback
        </MyButton>
      </Box>
    </Box>
  );
};
export const FeedbackFormSlack = function ({
  style,
  onSendSuccess,
  onSendFail,
}: {
  style: React.CSSProperties;
  onSendSuccess: () => void;
  onSendFail: () => void;
}) {
  const getPresignURLPromise = (file: File) =>
    new Promise<GetPresignURLResponse>(async (resolveUpload, rejectUpload) => {
      try {
        const resp: any = await feedbackApi.getPresignURLUploadFeedbackImage({
          filename: file.name,
        });

        if (!resp.error) {
          const presignURLResp = resp.data.presign_url;
          const presignURL: PresignURL = {
            url: presignURLResp.url,
            fields: presignURLResp.fields,
          };
          const presignURLResponse: GetPresignURLResponse = {
            presign_url: presignURL,
            s3_uri: resp.data.s3_uri,
          };
          const uploadResp = await feedbackApi.uploadFeedbackImage({
            file,
            presignURL: presignURLResponse.presign_url,
          });

          if (uploadResp.status === UPLOAD_PRESIGN_URL_SUCCESS_CODE) {
            resolveUpload(presignURLResponse);
          } else {
            toast.error(`Upload image ${file.name} by presign URL failed.`);
            rejectUpload(
              new Error(`Upload image ${file.name} by presign URL failed.`)
            );
          }
        }
      } catch (e) {
        toast.error(`Upload image ${file.name} failed.`);
        rejectUpload(e);
      }
    });
  const handleOnSubmit = ({
    content,
    attachedFiles,
  }: FeedbackFields): Promise<ResponseSubmitType> =>
    new Promise(async (resolve) => {
      const imageURLs: string[] = [];
      let processSuccess = true;
      if (attachedFiles) {
        const uploadAttachedFilePromises = attachedFiles.map((file) =>
          getPresignURLPromise(file)
        );
        const results = await Promise.all(
          uploadAttachedFilePromises.map((p) => p.catch((e: any) => e))
        );
        const uploadAttachedFiles = results.filter(
          (result) => !(result instanceof Error)
        );

        if (uploadAttachedFiles.length === attachedFiles.length) {
          uploadAttachedFiles.forEach((successAttachedFile) => {
            imageURLs.push(successAttachedFile.s3_uri);
          });
        } else {
          processSuccess = false;
        }
      }
      if (processSuccess) {
        feedbackApi
          .sendFeedbackToSlack({
            text: content,
            imageURLs,
          })
          .then((resp: any) => {
            if (resp.error === false) {
              if (onSendSuccess) onSendSuccess();
            } else if (onSendFail) onSendFail();
            resolve({ action: FeedbackFormAction.NO_ACTION });
          })
          .catch(() => {
            if (onSendFail) onSendFail();
            resolve({ action: FeedbackFormAction.NO_ACTION });
          });
      }
    });

  return (
    <FeedbackForm
      onSubmit={handleOnSubmit}
      note="* Your highly appreciated input will be sent directly to our Slack channel and please be assured that all your feedback will find its way into our product backlog."
      style={style}
    />
  );
};
