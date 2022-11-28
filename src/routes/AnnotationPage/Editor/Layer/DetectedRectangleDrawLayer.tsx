import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef, useState } from "react";
import { Layer, Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentDrawState,
  setDetectedArea,
} from "reduxes/annotation/action";
import { DetectedAreaType, DrawState } from "reduxes/annotation/type";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selector";
import { FULL_PADDING_VALUE } from "routes/AnnotationPage/constants";
import { convertStrokeColorToFillColor } from "routes/AnnotationPage/LabelAnnotation/ClassLabel";
import { DrawLayerProps } from "./type";
import { adjustPosition } from "./utils";

function DetectedRectangleDrawLayer({
  drawLayerProps: { paddingLeft, paddingTop },
}: {
  drawLayerProps: DrawLayerProps;
}) {
  const dispatch = useDispatch();
  const refDetectedArea = useRef<Konva.Rect | null>(null);
  const [localDetectedArea, setLocalDetectedArea] =
    useState<DetectedAreaType | null>(null);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);

  const mousedownHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    const newPosition = adjustPosition(
      position,
      currentAnnotationFile?.width,
      currentAnnotationFile?.height
    );
    setLocalDetectedArea({
      x: newPosition.x,
      y: newPosition.y,
      width: 3,
      height: 3,
    });
    dispatch(changeCurrentDrawState({ drawState: DrawState.DRAWING }));
    e.evt.preventDefault();
    e.evt.stopPropagation();
  };
  const updateMousePosition = (position: Vector2d) => {
    if (position && currentAnnotationFile) {
      if (localDetectedArea) {
        setLocalDetectedArea({
          ...localDetectedArea,
          width: position.x - localDetectedArea.x,
          height: position.y - localDetectedArea.y,
        });
      }
    }
  };

  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    updateMousePosition(
      adjustPosition(
        position,
        currentAnnotationFile?.width,
        currentAnnotationFile?.height
      )
    );
  };
  const resetDraw = () => {
    setLocalDetectedArea(null);
    dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
  };
  const mouseupHandler = () => {
    if (localDetectedArea && refDetectedArea.current) {
      dispatch(
        setDetectedArea({
          detectedArea: { ...localDetectedArea },
        })
      );
    }
    resetDraw();
  };
  const layer = useRef<Konva.Layer | null>(null);
  useEffect(() => {
    layer.current?.moveToTop();
  }, []);
  const renderDummyRect = () => {
    if (currentAnnotationFile) {
      return (
        <Rect
          x={-FULL_PADDING_VALUE}
          y={-FULL_PADDING_VALUE}
          width={2 * FULL_PADDING_VALUE}
          height={2 * FULL_PADDING_VALUE}
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
      onMouseUp={mouseupHandler}
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
