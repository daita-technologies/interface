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

      if (y - box.height / 2 < 0) y = box.height / 2;
      if (x - box.width / 2 < 0) x = box.width / 2;
      if (y + box.height / 2 > sh) y = sh - box.height / 2;
      if (x + box.width / 2 > sw) x = sw - box.width / 2;
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

    let radiusX = (node.width() * node.scaleX()) / 2.0;
    let radiusY = (node.height() * node.scaleY()) / 2.0;

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
        strokeScaleEnabled={false}
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
          ignoreStroke={true}
          boundBoxFunc={boundBoxFunc}
        />
      )}
    </React.Fragment>
  );
};
export default EllipseShape;
