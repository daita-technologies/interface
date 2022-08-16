import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { CIRCLE_STYLE, LINE_STYLE } from "./const";

export interface RectangleSpec {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation: number;
  label: Label;
}
export interface Label {
  label: string;
}
export interface PolygonSpec {
  id: string;
  points: Vector2d[];
  polygonState: PolygonState;
  label: Label;
}
export interface EllipseSpec {
  id: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  label: Label;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation: number;
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
export const initialRectangles: Record<string, RectangleSpec> = {
  RETANGLE_1: {
    x: 10,
    y: 10,
    rotation: 0,
    width: 100,
    height: 100,
    ...LINE_STYLE,
    id: "RETANGLE_1",
    label: { label: "RETANGLE_1" },
  },
  RETANGLE_2: {
    x: 150,
    y: 150,
    rotation: 0,
    width: 100,
    height: 100,
    ...LINE_STYLE,
    id: "RETANGLE_2",
    label: { label: "RETANGLE_2" },
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
    label: { label: "POLYGON_1" },
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
    label: { label: "LINESTRIP_1" },
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
    label: { label: "ELLIPSE_1" },
    ...LINE_STYLE,
  },
};
export interface RectangleProps {
  spec: RectangleSpec;
  onMouseOverHandler: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOutHandler: (e: KonvaEventObject<MouseEvent>) => void;
}
export interface PolygonProps {
  spec: PolygonSpec;
  onMouseOverHandler: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOutHandler: (e: KonvaEventObject<MouseEvent>) => void;
}
export interface EllipseProps {
  spec: EllipseSpec;
  onMouseOverHandler: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOutHandler: (e: KonvaEventObject<MouseEvent>) => void;
}
export type DrawObjectType = RectangleSpec | PolygonSpec | EllipseSpec;
