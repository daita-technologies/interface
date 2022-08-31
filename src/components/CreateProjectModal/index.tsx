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
  SxProps,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_PROJECT } from "reduxes/project/constants";
import { modalCloseStyle, modalStyle } from "styles/generalStyle";
import { getLocalStorage } from "utils/general";
import {
  CreateProjectFields,
  CreateProjectModalProps,
  PrebuildDataset,
} from "./type";

import { MyButton } from "components";
import {
  ID_TOKEN_NAME,
  MAX_ALLOW_UPLOAD_IMAGES,
  TOKEN_NAME,
} from "constants/defaultValues";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RootState } from "reduxes";
import { projectApi } from "services";

const radioCss: SxProps<Theme> = {
  flex: 1,
  justifyContent: "center",
  border: "1px dashed",
  margin: "2px",
};
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
  const [listPrebuildDataset, setListPrebuildDataset] = useState<
    PrebuildDataset[]
  >([]);
  const [fromDatasets, setFromDatasets] = useState<"Empty" | "Existed">(
    "Empty"
  );
  const [prebuildDataset, setPrebuildDataset] =
    useState<PrebuildDataset | null>(null);
  const [isLoadingPrebuildDataset, setIsLoadingPrebuildDataset] =
    useState<boolean>(true);
  const [numberOfImages, setNumberOfImages] = useState<number>(0);

  useEffect(() => {
    projectApi
      .getListPrebuildDataset({ idToken: getLocalStorage(ID_TOKEN_NAME) || "" })
      .then((resp: any) => {
        if (!resp.error) {
          console.log("resp", resp);
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
          console.log("prebuildDatasets", prebuildDatasets);
          setListPrebuildDataset([...prebuildDatasets]);
        } else {
          toast.error(resp.message);
        }
        setIsLoadingPrebuildDataset(false);
      });
  }, []);

  const isLoading = useSelector(
    (state: RootState) => state.projectReducer.isCreatingProject
  );

  const onSubmitCreateProject = (fields: CreateProjectFields) => {
    if (fromDatasets === "Existed") {
      if (prebuildDataset) {
        fields.createProjectPreBuild = {
          nameIdPrebuild: prebuildDataset.name,
          numberRadom: numberOfImages,
        };
      } else {
        toast.error("Please select one prebuild dataset");
        return;
      }
    }

    dispatch({ type: CREATE_PROJECT.REQUESTED, payload: fields });
  };

  const handleChangeFromDatasets = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFromDatasets(
      (event.target as HTMLInputElement).value as "Empty" | "Existed"
    );
  };
  const handleChangeNumberOfImages = (
    _event: Event,
    newValue: number | number[]
  ) => {
    setNumberOfImages(newValue as number);
  };
  return (
    <Modal
      open={isOpen}
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
          <Box mt={1}>
            <FormLabel id="demo-radio-buttons-group-label">
              From Datasets
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              row
              sx={{ justifyContent: "space-around", height: 200 }}
              value={fromDatasets}
              onChange={handleChangeFromDatasets}
            >
              <Box display="flex" sx={{ ...radioCss }}>
                <FormControlLabel
                  value="Empty"
                  control={<Radio />}
                  label="Empty"
                  labelPlacement="start"
                  sx={{ justifyContent: "center", margin: 0 }}
                />
              </Box>
              <Box
                display="flex"
                sx={{ ...radioCss, alignItems: "center" }}
                flexDirection="column"
              >
                <FormControlLabel
                  value="Existed"
                  control={<Radio />}
                  label="Existed"
                  labelPlacement="start"
                  sx={{ justifyContent: "center", margin: 0 }}
                />
                {fromDatasets === "Existed" && (
                  <>
                    <Autocomplete
                      id="prebuild-dataset"
                      value={prebuildDataset}
                      disablePortal
                      loading={isLoadingPrebuildDataset}
                      options={listPrebuildDataset}
                      getOptionLabel={(option) => option.name}
                      onChange={(_, value) => {
                        if (value) {
                          setPrebuildDataset(value);
                          setNumberOfImages(value.totalImage);
                        }
                      }}
                      renderOption={(props, option) => (
                        <li {...props} key={option.name}>
                          {option.name}
                        </li>
                      )}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="List prebuild dataset" />
                      )}
                    />
                    <Box mt={2} width="95%">
                      <Typography id="input-slider" gutterBottom>
                        Number of images
                      </Typography>
                      <Slider
                        size="small"
                        value={numberOfImages}
                        min={0}
                        max={MAX_ALLOW_UPLOAD_IMAGES}
                        aria-label="Small"
                        valueLabelDisplay="auto"
                        onChange={handleChangeNumberOfImages}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </RadioGroup>
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
