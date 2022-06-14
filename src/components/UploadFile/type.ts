import React from "react";

export interface UploadFileProps {
  projectId: string;
  projectName: string;
}

export interface UploadFileItemProps {
  key?: string;
  file: File;
  status: string;
  uploadProgress?: number;
  onClickDelete: (fileName: string) => void;
  onClickReplaceUpload: (fileName: string) => void;
  isUploading: boolean;
  error?: string;
}

export interface UploadFromMenuProps {
  inputRef: React.RefObject<HTMLInputElement>;
  isDisabledUpload: boolean;
  anchorEl: HTMLElement | null | undefined;
  isOpen: boolean;
  relativeMousePosition?: MousePosition;
  onClose: () => void;
}
export interface MousePosition {
  top: number;
  left: number;
}
export interface LoadImageResult {
  image: HTMLImageElement;
  fileName: string;
}
