import CancelIcon from "@mui/icons-material/Cancel";
import {
  Autocomplete,
  Box,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
  FormControl,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_PROJECT } from "reduxes/project/constants";
import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import { getLocalStorage } from "utils/general";

import {
  CREATE_PROJECT_DATASET_TYPE_LIST,
  EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE,
  EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE,
  ID_TOKEN_NAME,
  MAX_DATASET_IMAGES_CREATE_PROJECT,
  MAX_PROJECT_DESCRIPTION_CHARACTER_LENGTH,
  MIN_DATASET_IMAGES_CREATE_PROJECT,
  TOKEN_NAME,
  // MAX_ALLOW_UPLOAD_IMAGES,
} from "constants/defaultValues";
import { RootState } from "reduxes";
import { MyButton } from "components";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { projectApi } from "services";

import { CreateProjectDatasetValueType } from "constants/type";

import {
  CreateProjectFields,
  CreateProjectModalProps,
  PrebuildDataset,
  CreateProjectDatasetTypeControlProps,
} from "./type";

const CREATE_PROJECT_DATASET_TYPE_CONTROL =
  "create-project-dataset-type-control";

const CreateProjectDatasetTypeControl = function (
  props: CreateProjectDatasetTypeControlProps
) {
  const {
    value,
    label,
    description,
    datasetProjectType,
    setDatasetProjectType,
    numberOfDatasetImages,
    setNumberOfDatasetImages,
    prebuildDataset,
    setPrebuildDataset,
    listPrebuildDataset,
    isLoadingPrebuildDataset,
    isCreatingProject,
  } = props;

  const onChangeNumberOfDatasetImagesSlider = (
    _event: Event,
    newNumberOfDatasetImagesSliderInput: number | number[]
  ) => {
    if (typeof newNumberOfDatasetImagesSliderInput !== "object") {
      setNumberOfDatasetImages(newNumberOfDatasetImagesSliderInput);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfDatasetImages(
      event.target.value === ""
        ? MIN_DATASET_IMAGES_CREATE_PROJECT
        : Number(event.target.value)
    );
  };

  const handleBlur = () => {
    if (numberOfDatasetImages) {
      if (numberOfDatasetImages < 0) {
        setNumberOfDatasetImages(MIN_DATASET_IMAGES_CREATE_PROJECT);
      } else if (numberOfDatasetImages > MAX_DATASET_IMAGES_CREATE_PROJECT) {
        setNumberOfDatasetImages(MAX_DATASET_IMAGES_CREATE_PROJECT);
      }
    }
  };

  return (
    <Box>
      <FormControlLabel
        value={value}
        control={<Radio disabled={isCreatingProject} />}
        label={label}
        onClick={() => setDatasetProjectType(value)}
      />
      <Typography variant="body2" color="text.secondary" fontStyle="italic">
        {description}
      </Typography>
      {value === EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE &&
        datasetProjectType === value && (
          <Box mt={2}>
            <Box>
              <Autocomplete
                id="prebuild-dataset"
                value={prebuildDataset}
                disablePortal
                loading={isLoadingPrebuildDataset}
                disabled={isCreatingProject}
                options={listPrebuildDataset}
                getOptionLabel={(option) => option.name}
                onChange={(_, selectedPrebuildDataset) => {
                  if (selectedPrebuildDataset) {
                    setPrebuildDataset(selectedPrebuildDataset);
                    setNumberOfDatasetImages(
                      selectedPrebuildDataset.totalImage
                    );
                  }
                }}
                renderOption={(optionProps, option) => (
                  <li {...optionProps} key={option.name}>
                    {option.name}
                  </li>
                )}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="List prebuild dataset" />
                )}
              />
            </Box>
            <Typography variant="body2" mt={2}>
              Number of dataset images:
            </Typography>
            <Box display="flex" alignItems="center" columnGap={1} pl={1}>
              <Slider
                size="small"
                value={numberOfDatasetImages}
                aria-label="Small"
                valueLabelDisplay="auto"
                onChange={onChangeNumberOfDatasetImagesSlider}
                min={MIN_DATASET_IMAGES_CREATE_PROJECT}
                max={
                  prebuildDataset?.totalImage ||
                  MIN_DATASET_IMAGES_CREATE_PROJECT
                }
                disabled={isCreatingProject}
              />
              <Input
                value={numberOfDatasetImages}
                size="small"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                  min: MIN_DATASET_IMAGES_CREATE_PROJECT,
                  max:
                    prebuildDataset?.totalImage ||
                    MIN_DATASET_IMAGES_CREATE_PROJECT,
                  type: "number",
                  "aria-labelledby": "input-number-of-dataset-images-slider",
                }}
                disabled={isCreatingProject}
              />
            </Box>
          </Box>
        )}
    </Box>
  );
};

