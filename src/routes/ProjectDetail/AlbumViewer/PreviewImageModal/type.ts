import { AlbumImagesFields, ImageApiFields } from "reduxes/album/type";

export interface PreviewImageModalProps {
  previewImage: ImageApiFields | null;
  setPreviewImage: (image: ImageApiFields | null) => void;
  images: AlbumImagesFields;
  imagesFileNameArray: string[];
}
