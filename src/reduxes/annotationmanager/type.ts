import { DrawObject } from "reduxes/annotation/type";

export interface AnnotationManagerReducer {
  idDrawObjectByImageName: Record<string, Record<string, DrawObject>>;
  images: Record<string, File>;
  currentPreviewImageName: string | null;
}
export interface AddImageToAnnotationProps {
  images: File[];
}
export interface ChangePreviewImageProps {
  imageName: string;
}
export interface SaveAnnotationStateManagerProps {
  imageName: string;
  drawObjectById: Record<string, DrawObject>;
}
