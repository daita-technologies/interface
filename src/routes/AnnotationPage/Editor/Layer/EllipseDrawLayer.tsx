import { LINE_STYLE } from "components/Annotation/Editor/const";
import { createEllipse } from "components/Annotation/Editor/Shape/EllipseShape";
import { EllipseSpec } from "components/Annotation/Editor/type";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef, useState } from "react";
import { Ellipse, Layer, Rect } from "react-konva";
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

function EllipseDrawLayer({
  drawLayerProps: { paddingLeft, paddingTop },
}: {
  drawLayerProps: DrawLayerProps;
}) {
  const dispatch = useDispatch();
  const [startPoint, setStartPoint] = useState<Vector2d | null>(null);
  const [endPoint, setEndPoint] = useState<Vector2d | null>(null);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);

  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position || !startPoint) return;
    setEndPoint({
      ...adjustPosition(
        position,
        currentAnnotationFile?.width,
        currentAnnotationFile?.height
      ),
    });
  };
  const resetDraw = () => {
    setStartPoint(null);
    setEndPoint(null);
    dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
  };
  const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position) return;
    const newPosition = adjustPosition(
      position,
      currentAnnotationFile?.width,
      currentAnnotationFile?.height
    );
    if (!startPoint) {
      setStartPoint({ ...newPosition });
      dispatch(changeCurrentDrawState({ drawState: DrawState.DRAWING }));
      e.evt.preventDefault();
      e.evt.stopPropagation();
    } else {
      setEndPoint(newPosition);
      handleMouseUp();
    }
  };
  const layer = useRef<Konva.Layer | null>(null);
  useEffect(() => {
    layer.current?.moveToTop();
  }, []);
  const handleMouseUp = () => {
    if (startPoint && endPoint) {
      const ellipse = createEllipse({
        x: (startPoint.x + endPoint.x) / 2,
        y: (startPoint.y + endPoint.y) / 2,
      });
      const spec = ellipse.data as EllipseSpec;
      dispatch(
        createDrawObject({
          drawObject: {
            type: DrawType.ELLIPSE,
            data: {
              ...spec,
              radiusX: Math.abs(endPoint.x - startPoint.x) / 2,
              radiusY: Math.abs(endPoint.y - startPoint.y) / 2,
            } as EllipseSpec,
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
        <Ellipse
          x={(startPoint.x + endPoint.x) / 2}
          y={(startPoint.y + endPoint.y) / 2}
          radiusX={Math.abs(endPoint.x - startPoint.x) / 2}
          radiusY={Math.abs(endPoint.y - startPoint.y) / 2}
          {...LINE_STYLE}
        />
      )}
    </Layer>
  );
}
export default EllipseDrawLayer;
