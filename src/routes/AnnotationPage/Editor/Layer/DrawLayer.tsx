import { Layer } from "react-konva";
import { useSelector } from "react-redux";
import {
  selectorCurrentDrawState,
  selectorcurrentDrawType,
} from "reduxes/annotation/selector";
import { DrawState, DrawType } from "reduxes/annotation/type";
import DetectedRectangleDrawLayer from "./DetectedRectangleDrawLayer";
import EllipseDrawLayer from "./EllipseDrawLayer";
import PolygonDrawLayer from "./PolygonDrawLayer";
import RectangleDrawLayer from "./RectangleDrawLayer";

const DrawLayer = () => {
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const drawType = useSelector(selectorcurrentDrawType);

  const render = () => {
    if (
      currentDrawState === DrawState.FREE ||
      currentDrawState === DrawState.DRAWING
    ) {
      if (drawType == DrawType.POLYGON || drawType == DrawType.LINE_STRIP) {
        return <PolygonDrawLayer />;
      } else if (drawType === DrawType.RECTANGLE) {
        return <RectangleDrawLayer />;
      } else if (drawType === DrawType.ELLIPSE) {
        return <EllipseDrawLayer />;
      } else if (drawType === DrawType.DETECTED_RECTANGLE) {
        return <DetectedRectangleDrawLayer />;
      }
    }
    return <Layer></Layer>;
  };
  return render();
};
export default DrawLayer;
