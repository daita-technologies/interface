export interface CreateProjectModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export interface CreateProjectFields {
  idToken: string;
  accessToken: string;
  projectName: string;
  description: string;
  createProjectPreBuild?: CreateProjectPreBuildFields;
}

export interface CreateProjectPreBuildFields {
  nameIdPrebuild: string;
  numberRadom: number;
}
export interface PrebuildDataset {
  name: string;
  s3Key: string;
  totalImage: number;
  visualName: string;
  isActive: boolean;
}
