import { createEllipse } from "components/Annotation/Editor/Shape/EllipseShape";
import { createPolygon } from "components/Annotation/Editor/Shape/Polygon";
import { createRectangle } from "components/Annotation/Editor/Shape/Rectangle";
import { PolygonSpec, RectangleSpec } from "components/Annotation/Editor/type";
import { loadImage } from "components/UploadFile";
import { DrawObject, DrawType } from "reduxes/annotation/type";
import { AnnotationImagesProperty } from "reduxes/annotationmanager/type";
import {
  AnnotationFormatter,
  CircleFormatter,
  convertLabelMeFormatToBase64,
  createAnnotationFormatter,
  EllipseFormatter,
  FileAndAnnotationImportInfo,
  PolygonFormatter,
  RectangleFormatter,
  Shape,
} from "./type";

export const importAnnotation = (
  file: File
): Promise<FileAndAnnotationImportInfo> =>
  new Promise<FileAndAnnotationImportInfo>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    const drawObjectById: Record<string, DrawObject> = {};
    reader.onloadend = () => {
      const annotationFormatter: AnnotationFormatter = JSON.parse(
        reader.result as string
      );
      annotationFormatter.imageData = convertLabelMeFormatToBase64(
        annotationFormatter.imageData
      );
      fetch(annotationFormatter.imageData)
        .then((res) => res.blob())
        .then((blob) => {
          const imageName = `imageName-import-${Math.floor(
            Math.random() * 100000
          )}`;
          const loadedFile = new File([blob], imageName, {
            type: "image/jpg",
          });
          loadImage(loadedFile)
            .then(({ image }) => {
              const property: AnnotationImagesProperty = {
                image: loadedFile,
                width: image.width,
                height: image.height,
              };
              annotationFormatter.shapes.forEach((shape) => {
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
                } else if (
                  shape.shape_type === "polygon" ||
                  shape.shape_type === "line" ||
                  shape.shape_type === "linestrip"
                ) {
                  const drawObject = createPolygon({ x: 0, y: 0 });
                  const points = shape.points as PolygonFormatter;
                  const formatedPoints = points.map((arr) => ({
                    x: arr[0],
                    y: arr[1],
                  }));
                  drawObjectById[drawObject.data.id] = {
                    type: drawObject.type,
                    data: {
                      ...drawObject.data,
                      points: formatedPoints,
                      polygonState: {
                        isFinished: true,
                        isLineStrip:
                          shape.shape_type === "line" ||
                          shape.shape_type === "linestrip",
                      },
                      label: { label: shape.label },
                    },
                  };
                } else if (shape.shape_type === "circle") {
                  const drawObject = createEllipse({ x: 0, y: 0 });
                  const points = shape.points as CircleFormatter;
                  const center = { x: points[0][0], y: points[0][1] };
                  const disX = points[1][0] - points[0][0];
                  const disY = points[1][1] - points[0][1];
                  const radius = Math.sqrt(Math.abs(disX * disX + disY * disY));

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
                } else if (shape.shape_type === "ellipse") {
                  const drawObject = createEllipse({ x: 0, y: 0 });
                  const points = shape.points as EllipseFormatter;
                  drawObjectById[drawObject.data.id] = {
                    type: drawObject.type,
                    data: {
                      ...drawObject.data,
                      ...points,
                      label: { label: shape.label },
                    },
                  };
                }
              });
              resolve({
                annotationImagesProperty: property,
                drawObjectById,
              });
            })
            .catch((e) => console.log(e));
        });
    };
  });

export const convert = (
  drawObjectById: Record<string, DrawObject>
): Shape[] => {
  const shape: Shape[] = [];
  Object.entries(drawObjectById).forEach(([, value]) => {
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
    } else if (
      value.type === DrawType.POLYGON ||
      value.type === DrawType.LINE_STRIP
    ) {
      const { points, label, polygonState } = value.data as PolygonSpec;
      shape.push({
        points: points.map((point) => [point.x, point.y]) as PolygonFormatter,
        shape_type: polygonState.isLineStrip === true ? "linestrip" : "polygon",
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
  });
  return shape;
};
export const exportAnnotation = (
  annotationImagesProperty: AnnotationImagesProperty,
  drawObjectById: Record<string, DrawObject>
) => {
  const shapes: Shape[] = convert(drawObjectById);
  const { image } = annotationImagesProperty;
  const reader = new FileReader();
  reader.readAsDataURL(image);
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
