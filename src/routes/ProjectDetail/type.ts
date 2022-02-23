export interface AlbumViewerProps {
  projectId: string;
}

export interface S3Image {
  photoKey: string;
  src: string;
  alt?: string;
  size: number;
}
