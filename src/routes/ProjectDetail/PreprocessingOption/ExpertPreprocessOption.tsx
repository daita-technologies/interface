import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { InfoTooltip } from "components";
import {
  AUTO_ORIENTATION,
  EQUALIZE_HISTOGRAM,
  HIGH_RESOLUTION,
  NORMALIZE_BRIGHTNESS,
  NORMALIZE_CONTRAST,
  NORMALIZE_HUE,
  NORMALIZE_SATURATION,
  NORMALIZE_SHARPNESS,
  PreprocessingMedthod,
} from "components/ImageProcessing/type";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReferenceSeletectorDialog } from "reduxes/customPreprocessing/action";
import { selectorReferencePreprocessImage } from "reduxes/customPreprocessing/selector";
import ReferenceImageDialog from "./ReferenceImageDialog";

const limitTooLongLineStyle = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  maxWidth: 240,
  lineHeight: 1.3,
};

const methods: PreprocessingMedthod[] = [
  HIGH_RESOLUTION,
  NORMALIZE_HUE,
  AUTO_ORIENTATION,
  NORMALIZE_CONTRAST,
  NORMALIZE_SATURATION,
  EQUALIZE_HISTOGRAM,
  NORMALIZE_SHARPNESS,
  NORMALIZE_BRIGHTNESS,
];
const icon = <CheckBoxOutlineBlankIcon />;
const checkedIcon = <CheckBoxIcon />;

const ExpertPreprocessingOption = function () {
  const dispatch = useDispatch();
  const referencePreprocessImage = useSelector(
    selectorReferencePreprocessImage
  );

  const [listSelectedMethods, setListSelectedMethod] = useState<
    PreprocessingMedthod[]
  >([]);
  const handleShowReferenceDialog = (method: PreprocessingMedthod) => {
    dispatch(setReferenceSeletectorDialog({ isShow: true, method }));
  };
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Button variant="contained" size="small">
          Run
        </Button>
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
            options={methods}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            onChange={(event: any, listMethod: PreprocessingMedthod[]) => {
              setListSelectedMethod(listMethod);
            }}
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
            {listSelectedMethods.map((method) => (
              <Box key={method} flexBasis="33.33%" sx={{ p: 1 }}>
                <Typography variant="body1" fontWeight={500}>
                  {method}
                </Typography>
                <Box display="flex" alignItems="flex-end">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={limitTooLongLineStyle}
                  >
                    {referencePreprocessImage[method]
                      ? referencePreprocessImage[method].filename
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
