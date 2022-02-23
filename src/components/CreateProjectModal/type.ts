export interface CreateProjectModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export interface CreateProjectFields {
  idToken: string;
  accessToken: string;
  projectName: string;
}