const CreateProjectModal = function (props: CreateProjectModalProps) {
  const { isOpen, handleClose } = props;
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProjectFields>({
    mode: "onChange",
    defaultValues: {
      accessToken: getLocalStorage(TOKEN_NAME) || "",
      idToken: getLocalStorage(ID_TOKEN_NAME) || "",
      datasetProjectType: EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE,
    },
  });
  const [listPrebuildDataset, setListPrebuildDataset] = useState<
    PrebuildDataset[]
  >([]);

  const [prebuildDataset, setPrebuildDataset] =
    useState<PrebuildDataset | null>(null);
  const [isLoadingPrebuildDataset, setIsLoadingPrebuildDataset] =
    useState<boolean>(true);

  useEffect(() => {
    projectApi.getListPrebuildDataset({}).then((resp: any) => {
      if (!resp.error) {
        const prebuildDatasets: PrebuildDataset[] = [];
        for (const prebuildDataset of resp.data) {
          prebuildDatasets.push({
            isActive: prebuildDataset.is_active,
            s3Key: prebuildDataset.s3_key,
            name: prebuildDataset.name,
            totalImage: prebuildDataset.total_images,
            visualName: prebuildDataset.visual_name,
          });
        }

        setListPrebuildDataset([...prebuildDatasets]);
      } else {
        toast.error(resp.message);
      }
      setIsLoadingPrebuildDataset(false);
    });
  }, []);

  const [datasetProjectType, setDatasetProjectType] =
    useState<CreateProjectDatasetValueType>(
      EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE
    );

  const [numberOfDatasetImages, setNumberOfDatasetImages] = useState(1);

  const isLoading = useSelector(
    (state: RootState) => state.projectReducer.isCreatingProject
  );

  const resetFormData = () => {
    reset();
    setPrebuildDataset(null);
    setDatasetProjectType(EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE);
    setNumberOfDatasetImages(1);
  };

  const onSubmitCreateProject = (fields: CreateProjectFields) => {
    if (
      datasetProjectType === EXISTING_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE
    ) {
      if (prebuildDataset) {
        fields.createProjectPreBuild = {
          nameIdPrebuild: prebuildDataset.name,
          numberRadom: numberOfDatasetImages,
        };
      } else {
        toast.error("Please select one prebuild dataset.");
        return;
      }
    }

    dispatch({ type: CREATE_PROJECT.REQUESTED, payload: fields });
    resetFormData();
  };

  const onCloseModal = () => {
    if (!isLoading) {
      if (handleClose) {
        handleClose();
      }
      resetFormData();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={!isLoading ? onCloseModal : undefined}
      disableEscapeKeyDown
    >
      <Box sx={{ ...modalStyle, width: 700 }}>
        <IconButton
          sx={modalCloseStyle}
          onClick={!isLoading ? onCloseModal : undefined}
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
                value: MAX_PROJECT_DESCRIPTION_CHARACTER_LENGTH,
                message: `Your project description cannot exceed ${MAX_PROJECT_DESCRIPTION_CHARACTER_LENGTH} characters.`,
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
          <Box mt={2}>
            <FormControl fullWidth>
              <FormLabel id={CREATE_PROJECT_DATASET_TYPE_CONTROL}>
                Project Dataset
              </FormLabel>
              <RadioGroup
                aria-labelledby={CREATE_PROJECT_DATASET_TYPE_CONTROL}
                defaultValue={EMPTY_DATASET_CREATE_PROJECT_DATASET_TYPE_VALUE}
                name="radio-project-dataset-type"
              >
                <Box display="flex" width="100%" columnGap={2} mt={1}>
                  {CREATE_PROJECT_DATASET_TYPE_LIST.map(
                    (projectDatasetType) => {
                      const { value, label, description } = projectDatasetType;
                      return (
                        <Box
                          flex={1}
                          sx={{
                            border: "1px dashed",
                            borderColor: "text.secondary",
                            opacity: datasetProjectType === value ? 1 : 0.5,
                          }}
                          minHeight={144}
                          borderRadius={2}
                          padding={1}
                          key={`create-project-dataset-type-control-${value}`}
                        >
                          <CreateProjectDatasetTypeControl
                            value={value}
                            label={label}
                            description={description}
                            datasetProjectType={datasetProjectType}
                            setDatasetProjectType={setDatasetProjectType}
                            numberOfDatasetImages={numberOfDatasetImages}
                            setNumberOfDatasetImages={setNumberOfDatasetImages}
                            prebuildDataset={prebuildDataset}
                            setPrebuildDataset={setPrebuildDataset}
                            listPrebuildDataset={listPrebuildDataset}
                            isLoadingPrebuildDataset={isLoadingPrebuildDataset}
                            isCreatingProject={isLoading}
                          />
                        </Box>
                      );
                    }
                  )}
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
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
