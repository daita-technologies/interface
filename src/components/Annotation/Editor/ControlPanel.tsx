import Crop32Icon from "@mui/icons-material/Crop32";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import PolylineIcon from "@mui/icons-material/Polyline";
import { Box, Button } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrentDrawType, changeZoom } from "reduxes/annotation/action";
import { selectorcurrentDrawType } from "reduxes/annotation/selector";
import { DrawType } from "reduxes/annotation/type";

const ControlPanel = () => {
  const dispatch = useDispatch();
  const currentDrawType = useSelector(selectorcurrentDrawType);

  const resetScaleHandler = () => {
    dispatch(changeZoom({ zoom: { zoom: 1, position: { x: 0, y: 0 } } }));
  };

  const selectModeHandle = (
    event: React.MouseEvent<HTMLElement>,
    drawType: DrawType
  ) => {
    dispatch(changeCurrentDrawType({ currentDrawType: drawType }));
  };
  return (
    <>
      <Box sx={{ minWidth: 100 }} display="flex" flexDirection="column" gap={1}>
        <ToggleButtonGroup
          value={currentDrawType}
          exclusive
          onChange={selectModeHandle}
          aria-label="mode"
          className="annotationControlPanel"
          size="large"
        >
          <ToggleButton value={DrawType.RECTANGLE} aria-label="Rectangle">
            <Crop32Icon />
          </ToggleButton>
          <ToggleButton value={DrawType.POLYGON} aria-label="Polygon">
            <PolylineIcon />
          </ToggleButton>
          <ToggleButton value={DrawType.ELLIPSE} aria-label="ellipse">
            <PanoramaFishEyeIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <Button variant="outlined" onClick={resetScaleHandler}>
          Reset Scale
        </Button>
        <Button variant="outlined" onClick={resetScaleHandler}>
          Reset Draw
        </Button>
      </Box>
    </>
  );
};
export default ControlPanel;
