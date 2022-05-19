import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setReferenceSeletectorDialog,
  setSelectedMethods,
} from "reduxes/customAugmentation/action";
import {
  selectorReferenceAugmentationImage,
  selectorSelectedMethodIds,
} from "reduxes/customAugmentation/selector";
import {
  selectorCurrentProjectId,
  selectorMethodList,
} from "reduxes/project/selector";
import DataSetSplit from "../DataSetSplit";
import { prettyMethodName } from "../PreprocessingOption/ReferenceImageDialog";
import ReferenceImageDialog from "./ReferenceImageDialog";

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

const ExpertAugmentationOption = function () {
  const dispatch = useDispatch();
  const currentProjectId = useSelector(selectorCurrentProjectId);
  const selectedMethodIds = useSelector(selectorSelectedMethodIds);
  const methods = useSelector(selectorMethodList)?.augmentation;
  const methodIds = methods ? methods.map((t) => t.method_id) : [];
  useEffect(() => {
    dispatch(setSelectedMethods({ selectedMethodIds: [] }));
  }, [currentProjectId]);
  const referenceAugmentationImage = useSelector(
    selectorReferenceAugmentationImage
  );

  const handleChangeSelectedMethods = (event: any, listMethod: string[]) => {
    dispatch(setSelectedMethods({ selectedMethodIds: listMethod }));
  };
  const handleShowReferenceDialog = (methodId: string) => {
    dispatch(setReferenceSeletectorDialog({ isShow: true, methodId }));
  };
  const isOptionEqualToValue = (option: string, value: string) =>
    option === value;
  const getMethodName = (methodId: string) =>
    methods?.find((t) => t.method_id === methodId)?.method_name;
  return (
    <Box mt={2} display="flex" flexDirection="column" gap={1}>
      <Box p={2} borderRadius={2} bgcolor="background.paper" flex={1}>
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
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {prettyMethodName(getMethodName(option))}
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
                      {referenceAugmentationImage[methodId]
                        ? referenceAugmentationImage[methodId].filename
                        : "Select your reference image"}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ padding: "0 2px" }}
                      color="primary"
                      component="span"
                      onClick={() => handleShowReferenceDialog(methodId)}
                    >
                      <EditIcon sx={{ width: 20 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <ReferenceImageDialog />
      </Box>
      <Box display="flex" width="100%" justifyContent="flex-end">
        <Box borderRadius={2} bgcolor="background.paper" flex={1}>
          <Box mt={2} display="flex" gap={1}>
            <Box borderRadius={2} bgcolor="background.paper" flex={2} />
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ backgroundColor: "text.secondary", margin: 0 }}
            />
            <Box bgcolor="background.paper" flex={3}>
              <DataSetSplit />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ExpertAugmentationOption;
