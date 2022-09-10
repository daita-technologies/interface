import { PolygonSpec, RectangleSpec } from "components/Annotation/Editor/type";
import { DrawObject, DrawType } from "reduxes/annotation/type";
import {
  AnnotationFormatter,
  createAnnotationFormatter,
  LabelLabelBox,
  Point,
} from "./type";

export const exportAnnotation = (
  drawObjectById: Record<string, DrawObject>
) => {
  const shapes: LabelLabelBox = convert(drawObjectById);
  const annotationFormatter: AnnotationFormatter =
    createAnnotationFormatter(shapes);
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(annotationFormatter, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "data.json";

  link.click();
};

export const convert = (
  drawObjectById: Record<string, DrawObject>
): LabelLabelBox => {
  const shape: LabelLabelBox = {};
  for (const [key, value] of Object.entries(drawObjectById)) {
    if (value.type === DrawType.RECTANGLE) {
      const { x, y, width, height, label } = value.data as RectangleSpec;
      const points: Point[] = [
        {
          x,
          y,
        },
        {
          x: x + width,
          y,
        },
        {
          x: x + width,
          y: y + height,
        },
        {
          x,
          y: y + height,
        },
      ];
      if (shape[label.label]) {
        shape[label.label].push({ geometry: points });
      } else {
        shape[label.label] = [{ geometry: points }];
      }
    } else if (value.type === DrawType.POLYGON) {
      const { points, label } = value.data as PolygonSpec;
      if (shape[label.label]) {
        shape[label.label].push({ geometry: points });
      } else {
        shape[label.label] = [{ geometry: points }];
      }
    }
  }
  return shape;
};
