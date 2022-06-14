import { Box, Switch, Typography } from "@mui/material";
import { InfoTooltip } from "components";
import { useDispatch, useSelector } from "react-redux";
import { changeAugmentationExpertMode } from "reduxes/customAugmentation/action";
import { selectorIssAugmentationExpertMode } from "reduxes/customAugmentation/selector";
import AugmentationOption from "../AugmentationOption";
import ExpertAugmentationOption from "../AugmentationOption/ExpertAugmentationOption";
import DataSetSplit from "../DataSetSplit";

const ImageAugmentation = function () {
  const dispatch = useDispatch();
  const isExpertMode = useSelector(selectorIssAugmentationExpertMode);
  const handleChangeExpertMode = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      changeAugmentationExpertMode({
        isAugmentationExpertMode: event.target.checked,
      })
    );
  };
  const renderNormalMode = () => (
    <Box mt={0} display="flex" gap={1}>
      <Box p={2} borderRadius={2} bgcolor="background.paper" flex={1}>
        <DataSetSplit />
      </Box>
      <Box p={2} borderRadius={2} bgcolor="background.paper" flex={1}>
        <AugmentationOption />
      </Box>
    </Box>
  );
  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <Box
        sx={{ mt: 1 }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <Switch
            checked={isExpertMode}
            size="small"
            onChange={handleChangeExpertMode}
          />
          <Typography fontWeight={500} variant="body2">
            Expert Mode
          </Typography>
          <InfoTooltip
            sx={{ ml: 1 }}
            title="In Expert Mode, you can customise the augmentation methods yourself."
          />
        </Box>
      </Box>
      {isExpertMode ? <ExpertAugmentationOption /> : renderNormalMode()}
    </Box>
  );
};

export default ImageAugmentation;
