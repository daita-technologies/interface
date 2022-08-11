import { DrawObject } from "reduxes/annotation/type";

export interface AnnotationManagerReducer {
  idDrawObjectByImageName: Record<string, Record<string, DrawObject>>;
  images: Record<string, AnnotationImagesProperty>;
  currentPreviewImageName: string | null;
}
export interface AnnotationImagesProperty {
  image: File;
  width: number;
  height: number;
}
export interface AddImageToAnnotationProps {
  annotationImagesProperties: AnnotationImagesProperty[];
}
export interface ChangePreviewImageProps {
  imageName: string;
}
export interface SaveAnnotationStateManagerProps {
  imageName: string;
  drawObjectById: Record<string, DrawObject>;
}
