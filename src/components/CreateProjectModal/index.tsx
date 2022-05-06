import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Typography,
  Box,
  TextField,
  Input,
  IconButton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { CREATE_PROJECT } from "reduxes/project/constants";
import { CreateProjectFields, CreateProjectModalProps } from "./type";
import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import { useForm } from "react-hook-form";
import { getLocalStorage } from "utils/general";

import { ID_TOKEN_NAME, TOKEN_NAME } from "constants/defaultValues";
import { RootState } from "reduxes";
import { MyButton } from "components";

const CreateProjectModal = function (props: CreateProjectModalProps) {
  const { isOpen, handleClose } = props;
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFields>({
    mode: "onChange",
    defaultValues: {
      accessToken: getLocalStorage(TOKEN_NAME) || "",
      idToken: getLocalStorage(ID_TOKEN_NAME) || "",
    },
  });

  const isLoading = useSelector(
    (state: RootState) => state.projectReducer.isCreatingProject
  );

  const onSubmitCreateProject = (fields: CreateProjectFields) => {
    dispatch({ type: CREATE_PROJECT.REQUESTED, payload: fields });
  };

  return (
    <Modal
      open={isOpen}
      onClose={!isLoading ? handleClose : undefined}
      disableEscapeKeyDown
    >
      <Box sx={{ ...modalStyle, width: 600 }}>
        <IconButton
          sx={modalCloseStyle}
          onClick={!isLoading ? handleClose : undefined}
        >
          <CancelIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h2">
          Create New Project
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmitCreateProject)}>
          <Input {...register("accessToken")} type="hidden" />
          <Input {...register("idToken")} type="hidden" />
          <TextField
            required
            {...register("projectName", {
              required: true,
              maxLength: {
                value: 75,
                message: `Your project name cannot exceed 75 characters.`,
              },
            })}
            error={!!errors.projectName}
            helperText={
              (errors.projectName && errors.projectName.message) || ""
            }
            margin="normal"
            label="Project name"
            placeholder="Project name"
            fullWidth
            autoFocus
            disabled={isLoading}
          />
          <TextField
            {...register("description", {
              required: false,
              maxLength: {
                value: 75,
                message: `Your project description cannot exceed 75 characters.`,
              },
            })}
            error={!!errors.description}
            helperText={
              (errors.description && errors.description.message) || ""
            }
            margin="normal"
            label="Description"
            placeholder="Description"
            fullWidth
            disabled={isLoading}
          />
          <Box display="flex" justifyContent="flex-end" marginTop={6}>
            <MyButton
              type="submit"
              variant="contained"
              color="primary"
              isLoading={isLoading}
            >
              Create
            </MyButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateProjectModal;
