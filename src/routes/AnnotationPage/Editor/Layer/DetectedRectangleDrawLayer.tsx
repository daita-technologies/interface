import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Layer, Rect } from "react-konva";

import Konva from "konva";
import { useDispatch } from "react-redux";
import { setDetectedArea } from "reduxes/annotation/action";
import { DetectedAreaType } from "reduxes/annotation/type";
import { convertStrokeColorToFillColor } from "routes/AnnotationPage/LabelAnnotation/ClassLabel";
import DummyRect from "./DummyRect";

const DetectedRectangleDrawLayer = () => {
  const dispatch = useDispatch();
  const refDetectedArea = useRef<Konva.Rect | null>(null);
  const [localDetectedArea, setLocalDetectedArea] =
    useState<DetectedAreaType | null>(null);

  const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (position) {
      setLocalDetectedArea({
        x: position.x,
        y: position.y,
        width: 3,
        height: 3,
      });
    }
  };
  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (position) {
      if (localDetectedArea)
        setLocalDetectedArea({
          ...localDetectedArea,
          width: position.x - localDetectedArea.x,
          height: position.y - localDetectedArea.y,
        });
    }
  };
  const mouseupHandler = (e: KonvaEventObject<MouseEvent>) => {
    if (localDetectedArea && refDetectedArea.current) {
      dispatch(
        setDetectedArea({
          detectedArea: { ...refDetectedArea.current.getClientRect() },
        })
      );
    }
    setLocalDetectedArea(null);
  };
  const layer = useRef<Konva.Layer | null>(null);
  useEffect(() => {
    layer.current?.moveToTop();
  }, []);
  return (
    <Layer
      ref={layer}
      onMouseMove={mousemoveHandler}
      onMouseDown={mousedownHandler}
      onMouseUp={mouseupHandler}
    >
      <DummyRect parentLayer={layer.current} />
      {localDetectedArea && (
        <Rect
          ref={refDetectedArea}
          {...localDetectedArea}
          fill={convertStrokeColorToFillColor("#000000")}
          strokeWidth={4}
          stroke="#000000"
        />
      )}
    </Layer>
  );
};
export default DetectedRectangleDrawLayer;
