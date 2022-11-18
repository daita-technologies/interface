import { useCallback } from "react";
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
import { DrawLayerProps } from "./type";

const DrawLayer = (drawLayerProps: DrawLayerProps) => {
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const drawType = useSelector(selectorCurrentDrawType);

  const render = () => {
    if (
      currentDrawState === DrawState.FREE ||
      currentDrawState === DrawState.DRAWING
    ) {
      if (drawType === DrawType.POLYGON || drawType === DrawType.LINE_STRIP) {
        return <PolygonDrawLayer drawLayerProps={drawLayerProps} />;
      }
      if (drawType === DrawType.RECTANGLE) {
        return <RectangleDrawLayer drawLayerProps={drawLayerProps} />;
      }
      if (drawType === DrawType.ELLIPSE) {
        return <EllipseDrawLayer drawLayerProps={drawLayerProps} />;
      }
      if (drawType === DrawType.DETECTED_RECTANGLE) {
        return <DetectedRectangleDrawLayer drawLayerProps={drawLayerProps} />;
      }
    }
    return <Layer />;
  };
  return render();
};

export default DrawLayer;
