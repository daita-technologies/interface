import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Layer, Rect } from "react-konva";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";
import { setDetectedArea } from "reduxes/annotation/action";
import { selectorMouseUpOutLayerPosition } from "reduxes/annotation/selector";
import { DetectedAreaType } from "reduxes/annotation/type";
import { convertStrokeColorToFillColor } from "routes/AnnotationPage/LabelAnnotation/ClassLabel";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selecetor";
import { Vector2d } from "konva/lib/types";

function DetectedRectangleDrawLayer() {
  const dispatch = useDispatch();
  const refDetectedArea = useRef<Konva.Rect | null>(null);
  const [localDetectedArea, setLocalDetectedArea] =
    useState<DetectedAreaType | null>(null);
  const mouseUpOutLayerPosition = useSelector(selectorMouseUpOutLayerPosition);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);

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

  const updateMousePosition = (position: Vector2d) => {
    if (position && currentAnnotationFile) {
      if (localDetectedArea) {
        let { x, y } = position;
        if (x < 0) {
          x = 0;
        }
        if (currentAnnotationFile.width && x > currentAnnotationFile.width) {
          x = currentAnnotationFile.width;
        }
        if (y < 0) {
          y = 0;
        }
        if (currentAnnotationFile.height && y > currentAnnotationFile.height) {
          y = currentAnnotationFile.height;
        }
        setLocalDetectedArea({
          ...localDetectedArea,
          width: x - localDetectedArea.x,
          height: y - localDetectedArea.y,
        });
      }
    }
  };
  const handleMouseOut = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    updateMousePosition(position);
  };
  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    updateMousePosition(position);
  };
  const mouseupHandler = () => {
    if (localDetectedArea && refDetectedArea.current) {
      dispatch(
        setDetectedArea({
          detectedArea: { ...refDetectedArea.current.getClientRect() },
          scale: refDetectedArea.current.getAbsoluteScale(),
        })
      );
    }
    setLocalDetectedArea(null);
  };
  const layer = useRef<Konva.Layer | null>(null);
  useEffect(() => {
    layer.current?.moveToTop();
  }, []);
  const renderDummyRect = () => {
    if (currentAnnotationFile) {
      const { width, height } = currentAnnotationFile;
      return <Rect width={width} height={height} />;
    }
    return null;
  };
  useEffect(() => {
    if (mouseUpOutLayerPosition) {
      mouseupHandler();
    }
  }, [mouseUpOutLayerPosition]);
  return (
    <Layer
      ref={layer}
      onMouseMove={mousemoveHandler}
      onMouseDown={mousedownHandler}
      onMouseUp={mouseupHandler}
      onMouseOut={handleMouseOut}
    >
      {renderDummyRect()}
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
}
export default DetectedRectangleDrawLayer;
