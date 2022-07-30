import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Box } from "konva/lib/shapes/Transformer";
import { Vector2d } from "konva/lib/types";
import React, { useMemo, useState } from "react";
import { Ellipse, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { updateDrawObject } from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
  selectorSelectedEllipse,
} from "reduxes/annotation/selector";
import { CIRCLE_STYLE, CORNER_RADIUS } from "../const";
import { EllipseProps, EllipseSpec } from "../type";
import useCommonShapeEvent from "../useCommonShapeEvent";

const EllipseShape = function ({
  spec,
  onMouseOverHandler,
  onMouseOutHandler,
}: EllipseProps) {
  const shapeRef = React.useRef<Konva.Ellipse>(null);
  const trRef = React.useRef<any>(null);
  const dispatch = useDispatch();
  const currentShape = useSelector(selectorSelectedEllipse);
  const commonShapeEvent = useCommonShapeEvent({ drawObject: spec });

  const isSelected = useMemo(() => {
    return currentShape != null && spec.id === currentShape.id;
  }, [currentShape?.id]);
  const onChange = (rect: EllipseSpec) => {
    dispatch(
      updateDrawObject({
        data: { ...rect },
      })
    );
  };
  React.useEffect(() => {
    if (isSelected) {
      if (!trRef.current) return;
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  const [stage, setStage] = useState<Konva.Stage | null>(null);

  const groupDragBound = (pos: Vector2d) => {
    let { x, y } = pos;
    const sw = stage ? stage.width() : 0;
    const sh = stage ? stage.height() : 0;
    if (shapeRef && shapeRef.current) {
      const box = shapeRef.current.getClientRect();
      const minMaxX = [0, box.width];
      const minMaxY = [0, box.height];

      if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
      if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
      if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
      if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
      return { x, y };
    }
    return { x: 0, y: 0 };
  };

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    setStage(e.target.getStage());
    commonShapeEvent.handleDragStart(e);
  };
  const handleTransformEnd = (e: KonvaEventObject<Event>) => {
    const node = shapeRef.current;
    if (!node) return;

    let radiusX = Math.floor((node.width() * node.scaleX()) / 2);
    let radiusY = Math.floor((node.height() * node.scaleY()) / 2);

    onChange({
      ...spec,
      x: node.x(),
      y: node.y(),
      rotation: node.attrs.rotation,
      radiusX: radiusX,
      radiusY: radiusY,
    });
    node.scale({ x: 1, y: 1 });
    commonShapeEvent.handleTransformEnd(e);
  };
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...spec,
      x: e.target.x(),
      y: e.target.y(),
    });
    commonShapeEvent.handleDragEnd(e);
  };
  const boundBoxFunc = (oldBox: Box, newBox: Box) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  };
  return (
    <React.Fragment>
      <Ellipse
        ref={shapeRef}
        dragBoundFunc={groupDragBound}
        onClick={commonShapeEvent.handleCick}
        onMouseDown={commonShapeEvent.handleSelect}
        onTransformStart={commonShapeEvent.handleTransformStart}
        onMouseOver={onMouseOverHandler}
        onMouseOut={onMouseOutHandler}
        draggable
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onTransformEnd={handleTransformEnd}
        {...spec}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          anchorFill={CIRCLE_STYLE.fill}
          anchorCornerRadius={CORNER_RADIUS}
          anchorStrokeWidth={CIRCLE_STYLE.strokeWidth}
          anchorStroke={CIRCLE_STYLE.stroke}
          anchorSize={CORNER_RADIUS * 1.8}
          boundBoxFunc={boundBoxFunc}
        />
      )}
    </React.Fragment>
  );
};
export default EllipseShape;
