import { Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { RootState } from "reduxes";
import { useSelector } from "react-redux";
import { selectorSavedAugmentCustomMethodParamValue } from "reduxes/customAugmentation/selector";
import { AugmentCustomMethodParamValue } from "reduxes/customAugmentation/type";

import { limitTooLongLineStyle } from "./ExpertAugmentationOption";
import { prettyMethodName } from "../PreprocessingOption/ReferenceImageDialog";
import { AugmentCustomMethodTriggerProps } from "./type";

const SelectedParamText = function ({
  selectedParam,
}: {
  selectedParam: AugmentCustomMethodParamValue | undefined;
}) {
  if (selectedParam) {
    const { params } = selectedParam;
    return (
      <>
        {params.map((method) => (
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={limitTooLongLineStyle}
          >
            {`${method.paramName}: ${method.paramValue}`}
          </Typography>
        ))}
      </>
    );
  }

  return (
    <Typography
      variant="body2"
      color="text.secondary"
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
  const savedAugmentCustomMethodParamValue = useSelector((state: RootState) =>
    selectorSavedAugmentCustomMethodParamValue(methodId || "", state)
  );

  return (
    <Box key={methodId} flexBasis="33.33%" sx={{ p: 1 }}>
      <Typography variant="body1" fontWeight={500}>
        {prettyMethodName(methodName)}
      </Typography>
      <Box display="flex" alignItems="flex-end">
        <SelectedParamText selectedParam={savedAugmentCustomMethodParamValue} />
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
  );
};

export default AugmentCustomMethodTrigger;
