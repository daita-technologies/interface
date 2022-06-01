import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import { Box, CircularProgress, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { InfoTooltip } from "components";
import {
  AUGMENT_OPTION_TOOLTIP,
  MAX_AUGMENT_FREE_PLAN,
} from "constants/defaultValues";

import _ from "lodash";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";
import {
  addAugmentCustomMethodParamValue,
  removeAugmentCustomMethodParamValue,
  setReferenceSeletectorDialog,
} from "reduxes/customAugmentation/action";
import {
  selectorIsAbleToRunAgumentationError,
  selectorSelectedListCustomAugmentMethodId,
} from "reduxes/customAugmentation/selector";
import {
  selectorCurrentProjectAugmentedTimes,
  selectorCurrentProjectId,
  selectorIsFetchingDetailProject,
  selectorMethodList,
} from "reduxes/project/selector";
import DataSetSplit from "../DataSetSplit";
import { prettyMethodName } from "../PreprocessingOption/ReferenceImageDialog";

/* eslint-disable import/no-cycle */
import AugmentCustomMethodTrigger from "./AugmentCustomMethodTrigger";
import AugmentPreviewImageDialog from "./AugmentPreviewImage";
import RunAugmentButton from "./RunAugmentButton";

export const limitTooLongLineStyle = {
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

  const generateTimes = useSelector(selectorCurrentProjectAugmentedTimes);

  const selectedListCustomMethodId = useSelector((state: RootState) =>
    selectorSelectedListCustomAugmentMethodId(currentProjectId, state)
  );

  const isAbleToRunAgumentationError = useSelector(
    selectorIsAbleToRunAgumentationError
  );

  const isFetchingDetailProject = useSelector(selectorIsFetchingDetailProject);

  const methods = useSelector(selectorMethodList)?.augmentation;
  const methodIds = methods ? methods.map((t) => t.method_id) : [];

  const isSelectedMethods = useMemo(
    () => selectedListCustomMethodId && selectedListCustomMethodId.length > 0,
    [selectedListCustomMethodId]
  );

  const handleChangeSelectedMethods = (event: any, listMethod: string[]) => {
    if (listMethod.length < selectedListCustomMethodId.length) {
      // NOTE: user remove selected method
      const removeMethodIdList = _.difference(
        selectedListCustomMethodId,
        listMethod
      );

      dispatch(
        removeAugmentCustomMethodParamValue({
          projectId: currentProjectId,
          removeMethodIdList,
        })
      );
    } else {
      // TODO: add selected method
      const addMethodIdList = _.difference(
        listMethod,
        selectedListCustomMethodId
      );
      dispatch(
        addAugmentCustomMethodParamValue({
          projectId: currentProjectId,
          addMethodIdList,
        })
      );
    }
  };
  const handleShowReferenceDialog = (methodId: string) => {
    dispatch(setReferenceSeletectorDialog({ isShow: true, methodId }));
  };
  const isOptionEqualToValue = (option: string, value: string) =>
    option === value;
  const getMethodName = (methodId: string) =>
    methods?.find((t) => t.method_id === methodId)?.method_name;

  if (isFetchingDetailProject) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" py={6}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box mt={2} display="flex" flexDirection="column" gap={1}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography fontWeight={500}>Augmentation Option</Typography>
          <InfoTooltip sx={{ ml: 1 }} title={AUGMENT_OPTION_TOOLTIP} />
        </Box>
        <Box textAlign="right">
          <RunAugmentButton isExpertMode />
          <Box>
            <Typography sx={{ mt: 2 }} variant="body2">
              Number of Augmentation Runs: {generateTimes}/
              {MAX_AUGMENT_FREE_PLAN}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box borderRadius={2} bgcolor="background.paper" flex={1}>
        <Box mt={2} display="flex" gap={1}>
          <Box borderRadius={2} bgcolor="background.paper" flex={2}>
            <Autocomplete
              multiple
              id="checkboxes-tags"
              options={methodIds}
              value={selectedListCustomMethodId || []}
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
                  error={!!isAbleToRunAgumentationError && !isSelectedMethods}
                  helperText={
                    !!isAbleToRunAgumentationError && !isSelectedMethods
                      ? "Please select method!"
                      : ""
                  }
                  // sx={{ border: "red" }}
                  label="Method"
                  placeholder="Choose method"
                />
              )}
            />
          </Box>
          <Box borderRadius={2} bgcolor="background.paper" flex={3}>
            <Box display="flex" flexWrap="wrap" justifyContent="flex-start">
              {selectedListCustomMethodId.map((methodId) => (
                <Box key={methodId} flexBasis="33.33%" sx={{ p: 1 }}>
                  <AugmentCustomMethodTrigger
                    methodId={methodId}
                    methodName={getMethodName(methodId)}
                    handleShowReferenceDialog={() =>
                      handleShowReferenceDialog(methodId)
                    }
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <AugmentPreviewImageDialog />
      </Box>
      <Box display="flex" width="100%" justifyContent="flex-end" mt={3}>
        <Box borderRadius={2} bgcolor="background.paper" flex={1}>
          <Box mt={2} display="flex" gap={1}>
            <Box bgcolor="background.paper" flex={2}>
              <DataSetSplit />
            </Box>

            <Box borderRadius={2} bgcolor="background.paper" flex={3} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ExpertAugmentationOption;
