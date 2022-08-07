import {
  DrawObjectType,
  EllipseSpec,
  PolygonSpec,
  RectangleSpec,
} from "components/Annotation/Editor/type";
import { DrawObject, DrawType } from "reduxes/annotation/type";
import { createEllipse } from "routes/AnnotationPage/Editor/Hook/useElipseEvent";
import { createPolygon } from "routes/AnnotationPage/Editor/Hook/usePolygonEvent";
import { createRectangle } from "routes/AnnotationPage/Editor/Hook/useRectangleEvent";
import {
  AnnotationFormatter,
  AnnotationImportInfo,
  convertLabelMeFormatToBase64,
  createAnnotationFormatter,
  EllipseFormatter,
  PolygonFormatter,
  RectangleFormatter,
  Shape,
  ShapeType,
} from "../labelmetype";

export const exportAnnotation = (
  file: File,
  drawObjectById: Record<string, DrawObject>
) => {
  const shapes: Shape[] = convert(drawObjectById);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const annotationFormatter: AnnotationFormatter = createAnnotationFormatter(
      shapes,
      reader.result as string
    );
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(annotationFormatter, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };
};

export const convert = (
  drawObjectById: Record<string, DrawObject>
): Shape[] => {
  const shape: Shape[] = [];
  for (const [key, value] of Object.entries(drawObjectById)) {
    if (value.type === DrawType.RECTANGLE) {
      const { x, y, width, height, label } = value.data as RectangleSpec;
      shape.push({
        points: [
          [x, y],
          [x + width, y + height],
        ],
        shape_type: "rectangle",
        label: label.label,
      });
    } else if (value.type === DrawType.POLYGON) {
      const { points, label } = value.data as PolygonSpec;
      shape.push({
        points: points.map((point) => [point.x, point.y]) as PolygonFormatter,
        shape_type: "polygon",
        label: label.label,
      });
    }
    // else if (value.type === DrawType.ELLIPSE) {
    //   const { x, y, radiusX, radiusY, label } = value.data as EllipseSpec;
    //   shape.push({
    //     points: { x, y, radiusX, radiusY } as EllipseFormatter,
    //     shape_type: "ellipse",
    //     label: label.label,
    //   });
    // }
  }
  return shape;
};

// export const convertDrawType2ShapeType = (drawType: DrawType): ShapeType => {
//   if (drawType === DrawType.RECTANGLE) {
//     return "Rectangle";
//   } else if (drawType === DrawType.POLYGON) {
//     return "Polygon";
//   } else if (drawType === DrawType.ELLIPSE) {
//     return "Ellipse";
//   }
//   return "Rectangle";
// };
// export const convertShapeType2DrawType = (drawType: ShapeType): DrawType => {
//   if (drawType === "Rectangle") {
//     return DrawType.RECTANGLE;
//   } else if (drawType === "Polygon") {
//     return DrawType.POLYGON;
//   } else if (drawType === "Ellipse") {
//     return DrawType.ELLIPSE;
//   }
//   return DrawType.RECTANGLE;
// };
export const importAnnotation = (file: File): Promise<AnnotationImportInfo> => {
  return new Promise<AnnotationImportInfo>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    const drawObjectById: Record<string, DrawObject> = {};
    reader.onloadend = () => {
      const annotationFormatter: AnnotationFormatter = JSON.parse(
        reader.result as string
      );
      for (const shape of annotationFormatter.shapes) {
        if (shape.shape_type === "rectangle") {
          const drawObject = createRectangle({ x: 0, y: 0 });
          const points = shape.points as RectangleFormatter;
          const x = points[0][0];
          const y = points[0][1];
          const width = points[1][0] - x;
          const height = points[1][1] - y;
          drawObjectById[drawObject.data.id] = {
            type: drawObject.type,
            data: {
              ...drawObject.data,
              x,
              y,
              width,
              height,
              label: { label: shape.label },
            },
          };
        } else if (shape.shape_type === "polygon") {
          const drawObject = createPolygon({ x: 0, y: 0 });
          const points = shape.points as PolygonFormatter;
          const formatedPoints = points.map((arr) => {
            return { x: arr[0], y: arr[1] };
          });
          drawObjectById[drawObject.data.id] = {
            type: drawObject.type,
            data: {
              ...drawObject.data,
              points: formatedPoints,
              polygonState: { isFinished: true },
              label: { label: shape.label },
            },
          };
        } else if (shape.shape_type === "circle") {
          const drawObject = createEllipse({ x: 0, y: 0 });
          const points = shape.points as EllipseFormatter;
          const center = { x: points[0][0], y: points[0][1] };
          const radius = Math.abs(points[1][0] - points[1][1]);
          drawObjectById[drawObject.data.id] = {
            type: drawObject.type,
            data: {
              ...drawObject.data,
              ...center,
              radiusX: radius,
              radiusY: radius,
              label: { label: shape.label },
            },
          };
        }
        // else if (shape.shape_type === "ellipse") {
        //   const drawObject = createEllipse({ x: 0, y: 0 });
        //   const points = shape.points as EllipseFormatter;
        //   drawObjectById[drawObject.data.id] = {
        //     type: drawObject.type,
        //     data: {
        //       ...drawObject.data,
        //       ...points,
        //       label: { label: shape.label },
        //     },
        //   };
        // }
      }
      resolve({
        imageData: convertLabelMeFormatToBase64(annotationFormatter.imageData),
        drawObjectById,
      });
    };
  });
};
