import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { MyButton } from "components";
import { ID_TOKEN_NAME } from "constants/defaultValues";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsOpenUpdateProjectInfo,
  updateProjectInfo,
} from "reduxes/project/action";
import { selectorUpdateProjectInfoDialog } from "reduxes/project/selector";
import { UpdateProjectInfo } from "reduxes/project/type";
import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import { getLocalStorage } from "utils/general";

const UpdateProjectInfoDialog = function () {
  const dispatch = useDispatch();
  const updateProjectInfoDialog = useSelector(selectorUpdateProjectInfoDialog);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProjectInfo>();
  if (!updateProjectInfoDialog) {
    return null;
  }
  const { isOpen, projectId, projectName, updateInfo } =
    updateProjectInfoDialog;
  const onSubmitUpdateProjectInfo = (updateInfo: UpdateProjectInfo) => {
    dispatch(
      updateProjectInfo({
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        projectId: projectId as string,
        projectName: projectName as string,
        updateInfo,
      })
    );
  };

  const handleClose = () => {
    dispatch(
      setIsOpenUpdateProjectInfo({
        isOpen: false,
      })
    );
  };

  return (
    <Modal open={isOpen} onClose={handleClose} disableEscapeKeyDown>
      <Box sx={{ ...modalStyle, width: 600 }}>
        <IconButton sx={modalCloseStyle} onClick={handleClose}>
          <CancelIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h2">
          Update Project Info
        </Typography>
        <Box
          marginTop={6}
          component="form"
          onSubmit={handleSubmit(onSubmitUpdateProjectInfo)}
        >
          <TextField
            required
            {...register("projectName", {
              required: true,
              maxLength: 75,
            })}
            error={!!errors.projectName}
            helperText={
              (errors.projectName && errors.projectName.message) || ""
            }
            defaultValue={updateInfo?.projectName}
            margin="normal"
            label="Project name"
            placeholder="Project name"
            fullWidth
            autoFocus
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            required
            {...register("description", {
              required: false,
            })}
            error={!!errors.description}
            helperText={
              (errors.description && errors.description.message) || ""
            }
            defaultValue={updateInfo?.description}
            margin="normal"
            label="Description"
            placeholder="Description"
            fullWidth
            autoFocus
            inputProps={{ maxLength: 75 }}
          />
          <Button sx={{ display: "none" }} type="submit" />
        </Box>

        <Box display="flex" justifyContent="flex-end" marginTop={6}>
          <MyButton
            type="button"
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmitUpdateProjectInfo)}
          >
            Update
          </MyButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateProjectInfoDialog;
