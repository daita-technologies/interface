import { LINE_STYLE } from "components/Annotation/Editor/const";
import { RectangleSpec } from "components/Annotation/Editor/type";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef, useState } from "react";
import { Layer, Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { createDrawObject } from "reduxes/annotation/action";
import {
  selectorMouseDownOutLayerPosition,
  selectorMouseUpOutLayerPosition,
} from "reduxes/annotation/selector";
import { DrawType } from "reduxes/annotation/type";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selecetor";
import { createRectangle } from "../Hook/useRectangleEvent";

const RectangleDrawLayer = () => {
  const dispatch = useDispatch();
  const [startPoint, setStartPoint] = useState<Vector2d | null>(null);
  const [endPoint, setEndPoint] = useState<Vector2d | null>(null);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  const mouseUpOutLayerPosition = useSelector(selectorMouseUpOutLayerPosition);
  useEffect(() => {
    if (mouseUpOutLayerPosition) {
      handleMouseUp();
    }
  }, [mouseUpOutLayerPosition]);

  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    updateMousePosition(position);
  };
  const updateMousePosition = (position: Vector2d) => {
    if (!position || !startPoint) return;
    if (position.x < 0) {
      position.x = 0;
    }
    if (
      currentAnnotationFile?.width &&
      position.x > currentAnnotationFile?.width
    ) {
      position.x = currentAnnotationFile?.width;
    }
    if (position.y < 0) {
      position.y = 0;
    }
    if (
      currentAnnotationFile?.height &&
      position.y > currentAnnotationFile?.height
    ) {
      position.y = currentAnnotationFile?.height;
    }

    setEndPoint({ ...position });
  };

  const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position) return;
    setStartPoint({ ...position });
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
};
export default RectangleDrawLayer;
