import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";
import { InfoTooltipProps } from "./type";

const InfoTooltip = function (props: InfoTooltipProps) {
  return (
    <Tooltip placement="top" {...props}>
      <InfoIcon />
    </Tooltip>
  );
};

export default InfoTooltip;
