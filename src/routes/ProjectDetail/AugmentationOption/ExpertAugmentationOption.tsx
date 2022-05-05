import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { InfoTooltip } from "components";
import {
  AugmentationMethod,
  BRIGHTNESS,
  CONTRAST,
  CROP,
  ERASE,
  GAUSSIAN_BLUR,
  GAUSSIAN_NOISE,
  HORIZONTAL_FLIP,
  HUE,
  POSTERIZE,
  ROTATE,
  SATURATION,
  SCALE,
  SHARPNESS,
  SOLARIZE,
  SUPPER_RESOLUTION,
  TITLE,
  TRANSLATE,
  VERTICAL_FLIP,
} from "components/ImageProcessing/type";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReferenceSeletectorDialog } from "reduxes/customAugmentation/action";
import { selectorReferenceAugmentationImage } from "reduxes/customAugmentation/selector";
import ReferenceImageDialog from "./ReferenceImageDialog";

const limitTooLongLineStyle = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  maxWidth: 240,
  lineHeight: 1.3,
};

const methods: AugmentationMethod[] = [
  ERASE,
  SUPPER_RESOLUTION,
  SHARPNESS,
  BRIGHTNESS,
  POSTERIZE,
  CROP,
  SATURATION,
  VERTICAL_FLIP,
  SOLARIZE,
  HUE,
  SCALE,
  CONTRAST,
  ROTATE,
  GAUSSIAN_NOISE,
  HORIZONTAL_FLIP,
  TRANSLATE,
  GAUSSIAN_BLUR,
  TITLE,
];
const icon = <CheckBoxOutlineBlankIcon />;
const checkedIcon = <CheckBoxIcon />;

const ExpertAugmentationOption = function () {
  const dispatch = useDispatch();
  const referenceAugmentationImage = useSelector(
    selectorReferenceAugmentationImage
  );

  const [listSelectedMethods, setListSelectedMethod] = useState<
    AugmentationMethod[]
  >([]);
  const handleShowReferenceDialog = (method: AugmentationMethod) => {
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
            onChange={(event: any, listMethod: AugmentationMethod[]) => {
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
                    {referenceAugmentationImage[method]
                      ? referenceAugmentationImage[method].filename
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

export default ExpertAugmentationOption;
