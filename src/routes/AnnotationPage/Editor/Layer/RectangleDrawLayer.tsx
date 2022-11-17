import { LINE_STYLE } from "components/Annotation/Editor/const";
import { createRectangle } from "components/Annotation/Editor/Shape/Rectangle";
import { RectangleSpec } from "components/Annotation/Editor/type";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef, useState } from "react";
import { Layer, Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentDrawState,
  createDrawObject,
} from "reduxes/annotation/action";
import { DrawState, DrawType } from "reduxes/annotation/type";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selecetor";
import { FULL_PADDING_VALUE } from "routes/AnnotationPage/constants";
import { DrawLayerProps } from "./type";
import { adjustPosition } from "./utils";

function RectangleDrawLayer({
  drawLayerProps: { paddingLeft, paddingTop },
}: {
  drawLayerProps: DrawLayerProps;
}) {
  const dispatch = useDispatch();
  const [startPoint, setStartPoint] = useState<Vector2d | null>(null);
  const [endPoint, setEndPoint] = useState<Vector2d | null>(null);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);

  const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position) return;
    const newPosition = adjustPosition(
      position,
      currentAnnotationFile?.width,
      currentAnnotationFile?.height
    );
    setStartPoint({ ...newPosition });
    dispatch(changeCurrentDrawState({ drawState: DrawState.DRAWING }));
    e.evt.preventDefault();
    e.evt.stopPropagation();
  };
  const layer = useRef<Konva.Layer | null>(null);
  useEffect(() => {
    layer.current?.moveToTop();
  }, []);
  const resetDraw = () => {
    setStartPoint(null);
    setEndPoint(null);
    dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
  };
  const handleMouseUp = () => {
    if (startPoint && endPoint) {
      const rect = createRectangle({
        x: Math.min(startPoint.x, endPoint.x),
        y: Math.min(startPoint.y, endPoint.y),
      });
      const spec = rect.data as RectangleSpec;
      dispatch(
        createDrawObject({
          drawObject: {
            type: DrawType.RECTANGLE,
            data: {
              ...spec,
              width: Math.abs(startPoint.x - endPoint.x),
              height: Math.abs(startPoint.y - endPoint.y),
            } as RectangleSpec,
          },
        })
      );
    }
    resetDraw();
  };

  const renderDummyRect = () => {
    if (currentAnnotationFile) {
      return (
        <Rect
          x={-FULL_PADDING_VALUE}
          y={-FULL_PADDING_VALUE}
          width={2 * currentAnnotationFile.width}
          height={2 * currentAnnotationFile.height}
        />
      );
    }
    return null;
  };
  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    setEndPoint(
      adjustPosition(
        position,
        currentAnnotationFile?.width,
        currentAnnotationFile?.height
      )
    );
  };

  return (
    <Layer
      ref={layer}
      x={paddingLeft}
      y={paddingTop}
      onMouseMove={mousemoveHandler}
      onMouseDown={mousedownHandler}
      onMouseUp={handleMouseUp}
    >
      {renderDummyRect()}
      {startPoint && endPoint && (
        <Rect
          id="1"
          x={startPoint.x}
          y={startPoint.y}
          width={endPoint.x - startPoint.x}
          height={endPoint.y - startPoint.y}
          {...LINE_STYLE}
        />
      )}
    </Layer>
  );
}
export default RectangleDrawLayer;
