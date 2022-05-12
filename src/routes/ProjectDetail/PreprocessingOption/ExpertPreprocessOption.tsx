import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { InfoTooltip, MyButton } from "components";
import { useDispatch, useSelector } from "react-redux";
import {
  generateReferenceImages,
  setReferenceSeletectorDialog,
  setSelectedMethods,
} from "reduxes/customPreprocessing/action";
import {
  selectorIsGenerateReferenceRequesting,
  selectorIsGenerating,
  selectorReferencePreprocessImage,
  selectorSelectedMethods,
} from "reduxes/customPreprocessing/selector";
import {
  selectorCurrentProjectId,
  selectorMethodList,
} from "reduxes/project/selector";
import { MethodInfoFields } from "reduxes/project/type";
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
  const selectedMethods = useSelector(selectorSelectedMethods);
  const isGenerating = useSelector(selectorIsGenerating);
  const isGenerateReferenceRequesting = useSelector(
    selectorIsGenerateReferenceRequesting
  );
  const methods = useSelector(selectorMethodList)?.preprocessing;
  const handleShowReferenceDialog = (method: MethodInfoFields) => {
    dispatch(setReferenceSeletectorDialog({ isShow: true, method }));
  };
  const handleChangeSelectedMethods = (
    event: any,
    listMethod: MethodInfoFields[]
  ) => {
    dispatch(setSelectedMethods({ selectedMethods: listMethod }));
  };
  const handleClickGenerateReferenceImages = () => {
    dispatch(generateReferenceImages({ projectId: currentProjectId }));
  };
  const isOptionEqualToValue = (
    option: MethodInfoFields,
    value: MethodInfoFields
  ) => option.method_id === value.method_id;
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <MyButton
          variant="contained"
          size="small"
          isLoading={isGenerateReferenceRequesting}
          disabled={isGenerating}
          onClick={handleClickGenerateReferenceImages}
        >
          Run
        </MyButton>
        <Typography fontWeight={500} ml={1}>
          Generate the reference images
        </Typography>
        <InfoTooltip sx={{ ml: 1 }} title="Expert mode" />
      </Box>
      <Box mt={2} display="flex" gap={1}>
        <Box borderRadius={2} bgcolor="background.paper" flex={2}>
          <Autocomplete
            multiple
            id="checkboxes-tags"
            options={methods || []}
            value={selectedMethods || []}
            disableCloseOnSelect
            getOptionLabel={(method) => prettyMethodName(method.method_name)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {prettyMethodName(option.method_name)}
              </li>
            )}
            isOptionEqualToValue={isOptionEqualToValue}
            onChange={handleChangeSelectedMethods}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Method"
                placeholder="Choose method"
              />
            )}
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
            {selectedMethods.map((method) => (
              <Box key={method.method_id} flexBasis="33.33%" sx={{ p: 1 }}>
                <Typography variant="body1" fontWeight={500}>
                  {prettyMethodName(method.method_name)}
                </Typography>
                <Box display="flex" alignItems="flex-end">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={limitTooLongLineStyle}
                  >
                    {referencePreprocessImage[method.method_id]
                      ? referencePreprocessImage[method.method_id].filename
                      : "Select your reference image"}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{ padding: "0 2px" }}
                    color="primary"
                    component="span"
                    onClick={() => handleShowReferenceDialog(method)}
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
