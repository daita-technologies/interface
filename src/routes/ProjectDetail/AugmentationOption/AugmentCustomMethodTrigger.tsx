import { Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useMemo } from "react";
import { RootState } from "reduxes";
import { useSelector } from "react-redux";
import {
  selectorIsAbleToRunAgumentationError,
  selectorSpecificSavedAugmentCustomMethodParamValue,
} from "reduxes/customAugmentation/selector";
import { AugmentCustomMethodParamValue } from "reduxes/customAugmentation/type";
import {
  selectorCurrentProjectId,
  selectorHaveTaskRunning,
} from "reduxes/project/selector";
import { selectorIsGenerateImagesAugmenting } from "reduxes/generate/selector";

/* eslint-disable import/no-cycle */
import { limitTooLongLineStyle } from "./ExpertAugmentationOption";
import { prettyMethodName } from "../PreprocessingOption/ReferenceImageDialog";
import { AugmentCustomMethodTriggerProps } from "./type";

const SelectedParamText = function ({
  selectedParam,
}: {
  selectedParam: AugmentCustomMethodParamValue | undefined;
}) {
  const isAbleToRunAgumentationError = useSelector(
    selectorIsAbleToRunAgumentationError
  );

  if (selectedParam) {
    const { params } = selectedParam;
    return (
      <Box>
        {params.map((method) => (
          <Typography
            key={`selected-param-text-value-of-${method.paramName}-${method.paramValue}`}
            variant="body2"
            color="text.secondary"
            noWrap
            sx={limitTooLongLineStyle}
            textTransform="capitalize"
          >
            {`${method.paramName}: ${method.paramValue}`}
          </Typography>
        ))}
      </Box>
    );
  }

  return (
    <Typography
      variant="body2"
      color={isAbleToRunAgumentationError ? "error" : "text.secondary"}
      noWrap
      sx={limitTooLongLineStyle}
    >
      Select your param value
    </Typography>
  );
};

const AugmentCustomMethodTrigger = function ({
  methodId,
  methodName,
  handleShowReferenceDialog,
}: AugmentCustomMethodTriggerProps) {
  const currentProjectId = useSelector(selectorCurrentProjectId);

  const specificSavedAugmentCustomMethodParamValue = useSelector(
    (state: RootState) =>
      selectorSpecificSavedAugmentCustomMethodParamValue(
        currentProjectId,
        methodId || "",
        state
      )
  );

  const haveTaskRunning = useSelector(selectorHaveTaskRunning);
  const isGenerateImagesAugmenting = useSelector(
    selectorIsGenerateImagesAugmenting
  );

  const isRunning = useMemo(
    () => !currentProjectId || haveTaskRunning || !!isGenerateImagesAugmenting,
    [currentProjectId, haveTaskRunning, isGenerateImagesAugmenting]
  );

  return (
    <Box
      key={methodId}
      flexBasis="33.33%"
      sx={{
        p: 1,
        backgroundColor: isRunning ? "rgba(255, 255, 255, 0.12)" : undefined,
        borderRadius: "4px",
      }}
    >
      <Typography variant="body1" fontWeight={500}>
        {prettyMethodName(methodName)}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <SelectedParamText
          selectedParam={specificSavedAugmentCustomMethodParamValue}
        />
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
  );
};

export default AugmentCustomMethodTrigger;
