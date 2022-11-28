import {
  EllipseSpec,
  PolygonSpec,
  RectangleSpec,
} from "components/Annotation/Editor/type";
import { DrawObject } from "reduxes/annotation/type";
import { AnnotationImagesProperty } from "reduxes/annotationmanager/type";

export interface Annotation {
  coordinates: number[][];
  category_id: number;
}
export type ShapeSpec = RectangleShape | PolygonShape | EllipseShape;
export enum ShapeType {
  RECTANGLE,
  POLYGON,
  ELLIPSE,
  LINE_STRIP,
}
export interface Shape {
  shapeSpec: ShapeSpec;
  shapeType: ShapeType;
  categoryId: string;
}
export type RectangleShape = Pick<
  RectangleSpec,
  "width" | "height" | "x" | "y"
>;
export type EllipseShape = Pick<EllipseSpec, "radiusX" | "radiusY" | "x" | "y">;
export type PolygonShape = Pick<PolygonSpec, "points">;
export interface AnnotationDaitaFormatter {
  shapes: Shape[];
}
export interface AnnotationFormatter {
  image_path: string;
  annotations: Annotation[];
}
export interface FileAndAnnotationImportInfo {
  annotationImagesProperty: AnnotationImagesProperty | null;
  drawObjectById: Record<string, DrawObject>;
}
export interface AnnotationImportInfo {
  drawObjectById: Record<string, DrawObject>;
}
export const ID_2_LABEL_DAITA: Record<number, string> = {
  0: "background",
  1: "road",
  2: "sidewalk",
  3: "building",
  4: "wall",
  5: "fence",
  6: "pole",
  7: "traffic light",
  8: "traffic sign",
  9: "vegetation",
  10: "terrain",
  11: "sky",
  12: "person",
  13: "rider",
  14: "car",
  15: "truck",
  16: "bus",
  17: "train",
  18: "motorcycle",
  19: "bicycle",
};
export const LABEL_2_ID_DAITA: Record<string, number> = (() => {
  const temp: Record<string, number> = {};
  Object.entries(ID_2_LABEL_DAITA).forEach(([key, value]) => {
    temp[value] = parseInt(key, 10);
  });
  return temp;
})();
