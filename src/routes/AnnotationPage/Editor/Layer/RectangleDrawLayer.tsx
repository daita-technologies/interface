import { LINE_STYLE } from "components/Annotation/Editor/const";
import { RectangleSpec } from "components/Annotation/Editor/type";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef, useState } from "react";
import { Layer, Rect } from "react-konva";
import { useDispatch } from "react-redux";
import { createDrawObject } from "reduxes/annotation/action";
import { DrawType } from "reduxes/annotation/type";
import { createRectangle } from "../Hook/useRectangleEvent";
import DummyRect from "./DummyRect";

const RectangleDrawLayer = () => {
  const dispatch = useDispatch();

  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position || !startPoint) return;
    const newWidth = position.x - startPoint.x;
    const newHeight = position.y - startPoint.y;
    setWidth(newWidth);
    setHeight(newHeight);
  };

  const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position) return;
    setStartPoint({ ...position });
  };
  const layer = useRef<Konva.Layer | null>(null);
  useEffect(() => {
    layer.current?.moveToTop();
  }, []);
  const handleMouseUp = () => {
    if (startPoint) {
      const rect = createRectangle(startPoint);
      const spec = rect.data as RectangleSpec;
      dispatch(
        createDrawObject({
          drawObject: {
            type: DrawType.RECTANGLE,
            data: {
              ...spec,
              width,
              height,
            } as RectangleSpec,
          },
        })
      );
      setStartPoint(null);
      setWidth(0);
      setHeight(0);
    }
  };
  const [startPoint, setStartPoint] = useState<Vector2d | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  return (
    <Layer
      ref={layer}
      onMouseMove={mousemoveHandler}
      onMouseDown={mousedownHandler}
      onMouseUp={handleMouseUp}
    >
      <DummyRect parentLayer={layer.current} />
      {startPoint && (
        <Rect
          x={startPoint.x}
          y={startPoint.y}
          width={width}
          height={height}
          {...LINE_STYLE}
        />
      )}
    </Layer>
  );
};
export default RectangleDrawLayer;
