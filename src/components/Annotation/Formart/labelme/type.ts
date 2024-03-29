import { EllipseSpec } from "components/Annotation/Editor/type";
import { DrawObject } from "reduxes/annotation/type";
import { AnnotationImagesProperty } from "reduxes/annotationmanager/type";

export type RectangleFormatter = number[][];
export type PolygonFormatter = number[][];
export type CircleFormatter = number[][];
export type EllipseFormatter = EllipseSpec;

export type Points = RectangleFormatter | PolygonFormatter | EllipseFormatter;
export type ShapeType =
  | "rectangle"
  | "polygon"
  | "ellipse"
  | "circle"
  | "line"
  | "linestrip";
export interface Shape {
  points: Points;
  shape_type: ShapeType;
  label: string;
  group_id?: null;
  flags?: {};
}

export interface AnnotationFormatter {
  version: string;
  flags: {};
  imagePath: string;
  shapes: Shape[];
  imageData: string;
  imageHeight?: number;
  imageWidth?: number;
}
const convertBase64ToLabelMeFormat = (base64: string) => {
  const stripKey = "base64,";
  const indexOf = base64.indexOf(stripKey);
  const formatImageData = base64.substring(indexOf + stripKey.length);
  return formatImageData;
};
export const convertLabelMeFormatToBase64 = (imageData: string) =>
  `data:image/png;base64,${imageData}`;
export const createAnnotationFormatter = (
  shapes: Shape[],
  imageData: string
) => {
  const annotationFormatter: AnnotationFormatter = {
    version: "0.0.0.1",
    flags: {},
    imagePath: "Selection_052.png",
    shapes,
    imageData: convertBase64ToLabelMeFormat(imageData),
    imageHeight: 685,
    imageWidth: 581,
  };
  return annotationFormatter;
};
export interface FileAndAnnotationImportInfo {
  annotationImagesProperty: AnnotationImagesProperty;
  drawObjectById: Record<string, DrawObject>;
}
