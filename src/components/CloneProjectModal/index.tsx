import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  IconButton,
  Input,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import { CloneProjectToAnnotationFields } from "./type";

import { MyButton } from "components";
import {
  cloneProjectToAnnotation,
  setShowDialogCloneProjectToAnnotation,
} from "reduxes/annotationProject/action";
import {
  selectorDialogCloneProjectToAnnotation,
  selectorIsCloningProjectToAnnotation,
} from "reduxes/annotationProject/selector";
import { useEffect } from "react";

const CloneProjectModal = function () {
  const dispatch = useDispatch();
  const dialogCloneProjectToAnnotation = useSelector(
    selectorDialogCloneProjectToAnnotation
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CloneProjectToAnnotationFields>({
    mode: "onChange",
  });
  useEffect(() => {
    setValue(
      "fromProjectName",
      dialogCloneProjectToAnnotation.projectName
        ? dialogCloneProjectToAnnotation.projectName
        : ""
    );
    if (!dialogCloneProjectToAnnotation.isShow) {
      setValue("annotationProjectName", "");
      setValue("annotationProjectDescription", "");
    }
  }, [dialogCloneProjectToAnnotation]);

  const isLoading = useSelector(selectorIsCloningProjectToAnnotation);
  const onSubmit = (fields: CloneProjectToAnnotationFields) => {
    dispatch(
      cloneProjectToAnnotation({
        fromProjectName: fields.fromProjectName,
        annotationProjectName: fields.annotationProjectName,
        annotationProjectDescription: fields.annotationProjectDescription,
      })
    );
  };
  const handleClose = () => {
    dispatch(
      setShowDialogCloneProjectToAnnotation({
        dialogCloneProjectToAnnotation: { isShow: false },
      })
    );
  };
  return (
    <Modal
      open={dialogCloneProjectToAnnotation.isShow === true}
      onClose={!isLoading ? handleClose : undefined}
      disableEscapeKeyDown
    >
      <Box sx={{ ...modalStyle, width: 700 }}>
        <IconButton
          sx={modalCloseStyle}
          onClick={!isLoading ? handleClose : undefined}
        >
          <CancelIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h2">
          Clone Project To Annotation
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" component="h6">
            {`From '${dialogCloneProjectToAnnotation.projectName}'`}
          </Typography>
          <Input
            {...register("fromProjectName")}
            type="hidden"
            value={dialogCloneProjectToAnnotation.projectName}
          />
          <TextField
            required
            {...register("annotationProjectName", {
              required: true,
              maxLength: {
                value: 75,
                message: `Your project name cannot exceed 75 characters.`,
              },
            })}
            error={!!errors.annotationProjectName}
            helperText={
              (errors.annotationProjectName &&
                errors.annotationProjectName.message) ||
              ""
            }
            margin="normal"
            label="Project name"
            placeholder="Project name"
            fullWidth
            autoFocus
            disabled={isLoading}
          />
          <TextField
            {...register("annotationProjectDescription", {
              required: false,
              maxLength: {
                value: 75,
                message: `Your project description cannot exceed 75 characters.`,
              },
            })}
            error={!!errors.annotationProjectDescription}
            helperText={
              (errors.annotationProjectDescription &&
                errors.annotationProjectDescription.message) ||
              ""
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
              Clone
            </MyButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CloneProjectModal;
