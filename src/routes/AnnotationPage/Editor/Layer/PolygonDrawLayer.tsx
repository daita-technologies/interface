import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Circle, Group, Layer, Line, Rect } from "react-konva";

import {
  CIRCLE_STYLE,
  CORNER_RADIUS,
  STROKE_WIDTH_LINE,
} from "components/Annotation/Editor/const";
import { createPolygon } from "components/Annotation/Editor/Shape/Polygon";
import { CssStyle, PolygonSpec } from "components/Annotation/Editor/type";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentDrawState,
  createDrawObject,
} from "reduxes/annotation/action";
import {
  selectorCurrentDrawType,
  selectorKeyDownInEditor,
} from "reduxes/annotation/selector";
import { DrawState, DrawType } from "reduxes/annotation/type";
import { selectorCurrentAnnotationFile } from "reduxes/annotationmanager/selector";
import { convertStrokeColorToFillColor } from "routes/AnnotationPage/LabelAnnotation/ClassLabel";
import { DrawLayerProps } from "./type";
import { adjustPosition } from "./utils";
import { FULL_PADDING_VALUE } from "routes/AnnotationPage/constants";

function PolygonDrawLayer({
  drawLayerProps: { paddingLeft, paddingTop },
}: {
  drawLayerProps: DrawLayerProps;
}) {
  const dispatch = useDispatch();
  const isLineStrip =
    useSelector(selectorCurrentDrawType) === DrawType.LINE_STRIP;
  const [flattenedPoints, setFlattenedPoints] = useState<number[]>([]);
  const [lineStyle] = useState<CssStyle>({
    fill: convertStrokeColorToFillColor("#affaaa"),
    stroke: "#affaaa",
    strokeWidth: STROKE_WIDTH_LINE,
  });
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [points, setPoints] = useState<Vector2d[]>([]);
  const [mousePosition, setMousePosition] = useState<Vector2d | null>(null);
  const [mouseOverPoint, setMouseOverPoint] = useState(false);
  const layer = useRef<Konva.Layer | null>(null);
  const currentAnnotationFile = useSelector(selectorCurrentAnnotationFile);
  const keyDownInEditor = useSelector(selectorKeyDownInEditor);
  const resetDraw = () => {
    setPoints([]);
    setIsFinished(false);
    setMousePosition(null);
    setMouseOverPoint(false);
    setFlattenedPoints([]);
  };
  const mousemoveHandler = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position) return;
    setMousePosition(
      adjustPosition(
        position,
        currentAnnotationFile?.width,
        currentAnnotationFile?.height
      )
    );
  };
  const handleMouseDownPoint = (e: KonvaEventObject<DragEvent>) => {
    if (mouseOverPoint) {
      setIsFinished(true);
      const polygon = createPolygon({ x: 0, y: 0 }, isLineStrip);
      const spec = polygon.data as PolygonSpec;
      dispatch(
        createDrawObject({
          drawObject: {
            type: isLineStrip ? DrawType.LINE_STRIP : DrawType.POLYGON,
            data: {
              ...spec,
              points: [...points],
              polygonState: { ...spec.polygonState, isFinished: true },
            } as PolygonSpec,
          },
        })
      );
      dispatch(changeCurrentDrawState({ drawState: DrawState.FREE }));
      resetDraw();
    }
    e.cancelBubble = true;
  };

  const handleMouseOverStartPoint = (e: KonvaEventObject<DragEvent>) => {
    if (isFinished || points.length < 3) return;
    e.target.scale({ x: 2, y: 2 });
    setMouseOverPoint(true);
  };
  const handleMouseOverStartPointLineStrip = (
    e: KonvaEventObject<DragEvent>
  ) => {
    if (isFinished || points.length < 2) return;
    e.target.scale({ x: 3, y: 3 });
    setMouseOverPoint(true);
  };
  const handleMouseOutStartPointWhenFinished = (
    e: KonvaEventObject<DragEvent>
  ) => {
    if (isFinished) {
      e.target.scale({ x: 1, y: 1 });
    }
  };
  const handleMouseOutStartPoint = (e: KonvaEventObject<DragEvent>) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };
  const handleMouseOverStartPointWhenFinished = (
    e: KonvaEventObject<DragEvent>
  ) => {
    if (isFinished) {
      e.target.scale({ x: 2, y: 2 });
    }
  };
  const renderPoints = () =>
    points.map((point, index) => {
      const x = point.x - CORNER_RADIUS / 2;
      const y = point.y - CORNER_RADIUS / 2;
      let startPointAttr;
      startPointAttr =
        (isLineStrip === true && index === points.length - 1) ||
        (isLineStrip !== true && index === 0 && !isFinished)
          ? {
              hitStrokeWidth: 12,
              onMouseOver: handleMouseOverStartPointLineStrip,
              onMouseOut: handleMouseOutStartPoint,
              onMouseDown: handleMouseDownPoint,
            }
          : {
              onMouseOver: handleMouseOverStartPointWhenFinished,
              onMouseOut: handleMouseOutStartPointWhenFinished,
            };

      return (
        <Circle
          key={index}
          x={x}
          y={y}
          radius={CORNER_RADIUS * 1.5}
          {...CIRCLE_STYLE}
          {...startPointAttr}
        />
      );
    });
  const mousedownHandler = (e?: KonvaEventObject<MouseEvent>) => {
    if (mousePosition) {
      setPoints([...points, mousePosition]);
      dispatch(changeCurrentDrawState({ drawState: DrawState.DRAWING }));
      if (e) {
        e.evt.preventDefault();
        e.evt.stopPropagation();
      }
    }
  };
  useEffect(() => {
    layer.current?.moveToTop();
  }, []);
  const handleMouseOut = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    if (!position) return;
    // console.log("position", position);
    if (position.x < 0) {
      position.x = 0;
    }
    if (position.y < 0) {
      position.y = 0;
    }
    // console.log("set position", position);
    setMousePosition(position);
  };
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

  useEffect(() => {
    const flatPoints: number[] = points
      .concat(isFinished || !mousePosition ? [] : mousePosition)
      .reduce((a, b) => a.concat([b.x, b.y]), [] as number[]);
    setFlattenedPoints(flatPoints);
  }, [points, isFinished, mousePosition]);
  useEffect(() => {
    if (keyDownInEditor === "Escape") {
      resetDraw();
    }
  }, [keyDownInEditor]);
  return (
    <Layer
      ref={layer}
      x={paddingLeft}
      y={paddingTop}
      onMouseMove={mousemoveHandler}
      onMouseOut={handleMouseOut}
      onMouseDown={mousedownHandler}
      // onKeyDown={keyDownHandler}
    >
      {renderDummyRect()}
      <Group>
        <Line
          points={flattenedPoints}
          closed={isFinished && isLineStrip !== true}
          {...lineStyle}
          strokeScaleEnabled={false}
        />
        {renderPoints()}
      </Group>
    </Layer>
  );
}
export default PolygonDrawLayer;
