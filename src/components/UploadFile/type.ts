import React, { CSSProperties } from "react";
import { HandleFileType, UploadFilesType } from "reduxes/upload/type";

export interface UploadFileProps {
  projectId: string;
  projectName: string;
}

export interface UploadFileItemProps {
  fileName: string;
  onClickDelete: (fileName: string) => void;
  onClickReplaceUpload: (fileName: string) => void;
  isUploading: boolean;
  style: CSSProperties;
  handleFileType: HandleFileType;
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
