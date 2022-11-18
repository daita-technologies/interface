import CancelIcon from "@mui/icons-material/Cancel";
import {
  Autocomplete,
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
import { selectorListProjects } from "reduxes/project/selector";
import { MAX_PROJECT_DESCRIPTION_CHARACTER_LENGTH } from "constants/defaultValues";
import { CloneProjectToAnnotationFields } from "./type";

const CloneProjectModal = function () {
  const dispatch = useDispatch();
  const dialogCloneProjectToAnnotation = useSelector(
    selectorDialogCloneProjectToAnnotation
  );
  const listProjects = useSelector(selectorListProjects);

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
        <Box mt={4} component="form" onSubmit={handleSubmit(onSubmit)}>
          {dialogCloneProjectToAnnotation.projectName ? (
            <Typography variant="h6" component="h6">
              {`From '${dialogCloneProjectToAnnotation.projectName}'`}
            </Typography>
          ) : (
            <Box mb={1}>
              <Autocomplete
                fullWidth
                value={undefined}
                disabled={isLoading}
                options={listProjects}
                getOptionLabel={(option) => option.project_name}
                onChange={(_, selectedFromProject) => {
                  if (selectedFromProject) {
                    setValue(
                      "fromProjectName",
                      selectedFromProject.project_name
                    );
                  }
                }}
                renderOption={(optionProps, option) => (
                  <li {...optionProps} key={option.project_name}>
                    {option.project_name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    autoFocus={
                      dialogCloneProjectToAnnotation &&
                      !dialogCloneProjectToAnnotation.projectName
                    }
                    label="From project"
                  />
                )}
              />
            </Box>
          )}
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
            autoFocus={
              !!(
                dialogCloneProjectToAnnotation &&
                dialogCloneProjectToAnnotation.projectName
              )
            }
            disabled={isLoading}
          />
          <TextField
            {...register("annotationProjectDescription", {
              required: false,
              maxLength: {
                value: MAX_PROJECT_DESCRIPTION_CHARACTER_LENGTH,
                message: `Your project description cannot exceed ${MAX_PROJECT_DESCRIPTION_CHARACTER_LENGTH} characters.`,
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
