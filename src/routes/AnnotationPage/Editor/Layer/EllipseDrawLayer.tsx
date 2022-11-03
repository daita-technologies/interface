import { LINE_STYLE } from "components/Annotation/Editor/const";
import { EllipseSpec } from "components/Annotation/Editor/type";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef, useState } from "react";
import { Ellipse, Layer } from "react-konva";
import { useDispatch } from "react-redux";
import { createDrawObject } from "reduxes/annotation/action";
import { DrawType } from "reduxes/annotation/type";
import { createEllipse } from "../Hook/useElipseEvent";
import DummyRect from "./DummyRect";

const EllipseDrawLayer = () => {
  const dispatch = useDispatch();
  const [centerPoint, setCenterPoint] = useState<Vector2d | null>(null);
  const [radiusX, setRadiusX] = useState<number>(0);
  const [radiusY, setRadiusY] = useState<number>(0);

  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position || !centerPoint) return;
    setCenterPoint({
      x: (position.x + (centerPoint.x - radiusX)) / 2,
      y: (position.y + (centerPoint.y - radiusY)) / 2,
    });
    setRadiusX((position.x - (centerPoint.x - radiusX)) / 2.0);
    setRadiusY((position.y - (centerPoint.y - radiusY)) / 2.0);
  };

  const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position) return;
    setCenterPoint({ ...position });
  };
  const layer = useRef<Konva.Layer | null>(null);
  useEffect(() => {
    layer.current?.moveToTop();
  }, []);
  const handleMouseUp = () => {
    if (centerPoint) {
      const ellipse = createEllipse(centerPoint);
      const spec = ellipse.data as EllipseSpec;
      dispatch(
        createDrawObject({
          drawObject: {
            type: DrawType.ELLIPSE,
            data: {
              ...spec,
              radiusX,
              radiusY,
            } as EllipseSpec,
          },
        })
      );
      setCenterPoint(null);
      setRadiusX(0);
      setRadiusY(0);
    }
  };

  return (
    <Layer
      ref={layer}
      onMouseMove={mousemoveHandler}
      onMouseDown={mousedownHandler}
      onMouseUp={handleMouseUp}
    >
      <DummyRect />
      {centerPoint && (
        <Ellipse
          x={centerPoint.x}
          y={centerPoint.y}
          radiusX={radiusX}
          radiusY={radiusY}
          {...LINE_STYLE}
        />
      )}
    </Layer>
  );
};
export default EllipseDrawLayer;
