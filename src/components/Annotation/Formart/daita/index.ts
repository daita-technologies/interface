import { PolygonSpec } from "components/Annotation/Editor/type";
import { loadImage } from "components/UploadFile";
import { DrawObject, DrawType } from "reduxes/annotation/type";
import { createPolygon } from "routes/AnnotationPage/Editor/Hook/usePolygonEvent";
import {
  Annotation,
  AnnotationFormatter,
  AnnotationImportInfo,
  FileAndAnnotationImportInfo,
  ID_2_LABEL_DAITA,
  LABEL_2_ID_DAITA,
} from "./type";
export const exportAnnotationToJson = (
  drawObjectById: Record<string, DrawObject>,
  imageName: string
) => {
  const annotations: Annotation[] = convert(drawObjectById);
  const annotationFormatter: AnnotationFormatter = {
    image_path: `https://annotaion-test-image.s3.us-east-2.amazonaws.com/${imageName}`,
    annotations,
  };

  return annotationFormatter;
};
export const exportAnnotation = (
  drawObjectById: Record<string, DrawObject>,
  imageName: string
) => {
  const json = exportAnnotationToJson(drawObjectById, imageName);
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(json, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${imageName}.json`;

  link.click();
};
const readImage = async (url: string) => {
  let response = await fetch(url);
  let data = await response.blob();
  let metadata = {
    type: "image/png",
  };
  const split = url.split("/");
  const filename = split[split.length - 1];
  let file = new File([data], filename, metadata);
  const image = await loadImage(file);
  return {
    height: image.image.height,
    width: image.image.width,
    image: file,
  };
};
export const importFileAndAnnotation = (
  file: File
): Promise<FileAndAnnotationImportInfo> => {
  return new Promise<FileAndAnnotationImportInfo>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    const drawObjectById: Record<string, DrawObject> = {};
    reader.onloadend = async () => {
      const annotationFormatter: AnnotationFormatter = JSON.parse(
        reader.result as string
      );
      const property = await readImage(annotationFormatter.image_path);

      for (const annotation of annotationFormatter.annotations) {
        const drawObject = createPolygon({ x: 0, y: 0 });
        const formatedPoints = annotation.coordinates.map((arr) => {
          return { x: arr[0], y: arr[1] };
        });
        drawObjectById[drawObject.data.id] = {
          type: drawObject.type,
          data: {
            ...drawObject.data,
            points: formatedPoints,
            polygonState: { isFinished: true },
            label: { label: ID_2_LABEL_DAITA[annotation.category_id] },
          },
        };
      }
      resolve({
        annotationImagesProperty: property,
        drawObjectById,
      });
    };
  });
};
export const importAnnotation = (file: File): Promise<AnnotationImportInfo> => {
  return new Promise<AnnotationImportInfo>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    const drawObjectById: Record<string, DrawObject> = {};
    reader.onloadend = async () => {
      const annotationFormatter: AnnotationFormatter = JSON.parse(
        reader.result as string
      );
      for (const annotation of annotationFormatter.annotations) {
        const drawObject = createPolygon({ x: 0, y: 0 });
        const formatedPoints = annotation.coordinates.map((arr) => {
          return { x: arr[0], y: arr[1] };
        });
        drawObjectById[drawObject.data.id] = {
          type: drawObject.type,
          data: {
            ...drawObject.data,
            points: formatedPoints,
            polygonState: { isFinished: true },
            label: { label: ID_2_LABEL_DAITA[annotation.category_id] },
          },
        };
      }
      resolve({
        drawObjectById,
      });
    };
  });
};

export const convert = (
  drawObjectById: Record<string, DrawObject>
): Annotation[] => {
  const shape: Annotation[] = [];
  for (const [key, value] of Object.entries(drawObjectById)) {
    if (value.type === DrawType.POLYGON) {
      const { points, label } = value.data as PolygonSpec;
      shape.push({
        coordinates: points.map((point) => [point.x, point.y]),
        category_id: LABEL_2_ID_DAITA[label.label],
      });
    }
  }
  return shape;
};
