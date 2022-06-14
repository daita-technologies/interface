import { Box, CircularProgress, Typography } from "@mui/material";
import { InfoTooltip } from "components";
import {
  AUGMENT_OPTION_TOOLTIP,
  MAX_AUGMENT_FREE_PLAN,
} from "constants/defaultValues";

import { useSelector } from "react-redux";

import {
  selectorCurrentProjectAugmentedTimes,
  selectorIsFetchingDetailProject,
  selectorMethodList,
} from "reduxes/project/selector";
import RunAugmentButton from "./RunAugmentButton";
import { AugmentationOptionProps } from "./type";

const AugmentationOption = function (props: AugmentationOptionProps) {
  const listMethod = useSelector(selectorMethodList);

  const generateTimes = useSelector(selectorCurrentProjectAugmentedTimes);
  const isFetchingDetailProject = useSelector(selectorIsFetchingDetailProject);

  const renderContent = () => {
    if (isFetchingDetailProject === null || isFetchingDetailProject === true) {
      return (
        <Box my={3} display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={20} />
        </Box>
      );
    }

    return (
      <Box>
        <Typography sx={{ mt: 1 }} variant="body2" textAlign="right">
          Number of Augmentation Runs: {generateTimes}/{MAX_AUGMENT_FREE_PLAN}
        </Typography>
      </Box>
    );
  };

  const renderMethodList = () => {
    if (listMethod && listMethod.augmentation) {
      return (
        <Box>
          <Typography sx={{ mt: 2, mb: 1 }} variant="body2">
            Methods:
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="flex-start">
            {listMethod?.augmentation.map((augmentationMethod) => (
              <Box
                flexBasis="33.33%"
                key={`augmentation-method-${augmentationMethod.method_id}`}
              >
                <Typography
                  sx={{ textTransform: "capitalize" }}
                  variant="caption"
                  color="text.secondary"
                >
                  {augmentationMethod.method_name
                    .replace(/_/g, " ")
                    .replace(/random/g, "")}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography
            sx={{ mt: 2, mb: 1 }}
            variant="caption"
            component="p"
            fontStyle="italic"
            color="text.secondary"
          >
            * We will randomly apply the above methods to the dataset.
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography fontWeight={500}>Augmentation Option</Typography>
          <InfoTooltip sx={{ ml: 1 }} title={AUGMENT_OPTION_TOOLTIP} />
        </Box>
        <RunAugmentButton isExpertMode={false} />
      </Box>
      {renderContent()}
      {renderMethodList()}
    </Box>
  );
};

export default AugmentationOption;
