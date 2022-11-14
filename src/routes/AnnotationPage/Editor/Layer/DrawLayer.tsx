import { Layer } from "react-konva";
import { useSelector } from "react-redux";
import {
  selectorCurrentDrawState,
  selectorCurrentDrawType,
} from "reduxes/annotation/selector";
import { DrawState, DrawType } from "reduxes/annotation/type";
import DetectedRectangleDrawLayer from "./DetectedRectangleDrawLayer";
import EllipseDrawLayer from "./EllipseDrawLayer";
import PolygonDrawLayer from "./PolygonDrawLayer";
import RectangleDrawLayer from "./RectangleDrawLayer";

const DrawLayer = () => {
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const drawType = useSelector(selectorCurrentDrawType);

  const render = () => {
    if (
      currentDrawState === DrawState.FREE ||
      currentDrawState === DrawState.DRAWING
    ) {
      if (drawType === DrawType.POLYGON || drawType === DrawType.LINE_STRIP) {
        return <PolygonDrawLayer />;
      }
      if (drawType === DrawType.RECTANGLE) {
        return <RectangleDrawLayer />;
      }
      if (drawType === DrawType.ELLIPSE) {
        return <EllipseDrawLayer />;
      }
      if (drawType === DrawType.DETECTED_RECTANGLE) {
        return <DetectedRectangleDrawLayer />;
      }
    }
    return <Layer />;
  };
  return render();
};
export default DrawLayer;
