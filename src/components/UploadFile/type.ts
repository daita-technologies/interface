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
}
