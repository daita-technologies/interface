import { DrawObject } from "reduxes/annotation/type";
import { AnnotationImagesProperty } from "reduxes/annotationmanager/type";

export type Point = {
  x: number;
  y: number;
};
export type Geometry = {
  geometry: Point[];
};
export type LabelLabelBox = Record<string, Geometry[]>;
export interface AnnotationFormatter {
  ID: string;
  "DataRow ID": string;
  "Labeled Data": string;
  Label: LabelLabelBox;
  "Project Name": string;
  "External ID": string;
}

export const convertLabelMeFormatToBase64 = (imageData: string) =>
  `data:image/png;base64,${imageData}`;
export const createAnnotationFormatter = (labelBox: LabelLabelBox) => {
  const annotationFormatter: AnnotationFormatter = {
    ID: "a9b7c5d3e1f",
    "DataRow ID": "xy10z8a6b4c",
    "Labeled Data": "<https://storage.labelbox.com/IMG_001.JPG>",
    Label: labelBox,
    "Project Name": "Boggle",
    "External ID": "IMG_001.JPG",
  };
  return annotationFormatter;
};
export interface FileAndAnnotationImportInfo {
  annotationImagesProperty: AnnotationImagesProperty;
  drawObjectById: Record<string, DrawObject>;
}
