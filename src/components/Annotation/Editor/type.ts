import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { convertStrokeColorToFillColor } from "routes/AnnotationPage/LabelAnnotation/ClassLabel";
import { LINE_STYLE } from "./const";

export interface RectangleSpec {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label: Label;
  cssStyle: CssStyle;
}
export interface LabelClassProperties {
  cssStyle: Partial<CssStyle>;
  label: Label;
}
export interface LabelAttribute {
  key: string;
  value: string;
}
export interface Label {
  label: string;
  attributes?: LabelAttribute[];
}
export interface PolygonSpec {
  id: string;
  points: Vector2d[];
  polygonState: PolygonState;
  label: Label;
  cssStyle: CssStyle;
}
export interface EllipseSpec {
  id: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  label: Label;
  rotation: number;
  cssStyle: CssStyle;
}

export interface CssStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface PolygonState {
  isFinished: boolean;
  mousePosition?: Vector2d;
  isLineStrip?: boolean;
  isOverFirstPoint?: boolean;
}
export interface ScaleResult {
  newPosition: Vector2d;
  newScale: number;
}
export const initialLabelClassPropertiesByLabelClass: Record<
  string,
  LabelClassProperties
> = {
  house: {
    cssStyle: {
      fill: convertStrokeColorToFillColor("#affaaa"),
      stroke: "#affaaa",
    },
    label: {
      label: "house",
      attributes: [
        // { key: "key1", value: "value1" },
        // { key: "key2", value: "value2" },
      ],
    },
  },
  tree: {
    cssStyle: {
      fill: convertStrokeColorToFillColor("#ff1111"),
      stroke: "#ff1111",
    },
    label: { label: "tree" },
  },
  car: {
    cssStyle: {
      fill: convertStrokeColorToFillColor("#ff1aaa"),
      stroke: "#ff1aaa",
    },
    label: { label: "car" },
  },
};
export const initialRectangles: Record<string, RectangleSpec> = {
  RETANGLE_1: {
    x: 10,
    y: 10,
    rotation: 0,
    width: 100,
    height: 100,
    id: "RETANGLE_1",
    label: initialLabelClassPropertiesByLabelClass["house"].label,
    cssStyle: { ...LINE_STYLE },
  },
  RETANGLE_2: {
    x: 150,
    y: 150,
    rotation: 0,
    width: 100,
    height: 100,
    id: "RETANGLE_2",
    label: initialLabelClassPropertiesByLabelClass["car"].label,
    cssStyle: { ...LINE_STYLE },
  },
};
export const initialPolygons: Record<string, PolygonSpec> = {
  polygon1: {
    points: [
      { x: 560, y: 288 },
      { x: 825, y: 279 },
      { x: 714, y: 501 },
    ],
    polygonState: {
      isFinished: true,
    },
    id: "POLYGON_1",
    label: initialLabelClassPropertiesByLabelClass["tree"].label,
    cssStyle: { ...LINE_STYLE },
  },
};
export const initialLineStrips: Record<string, PolygonSpec> = {
  linestrip1: {
    points: [
      { x: 360, y: 288 },
      { x: 325, y: 279 },
      { x: 514, y: 501 },
      { x: 414, y: 401 },
    ],
    polygonState: {
      isFinished: true,
      isLineStrip: true,
    },
    id: "LINESTRIP_1",
    label: initialLabelClassPropertiesByLabelClass["car"].label,
    cssStyle: { ...LINE_STYLE },
  },
};
export const initialEllipses: Record<string, EllipseSpec> = {
  ellipse1: {
    radiusX: 150,
    radiusY: 200,
    x: 300,
    y: 300,
    rotation: 0,
    id: "ELLIPSE_1",
    label: initialLabelClassPropertiesByLabelClass["house"].label,
    cssStyle: { ...LINE_STYLE },
  },
};
export interface RectangleProps {
  id: string;
  onMouseOverHandler: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOutHandler: (e: KonvaEventObject<MouseEvent>) => void;
}
export interface PolygonProps {
  id: string;
  onMouseOverHandler: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOutHandler: (e: KonvaEventObject<MouseEvent>) => void;
}
export interface EllipseProps {
  id: string;
  onMouseOverHandler: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOutHandler: (e: KonvaEventObject<MouseEvent>) => void;
}
export type DrawObjectType = RectangleSpec | PolygonSpec | EllipseSpec;
