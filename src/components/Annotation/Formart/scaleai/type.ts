import { DrawObject } from "reduxes/annotation/type";
import { AnnotationImagesProperty } from "reduxes/annotationmanager/type";

export type Shape = RectangleShape | PolygonShape;
export type RectangleShape = {
  uuid: string;
  width: number;
  height: number;
  left: number;
  top: number;
  label: string;
  type: "box";
};
export type PolygonShape = {
  uuid: string;
  vertices: { x: number; y: number }[];
  label: string;
  type: "polygon";
};
export interface AnnotationFormatter {
  task_id: string;
  created_at: string;
  completed_at: string;
  callback_url: string;
  type: string;
  status: string;
  instruction: string;
  params: {
    attachment: string;
    attachment_type: string;
    objects_to_annotate: string[];
    with_labels: boolean;
    min_width: number;
    min_height: number;
    examples: [];
  };
  is_test: false;
  urgency: string;
  metadata: {};
  callback_succeeded: true;
  processed_attachments: [];
  project: string;
  response: {
    annotations: Shape[];
  };
  project_param_version: 0;
  scale_internal_attachment: string;
  workStarted: true;
}
export const convertLabelMeFormatToBase64 = (imageData: string) => {
  return "data:image/png;base64," + imageData;
};
export const createAnnotationFormatter = (shapes: Shape[]) => {
  const annotationFormatter: AnnotationFormatter = {
    task_id: "a9b7c5d3e1f",
    created_at: "2000-01-01T00:00:00.000Z",
    completed_at: "2000-01-01T00:00:00.000Z",
    callback_url: "example@example.com",
    type: "annotation",
    status: "completed",
    instruction: "\n# Instructions\n\nLabel the helmets on the workers.",
    params: {
      attachment: "<https://storage.googleapis.com/roboflow/0001.jpg>",
      attachment_type: "image",
      objects_to_annotate: ["helmet", "head", "person"],
      with_labels: true,
      min_width: 0,
      min_height: 0,
      examples: [],
    },
    is_test: false,
    urgency: "standard",
    metadata: {},
    callback_succeeded: true,
    processed_attachments: [],
    project: "Hard Hat Workers",
    response: {
      annotations: [...shapes],
    },
    project_param_version: 0,
    scale_internal_attachment:
      "<https://d2qt2k6tuv6mdh.cloudfront.net/a9b7c5d3e1f/001.jpg>",
    workStarted: true,
  };
  return annotationFormatter;
};
export interface ScaleAIAnnotationImportInfo {
  drawObjectById: Record<string, DrawObject>;
}
