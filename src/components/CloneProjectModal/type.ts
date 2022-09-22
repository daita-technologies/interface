export interface CreateProjectModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export interface CloneProjectToAnnotationFields {
  fromProjectName: string;
  annotationProjectName: string;
  annotationProjectDescription: string;
}
