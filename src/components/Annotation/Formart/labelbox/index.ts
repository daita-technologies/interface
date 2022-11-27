import { createPolygon } from "components/Annotation/Editor/Shape/Polygon";
import { PolygonSpec, RectangleSpec } from "components/Annotation/Editor/type";
import { DrawObject, DrawType } from "reduxes/annotation/type";
import { AnnotationImportInfo, ID_2_LABEL_DAITA } from "../daita/type";
import {
  AnnotationFormatter,
  createAnnotationFormatter,
  FileAndAnnotationImportInfo,
  LabelLabelBox,
  Point,
} from "./type";

export const convert = (
  drawObjectById: Record<string, DrawObject>
): LabelLabelBox => {
  const shape: LabelLabelBox = {};
  Object.entries(drawObjectById).forEach(([, value]) => {
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
  });
  return shape;
};
export const exportAnnotation = (
  drawObjectById: Record<string, DrawObject>,
  imageName: string | null
) => {
  const shapes: LabelLabelBox = convert(drawObjectById);
  const annotationFormatter: AnnotationFormatter =
    createAnnotationFormatter(shapes);
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(annotationFormatter, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = imageName
    ? `${imageName.replace(/\.[^.]+$/, "-LabelBox")}.json`
    : "data.json";

  link.click();
};
export const importAnnotation = (file: File): Promise<AnnotationImportInfo> =>
  new Promise<AnnotationImportInfo>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    const drawObjectById: Record<string, DrawObject> = {};
    reader.onloadend = async () => {
      const annotationFormatter: AnnotationFormatter = JSON.parse(
        reader.result as string
      );
      Object.entries(annotationFormatter.Label).map(([label, geometrys]) => {
        geometrys.forEach((geometry) => {
          const drawObject = createPolygon({ x: 0, y: 0 });
          drawObjectById[drawObject.data.id] = {
            type: drawObject.type,
            data: {
              ...drawObject.data,
              points: geometry.geometry,
              polygonState: {
                isFinished: true,
              },
              label: { label },
            } as PolygonSpec,
          };
        });

        resolve({
          drawObjectById,
        });
      });
    };
  });
