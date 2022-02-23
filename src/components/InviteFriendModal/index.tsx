import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Typography,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import { useForm } from "react-hook-form";
import { getLocalStorage } from "utils/general";

import { MyButton } from "components";
import { EMAIL_REGEX, TEMP_LOCAL_USERNAME } from "constants/defaultValues";
import {
  fetchInviteEmailTemplate,
  sendInviteFriend,
  setIsOpenInviteFriend,
} from "reduxes/invite/action";
import {
  selectorForgotEmailTemplateContent,
  selectorIsFetchingInviteEmailTemplate,
  selectorIsOpenInviteFriend,
  selectorIsSendingFriendInvitation,
} from "reduxes/invite/selector";
import { InviteFriendModalFields } from "./type";

const InviteFriendModal = function () {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFriendModalFields>();

  const isSendingFriendInvitation = useSelector(
    selectorIsSendingFriendInvitation
  );

  const isOpen = useSelector(selectorIsOpenInviteFriend);

  const isFetchingInviteEmailTemplate = useSelector(
    selectorIsFetchingInviteEmailTemplate
  );

  const forgotEmailTemplateContent = useSelector(
    selectorForgotEmailTemplateContent
  );

  const onSubmitCreateProject = (fields: InviteFriendModalFields) => {
    dispatch(
      sendInviteFriend({
        inviteInfo: {
          username: getLocalStorage(TEMP_LOCAL_USERNAME) || "",
          destinationEmail: fields.friendEmail,
        },
      })
    );
  };

  const handleClose = () => {
    dispatch(setIsOpenInviteFriend({ isOpen: false }));
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    } else {
      dispatch(fetchInviteEmailTemplate());
    }
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={!isSendingFriendInvitation ? handleClose : undefined}
      disableEscapeKeyDown
    >
      <Box sx={{ ...modalStyle, width: 600 }}>
        <IconButton
          sx={modalCloseStyle}
          onClick={!isSendingFriendInvitation ? handleClose : undefined}
        >
          <CancelIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h2">
          Invite a Friend
        </Typography>
        <Box
          marginTop={6}
          component="form"
          onSubmit={handleSubmit(onSubmitCreateProject)}
        >
          <TextField
            required
            {...register("friendEmail", {
              required: true,
              pattern: {
                value: EMAIL_REGEX,
                message: "Email formatting is not correct.",
              },
            })}
            error={!!errors.friendEmail}
            helperText={
              (errors.friendEmail && errors.friendEmail.message) || ""
            }
            margin="normal"
            label="Friend's email"
            placeholder="email@address.com"
            fullWidth
            autoFocus
            disabled={isSendingFriendInvitation}
          />
          <Button sx={{ display: "none" }} type="submit" />
        </Box>
        {isFetchingInviteEmailTemplate ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            my={2}
          >
            <CircularProgress size={20} />
          </Box>
        ) : (
          <Box
            sx={{ overflowY: "auto" }}
            maxHeight={300}
            my={2}
            dangerouslySetInnerHTML={{
              __html: forgotEmailTemplateContent || "",
            }}
          />
        )}
        <Box display="flex" justifyContent="flex-end" marginTop={6}>
          <MyButton
            type="button"
            variant="contained"
            color="primary"
            isLoading={isSendingFriendInvitation}
            onClick={handleSubmit(onSubmitCreateProject)}
          >
            Send invitation
          </MyButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default InviteFriendModal;
