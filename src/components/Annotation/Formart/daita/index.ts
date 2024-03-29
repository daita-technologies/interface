import { createEllipse } from "components/Annotation/Editor/Shape/EllipseShape";
import { createPolygon } from "components/Annotation/Editor/Shape/Polygon";
import { createRectangle } from "components/Annotation/Editor/Shape/Rectangle";
import {
  EllipseSpec,
  PolygonSpec,
  RectangleSpec,
} from "components/Annotation/Editor/type";
import { DrawObject, DrawType } from "reduxes/annotation/type";

import {
  AnnotationDaitaFormatter,
  AnnotationFormatter,
  AnnotationImportInfo,
  ID_2_LABEL_DAITA,
  PolygonShape,
  Shape,
  ShapeType,
} from "./type";

export const importFileAndAnnotationFromDaitaAI = (
  file: File
): Promise<AnnotationImportInfo> =>
  new Promise<AnnotationImportInfo>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    const drawObjectById: Record<string, DrawObject> = {};
    reader.onloadend = async () => {
      const annotationFormatter: AnnotationFormatter = JSON.parse(
        reader.result as string
      );
      annotationFormatter.annotations.forEach((annotation) => {
        const drawObject = createPolygon({ x: 0, y: 0 });
        const formatedPoints = annotation.coordinates.map((arr) => ({
          x: arr[0],
          y: arr[1],
        }));
        drawObjectById[drawObject.data.id] = {
          type: drawObject.type,
          data: {
            ...drawObject.data,
            points: formatedPoints,
            polygonState: { isFinished: true },
            label: { label: ID_2_LABEL_DAITA[annotation.category_id] },
          },
        };
      });
      resolve({
        drawObjectById,
      });
    };
  });
// export const importFileAndAnnotation = (
//   file: File
// ): Promise<FileAndAnnotationImportInfo> =>
//   new Promise<FileAndAnnotationImportInfo>((resolve) => {
//     const reader = new FileReader();
//     reader.readAsText(file);
//     const drawObjectById: Record<string, DrawObject> = {};
//     reader.onloadend = async () => {
//       const annotationFormatter: AnnotationFormatter = JSON.parse(
//         reader.result as string
//       );
//       let property = null;
//       if (annotationFormatter.image_path) {
//         property = await readImage(annotationFormatter.image_path);
//       }

//       annotationFormatter.annotations.forEach((annotation) => {
//         const drawObject = createPolygon({ x: 0, y: 0 });
//         const formatedPoints = annotation.coordinates.map((arr) => ({
//           x: arr[0],
//           y: arr[1],
//         }));
//         drawObjectById[drawObject.data.id] = {
//           type: drawObject.type,
//           data: {
//             ...drawObject.data,
//             points: formatedPoints,
//             polygonState: { isFinished: true },
//             label: { label: ID_2_LABEL_DAITA[annotation.category_id] },
//           },
//         };
//       });
//       resolve({
//         annotationImagesProperty: property,
//         drawObjectById,
//       });
//     };
//   });
export const importAnnotation = (
  file: File,
  idToLabelStr: Record<string, string>
): Promise<AnnotationImportInfo> =>
  new Promise<AnnotationImportInfo>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    const drawObjectById: Record<string, DrawObject> = {};
    reader.onloadend = async () => {
      const annotationFormatter: AnnotationDaitaFormatter = JSON.parse(
        reader.result as string
      );
      annotationFormatter.shapes.forEach((annotation) => {
        if (
          annotation.shapeType === ShapeType.POLYGON ||
          annotation.shapeType === ShapeType.LINE_STRIP
        ) {
          const drawObject = createPolygon({ x: 0, y: 0 });
          const spec = annotation.shapeSpec as PolygonShape;
          drawObjectById[drawObject.data.id] = {
            type: drawObject.type,
            data: {
              ...drawObject.data,
              ...spec,
              polygonState: {
                isFinished: true,
                isLineStrip: annotation.shapeType === ShapeType.LINE_STRIP,
              },
              label: { label: idToLabelStr[annotation.categoryId] },
            } as PolygonSpec,
          };
        } else if (annotation.shapeType === ShapeType.RECTANGLE) {
          const drawObject = createRectangle({ x: 0, y: 0 });
          const spec = annotation.shapeSpec as RectangleSpec;
          drawObjectById[drawObject.data.id] = {
            type: drawObject.type,
            data: {
              ...drawObject.data,
              ...spec,
              label: { label: idToLabelStr[annotation.categoryId] },
            } as RectangleSpec,
          };
        } else if (annotation.shapeType === ShapeType.ELLIPSE) {
          const drawObject = createEllipse({ x: 0, y: 0 });
          const spec = annotation.shapeSpec as EllipseSpec;
          drawObjectById[drawObject.data.id] = {
            type: drawObject.type,
            data: {
              ...drawObject.data,
              ...spec,
              label: { label: idToLabelStr[annotation.categoryId] },
            } as EllipseSpec,
          };
        }
      });

      resolve({
        drawObjectById,
      });
    };
  });

export const convert = (
  drawObjectById: Record<string, DrawObject>,
  labelStrToId: Record<string, string>
): Shape[] => {
  const shapes: Shape[] = [];
  Object.entries(drawObjectById).forEach(([, value]) => {
    if (value.type === DrawType.POLYGON || value.type === DrawType.LINE_STRIP) {
      const { points, label } = value.data as PolygonSpec;
      shapes.push({
        shapeSpec: { points },
        shapeType:
          value.type === DrawType.POLYGON
            ? ShapeType.POLYGON
            : ShapeType.LINE_STRIP,
        categoryId: labelStrToId[label.label],
      });
    } else if (value.type === DrawType.RECTANGLE) {
      const { width, height, x, y, label } = value.data as RectangleSpec;
      shapes.push({
        shapeSpec: { width, height, x, y },
        shapeType: ShapeType.RECTANGLE,
        categoryId: labelStrToId[label.label],
      });
    } else if (value.type === DrawType.ELLIPSE) {
      const { x, y, radiusX, radiusY, label } = value.data as EllipseSpec;
      shapes.push({
        shapeSpec: { x, y, radiusX, radiusY },
        shapeType: ShapeType.ELLIPSE,
        categoryId: labelStrToId[label.label],
      });
    }
  });
  return shapes;
};
export const exportAnnotationToJson = (
  drawObjectById: Record<string, DrawObject>,
  labelStrToId: Record<string, string>
) => {
  const shapes: Shape[] = convert(drawObjectById, labelStrToId);
  const annotationDaitaFormatter: AnnotationDaitaFormatter = {
    shapes,
  };
  return annotationDaitaFormatter;
};
export const exportAnnotation = (
  drawObjectById: Record<string, DrawObject>,
  imageName: string,
  labelStrToId: Record<string, string>
) => {
  const json = exportAnnotationToJson(drawObjectById, labelStrToId);
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(json, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${imageName.replace(/\.[^.]+$/, "-DAITA")}.json`;

  link.click();
};
