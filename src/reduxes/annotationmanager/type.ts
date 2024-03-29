import { LabelClassProperties } from "components/Annotation/Editor/type";
import { DrawObject } from "reduxes/annotation/type";

export interface AnnotationManagerReducer {
  idDrawObjectByImageName: Record<string, Record<string, DrawObject>>;
  images: Record<string, AnnotationImagesProperty>;
  currentPreviewImageName: string | null;
  currentImageInEditorProps: ImageInEditorProps | null;
  labelClassPropertiesByLabelClass: Record<string, LabelClassProperties>;
  localLabelClassPropertiesByLabelClass: Record<string, LabelClassProperties>;
  dialogClassManageModal: ClassManageModalProps;
  isFetchingImageData: boolean;
  isSavingAnnotation: boolean;
}
export interface ImageInEditorProps {
  scaleX: number;
  scaleY: number;
  width: number;
  height: number;
  paddingLeft: number;
  paddingTop: number;
  clientRectOfBaseImage: ClientRectType | null;
}
export interface ClientRectType {
  width: number;
  height: number;
  x: number;
  y: number;
}

export type ClassManageModalType = "VIEW" | "CREATE" | "EDIT";

export interface ClassManageModalProps {
  isOpen: boolean;
  className?: string;
  classManageModalType?: ClassManageModalType;
  editData?: EditClassManageModalProps;
}
export interface EditClassManageModalProps {
  className: string;
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
export interface AddNewClassLabelProps {
  labelClassProperties: LabelClassProperties;
}
export interface EditClassLabelProps {
  label: string;
  labelClassProperties: LabelClassProperties;
}
export interface FetchingFileAndAnnotaitonProps {
  filename: string;
  fileId: string;
  categoryId: string;
  s3keyLabel: string;
  s3keyFile: string;
}
export interface SetClientRectOfBaseImageProps {
  clientRectOfBaseImage: ClientRectType;
}
