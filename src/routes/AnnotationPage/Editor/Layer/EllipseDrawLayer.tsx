import { LINE_STYLE } from "components/Annotation/Editor/const";
import { EllipseSpec } from "components/Annotation/Editor/type";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef, useState } from "react";
import { Ellipse, Layer, Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { createDrawObject } from "reduxes/annotation/action";
import { DrawType } from "reduxes/annotation/type";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selecetor";
import { createEllipse } from "../Hook/useElipseEvent";

const EllipseDrawLayer = () => {
  const dispatch = useDispatch();
  const [startPoint, setStartPoint] = useState<Vector2d | null>(null);
  const [endPoint, setEndPoint] = useState<Vector2d | null>(null);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);

  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position || !startPoint) return;
    setEndPoint({ ...position });
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
    setStartPoint(null);
    setEndPoint(null);
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
};
export default EllipseDrawLayer;
