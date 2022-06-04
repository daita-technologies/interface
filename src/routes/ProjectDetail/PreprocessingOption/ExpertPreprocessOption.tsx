import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { InfoTooltip, MyButton } from "components";
import {
  GRASCALE_PREPROCESS_METHOD_ALLOW_LIST,
  GRAYSCALE_METHOD_ID,
} from "constants/defaultValues";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateReferenceImages,
  resetStateGenerateReferenceImage,
  setReferenceSeletectorDialog,
  setSelectedMethods,
} from "reduxes/customPreprocessing/action";
import {
  selectorIsGenerateReferenceRequesting,
  selectorIsGenerating,
  selectorReferencePreprocessImage,
  selectorReferencePreprocessProjectId,
  selectorSelectedMethodIds,
} from "reduxes/customPreprocessing/selector";
import {
  selectorCurrentProjectId,
  selectorCurrentProjectName,
  selectorHaveTaskRunning,
  selectorMethodList,
} from "reduxes/project/selector";
import ReferenceImageDialog, { prettyMethodName } from "./ReferenceImageDialog";

const limitTooLongLineStyle = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  maxWidth: 240,
  lineHeight: 1.3,
};

const icon = <CheckBoxOutlineBlankIcon />;
const checkedIcon = <CheckBoxIcon />;

const ExpertPreprocessingOption = function () {
  const dispatch = useDispatch();
  const referencePreprocessImage = useSelector(
    selectorReferencePreprocessImage
  );
  const currentProjectId = useSelector(selectorCurrentProjectId);
  const currentProjectName = useSelector(selectorCurrentProjectName);
  const selectedMethodIds = useSelector(selectorSelectedMethodIds);
  const referencePreprocessProjectId = useSelector(
    selectorReferencePreprocessProjectId
  );
  const isGenerating = useSelector(selectorIsGenerating);
  const isGenerateReferenceRequesting = useSelector(
    selectorIsGenerateReferenceRequesting
  );
  const methods = useSelector(selectorMethodList)?.preprocessing;
  const methodIds = methods ? methods.map((t) => t.method_id) : [];
  useEffect(() => {
    if (currentProjectId && currentProjectId !== referencePreprocessProjectId) {
      dispatch(
        resetStateGenerateReferenceImage({ projectId: currentProjectId })
      );
    }
  }, [currentProjectId]);
  const haveTaskRunning = useSelector(selectorHaveTaskRunning);

  const handleShowReferenceDialog = (methodId: string) => {
    dispatch(setReferenceSeletectorDialog({ isShow: true, methodId }));
  };
  const handleChangeSelectedMethods = (event: any, listMethod: string[]) => {
    let filteredListMethod = listMethod;
    if (listMethod.indexOf(GRAYSCALE_METHOD_ID) !== -1) {
      filteredListMethod = listMethod.filter(
        (t) => GRASCALE_PREPROCESS_METHOD_ALLOW_LIST.indexOf(t) !== -1
      );
    }
    dispatch(setSelectedMethods({ selectedMethodIds: filteredListMethod }));
  };
  const handleClickGenerateReferenceImages = () => {
    dispatch(
      generateReferenceImages({
        projectId: currentProjectId,
        selectedMethodIds,
        projectName: currentProjectName,
      })
    );
  };
  const isRunning = useMemo(
    () => !currentProjectId || isGenerating || haveTaskRunning,
    [currentProjectId, isGenerating, haveTaskRunning]
  );
  const isOptionEqualToValue = (option: string, value: string) =>
    option === value;
  const getMethodName = (methodId: string) =>
    methods?.find((t) => t.method_id === methodId)?.method_name;
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <MyButton
          variant="contained"
          size="small"
          isLoading={isGenerateReferenceRequesting}
          disabled={isRunning}
          onClick={handleClickGenerateReferenceImages}
        >
          Run
        </MyButton>
        <Typography fontWeight={500} ml={1}>
          Generate the reference images
        </Typography>
        <InfoTooltip
          sx={{ ml: 1 }}
          title="If enabled, our system selects the most appropriate reference images for the selected methods of the preprocessing run."
        />
      </Box>
      <Box mt={2} display="flex" gap={1}>
        <Box borderRadius={2} bgcolor="background.paper" flex={2}>
          <Autocomplete
            multiple
            id="checkboxes-tags"
            options={methodIds}
            value={selectedMethodIds || []}
            disableCloseOnSelect
            getOptionLabel={(methodId) =>
              prettyMethodName(getMethodName(methodId))
            }
            renderOption={(props, option, { selected }) => {
              const isDisable =
                selectedMethodIds.indexOf(GRAYSCALE_METHOD_ID) !== -1 &&
                GRASCALE_PREPROCESS_METHOD_ALLOW_LIST.indexOf(option) === -1;
              let newProps = props;
              if (isDisable) {
                newProps = {
                  ...props,
                  style: { ...newProps.style, color: "gray" },
                };
              }
              return (
                <li {...newProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    disabled={isDisable}
                  />
                  {prettyMethodName(getMethodName(option))}
                </li>
              );
            }}
            isOptionEqualToValue={isOptionEqualToValue}
            onChange={handleChangeSelectedMethods}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Method"
                placeholder="Choose method"
              />
            )}
            disabled={isRunning}
          />
        </Box>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ backgroundColor: "text.secondary", margin: 0 }}
        />
        <Box borderRadius={2} bgcolor="background.paper" flex={3}>
          <Box display="flex" flexWrap="wrap" justifyContent="flex-start">
            {selectedMethodIds.map((methodId) => (
              <Box key={methodId} flexBasis="33.33%" sx={{ p: 1 }}>
                <Typography variant="body1" fontWeight={500}>
                  {prettyMethodName(getMethodName(methodId))}
                </Typography>
                <Box display="flex" alignItems="flex-end">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={limitTooLongLineStyle}
                  >
                    {referencePreprocessImage[methodId]
                      ? referencePreprocessImage[methodId].filename
                      : "Select your reference image"}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{ padding: "0 2px" }}
                    color="primary"
                    component="span"
                    onClick={() => handleShowReferenceDialog(methodId)}
                    disabled={isRunning}
                  >
                    <EditIcon sx={{ width: 20 }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <ReferenceImageDialog />
      </Box>
    </Box>
  );
};

export default ExpertPreprocessingOption;
