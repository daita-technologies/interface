import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

export interface RectangleSpec {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
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
export interface PolygonState {
  isFinished: boolean;
  mousePosition?: Vector2d;
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
    width: 100,
    height: 100,
    fill: "#8c1eff5c",
    stroke: "#00F1FF",
    strokeWidth: 3,
    id: "RETANGLE_1",
    label: { label: "RETANGLE_1" },
  },
  RETANGLE_2: {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "#8c1eff5c",
    stroke: "#00F1FF",
    strokeWidth: 3,
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
export interface RectangleProps {
  rectangleSpec: RectangleSpec;
  onMouseOverHandler: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOutHandler: (e: KonvaEventObject<MouseEvent>) => void;
}
export interface PolygonProps {
  polygon: PolygonSpec;
  onMouseOverHandler: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOutHandler: (e: KonvaEventObject<MouseEvent>) => void;
}
export type DrawObjectType = RectangleSpec | PolygonSpec;
