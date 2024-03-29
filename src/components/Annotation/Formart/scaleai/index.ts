import { createPolygon } from "components/Annotation/Editor/Shape/Polygon";
import { createRectangle } from "components/Annotation/Editor/Shape/Rectangle";
import { PolygonSpec, RectangleSpec } from "components/Annotation/Editor/type";
import { DrawObject, DrawType } from "reduxes/annotation/type";
import {
  AnnotationFormatter,
  createAnnotationFormatter,
  PolygonShape,
  RectangleShape,
  ScaleAIAnnotationImportInfo,
  Shape,
} from "./type";

export const convert = (
  drawObjectById: Record<string, DrawObject>
): Shape[] => {
  const shapes: Shape[] = [];
  Object.entries(drawObjectById).forEach(([, value]) => {
    if (value.type === DrawType.RECTANGLE) {
      const { id, x, y, width, height, label } = value.data as RectangleSpec;
      const shape: RectangleShape = {
        uuid: id,
        left: x,
        top: y,
        width,
        height,
        label: label.label,
        type: "box",
      };
      shapes.push(shape);
    } else if (value.type === DrawType.POLYGON) {
      const { id, points, label } = value.data as PolygonSpec;
      const shape: PolygonShape = {
        uuid: id,
        vertices: points,
        label: label.label,
        type: "polygon",
      };
      shapes.push(shape);
    }
  });
  return shapes;
};

export const importAnnotation = (
  file: File
): Promise<ScaleAIAnnotationImportInfo> =>
  new Promise<ScaleAIAnnotationImportInfo>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    const drawObjectById: Record<string, DrawObject> = {};
    reader.onloadend = () => {
      const annotationFormatter: AnnotationFormatter = JSON.parse(
        reader.result as string
      );
      annotationFormatter.response.annotations.forEach((shape) => {
        if (shape.type === "box") {
          const drawObject = createRectangle({ x: 0, y: 0 });

          drawObjectById[drawObject.data.id] = {
            type: drawObject.type,
            data: {
              ...drawObject.data,
              x: shape.left,
              y: shape.top,
              width: shape.width,
              height: shape.height,
              label: { label: shape.label },
            } as RectangleSpec,
          };
        } else if (shape.type === "polygon") {
          const drawObject = createPolygon({ x: 0, y: 0 });
          drawObjectById[drawObject.data.id] = {
            type: drawObject.type,
            data: {
              ...drawObject.data,
              points: shape.vertices,
              polygonState: { isFinished: true },
              label: { label: shape.label },
            },
          };
        }
      });
      resolve({ drawObjectById });
    };
  });
export const exportAnnotation = (
  drawObjectById: Record<string, DrawObject>,
  imageName: string | null
) => {
  const shapes: Shape[] = convert(drawObjectById);
  const annotationFormatter: AnnotationFormatter =
    createAnnotationFormatter(shapes);
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(annotationFormatter, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = imageName
    ? `${imageName.replace(/\.[^.]+$/, "-ScaleAI")}.json`
    : "data.json";

  link.click();
};
