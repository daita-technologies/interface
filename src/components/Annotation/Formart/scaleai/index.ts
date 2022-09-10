import { RectangleSpec } from "components/Annotation/Editor/type";
import { DrawObject, DrawType } from "reduxes/annotation/type";
import { AnnotationFormatter, createAnnotationFormatter, Shape } from "./type";

export const exportAnnotation = (
  drawObjectById: Record<string, DrawObject>
) => {
  const shapes: Shape[] = convert(drawObjectById);
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
): Shape[] => {
  const shape: Shape[] = [];
  for (const [key, value] of Object.entries(drawObjectById)) {
    if (value.type === DrawType.RECTANGLE) {
      const { x, y, width, height, label } = value.data as RectangleSpec;
      shape.push({
        left: x,
        top: y,
        width,
        height,
        label: label.label,
      });
    }
  }
  return shape;
};
