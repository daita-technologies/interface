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
import { selectorMouseUpOutLayerPosition } from "reduxes/annotation/selector";
import { DrawState, DrawType } from "reduxes/annotation/type";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selecetor";

function RectangleDrawLayer() {
  const dispatch = useDispatch();
  const [startPoint, setStartPoint] = useState<Vector2d | null>(null);
  const [endPoint, setEndPoint] = useState<Vector2d | null>(null);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  const mouseUpOutLayerPosition = useSelector(selectorMouseUpOutLayerPosition);

  const updateMousePosition = (position: Vector2d) => {
    if (!position || !startPoint) return;
    let { x, y } = position;
    if (x < 0) {
      x = 0;
    }
    if (
      currentAnnotationFile?.width &&
      position.x > currentAnnotationFile?.width
    ) {
      x = currentAnnotationFile?.width;
    }
    if (y < 0) {
      y = 0;
    }
    if (currentAnnotationFile?.height && y > currentAnnotationFile?.height) {
      y = currentAnnotationFile?.height;
    }
    setEndPoint({ x, y });
  };

  const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position) return;
    setStartPoint({ ...position });
    dispatch(changeCurrentDrawState({ drawState: DrawState.DRAWING }));
    e.evt.preventDefault();
    e.evt.stopPropagation();
  };
  const layer = useRef<Konva.Layer | null>(null);
  useEffect(() => {
    layer.current?.moveToTop();
  }, []);
  const handleMouseUp = () => {
    if (startPoint && endPoint) {
      let rect;
      if (startPoint.x < endPoint.x) {
        rect = createRectangle(startPoint);
      } else {
        rect = createRectangle(endPoint);
      }
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
    setStartPoint(null);
    setEndPoint(null);
    dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
  };

  const handleMouseOut = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    updateMousePosition(position);
  };
  const renderDummyRect = () => {
    if (currentAnnotationFile) {
      const { width, height } = currentAnnotationFile;
      return <Rect width={width} height={height} />;
    }
    return null;
  };
  useEffect(() => {
    if (mouseUpOutLayerPosition) {
      handleMouseUp();
    }
  }, [mouseUpOutLayerPosition]);

  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    updateMousePosition(position);
  };
  return (
    <Layer
      ref={layer}
      onMouseMove={mousemoveHandler}
      onMouseDown={mousedownHandler}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
    >
      {renderDummyRect()}
      {startPoint && endPoint && (
        <Rect
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
