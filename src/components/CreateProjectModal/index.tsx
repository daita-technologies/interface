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
  const { register, handleSubmit } = useForm<CreateProjectFields>({
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
        <Typography mt={6} fontStyle="italic" variant="body2">
          Please note that the project name cannot be changed later.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmitCreateProject)}>
          <Input {...register("accessToken")} type="hidden" />
          <Input {...register("idToken")} type="hidden" />
          <TextField
            required
            {...register("projectName", {
              required: true,
            })}
            margin="normal"
            label="Project name"
            placeholder="Project name..."
            fullWidth
            autoFocus
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
