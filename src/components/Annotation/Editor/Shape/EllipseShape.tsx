import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Box } from "konva/lib/shapes/Transformer";
import { Vector2d } from "konva/lib/types";
import React, { useEffect, useMemo, useState } from "react";
import { Ellipse, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { updateDrawObject } from "reduxes/annotation/action";
import {
  selectorCurrentDrawState,
  selectorDrawObject,
  selectorDrawObjectState,
  selectorSelectedEllipse,
} from "reduxes/annotation/selector";
import { DrawObject, DrawState, DrawType } from "reduxes/annotation/type";
import { selectorCurrentImageInEditorProps } from "reduxes/annotationmanager/selector";
import { CIRCLE_STYLE, CORNER_RADIUS, LINE_STYLE } from "../const";
import { EllipseCompProps, EllipseProps, EllipseSpec } from "../type";
import useCommonShapeEvent from "../useCommonShapeEvent";

export const createEllipse = (position: {
  x: number;
  y: number;
}): DrawObject => {
  const id = `ELLIPSE-${Math.floor(Math.random() * 100000)}`;
  const shape: EllipseSpec = {
    x: position.x,
    y: position.y,
    radiusX: 1,
    radiusY: 1,
    rotation: 0,
    id,
    label: { label: id },
    cssStyle: { ...LINE_STYLE },
  };
  return { type: DrawType.ELLIPSE, data: shape };
};

function EllipseComp({
  spec,
  onMouseOverHandler,
  onMouseOutHandler,
}: EllipseCompProps) {
  const shapeRef = React.useRef<Konva.Ellipse>(null);
  const trRef = React.useRef<any>(null);
  const dispatch = useDispatch();
  const currentShape = useSelector(selectorSelectedEllipse);
  const commonShapeEvent = useCommonShapeEvent({ drawObject: spec });
  const currentDrawState = useSelector(selectorCurrentDrawState);
  const drawObjectState = useSelector(selectorDrawObjectState(spec.id));
  const currentImageInEditorProps = useSelector(
    selectorCurrentImageInEditorProps
  );
  const [strokeWidth, setStrokeWidth] = useState<number>(
    spec.cssStyle.strokeWidth
  );

  const isSelected = useMemo(
    () => currentShape != null && spec.id === currentShape.id,
    [currentShape?.id]
  );
  useEffect(() => {
    if (isSelected === true) {
      shapeRef.current?.moveToTop();
    }
  }, [isSelected]);
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

  const groupDragBound = (pos: Vector2d) => {
    let { x, y } = pos;
    if (shapeRef && shapeRef.current && currentImageInEditorProps) {
      const { clientRectOfBaseImage } = currentImageInEditorProps;
      const box = shapeRef.current.getClientRect();

      if (clientRectOfBaseImage) {
        if (x - box.width / 2 < clientRectOfBaseImage.x) {
          x = clientRectOfBaseImage.x + box.width / 2;
        }
        if (y - box.height / 2 < clientRectOfBaseImage.y) {
          y = clientRectOfBaseImage.y + box.height / 2;
        }
        if (
          x + box.width >
          clientRectOfBaseImage.x + clientRectOfBaseImage.width
        ) {
          x =
            clientRectOfBaseImage.x +
            clientRectOfBaseImage.width -
            box.width / 2;
        }
        if (
          y + box.height >
          clientRectOfBaseImage.y + clientRectOfBaseImage.height
        ) {
          y =
            clientRectOfBaseImage.y +
            clientRectOfBaseImage.height -
            box.height / 2;
        }
      }
    }

    return {
      x,
      y,
    };
  };
  // const groupDragBound = (pos: Vector2d) => {
  //   let { x, y } = pos;
  //   const sw = stage ? stage.width() : 0;
  //   const sh = stage ? stage.height() : 0;
  //   if (shapeRef && shapeRef.current) {
  //     const box = shapeRef.current.getClientRect();

  //     if (y - box.height / 2 < 0) y = box.height / 2;
  //     if (x - box.width / 2 < 0) x = box.width / 2;
  //     if (y + box.height / 2 > sh) y = sh - box.height / 2;
  //     if (x + box.width / 2 > sw) x = sw - box.width / 2;
  //     return { x, y };
  //   }
  //   return { x: 0, y: 0 };
  // };

  const handleTransformEnd = (e: KonvaEventObject<Event>) => {
    const node = shapeRef.current;
    if (!node) return;
    const radiusX = (node.width() * node.scaleX()) / 2.0;
    const radiusY = (node.height() * node.scaleY()) / 2.0;
    onChange({
      ...spec,
      x: node.x(),
      y: node.y(),
      rotation: node.attrs.rotation,
      radiusX,
      radiusY,
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
  const onMouseOver = (e: KonvaEventObject<MouseEvent>) => {
    if (currentDrawState !== DrawState.DRAWING) {
      setStrokeWidth(spec.cssStyle.strokeWidth * 2);
    }
    onMouseOverHandler(e);
  };
  const onMouseOut = (e: KonvaEventObject<MouseEvent>) => {
    setStrokeWidth(spec.cssStyle.strokeWidth);
    onMouseOutHandler(e);
  };

  return (
    <>
      <Ellipse
        ref={shapeRef}
        dragBoundFunc={groupDragBound}
        onClick={commonShapeEvent.handleCick}
        onMouseDown={commonShapeEvent.handleSelect}
        onTransformStart={commonShapeEvent.handleTransformStart}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        draggable={commonShapeEvent.isLock !== true}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        strokeScaleEnabled={false}
        {...spec}
        {...spec.cssStyle}
        strokeWidth={strokeWidth}
        visible={drawObjectState ? !drawObjectState.isHidden : true}
        onMouseEnter={commonShapeEvent.handleMouseEnter}
        onMouseLeave={commonShapeEvent.handleMouseLeave}
      />
      {isSelected && commonShapeEvent.isLock !== true && (
        <Transformer
          ref={trRef}
          anchorFill={CIRCLE_STYLE.fill}
          anchorCornerRadius={CORNER_RADIUS}
          anchorStrokeWidth={CIRCLE_STYLE.strokeWidth}
          anchorStroke={CIRCLE_STYLE.stroke}
          anchorSize={CORNER_RADIUS * 1.8}
          ignoreStroke
          boundBoxFunc={boundBoxFunc}
        />
      )}
    </>
  );
}
function EllipseShape({
  id,
  onMouseOverHandler,
  onMouseOutHandler,
}: EllipseProps) {
  const drawObject = useSelector(selectorDrawObject(id));
  if (drawObject) {
    return (
      <EllipseComp
        spec={drawObject.data as EllipseSpec}
        onMouseOutHandler={onMouseOutHandler}
        onMouseOverHandler={onMouseOverHandler}
      />
    );
  }
  return null;
}
export default EllipseShape;
