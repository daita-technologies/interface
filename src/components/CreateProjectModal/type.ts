import {
  CreateProjectDatasetTypeControlType,
  CreateProjectDatasetValueType,
} from "constants/type";

export interface CreateProjectModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export interface PrebuildDataset {
  name: string;
  s3Key: string;
  totalImage: number;
  visualName: string;
  isActive: boolean;
}

export interface CreateProjectFields {
  idToken: string;
  accessToken: string;
  projectName: string;
  description: string;
  createProjectPreBuild?: CreateProjectPreBuildFields;
  datasetProjectType: CreateProjectDatasetValueType;
  numberOfDatasetImages?: number;
}

export interface CreateProjectDatasetTypeControlProps
  extends CreateProjectDatasetTypeControlType {
  datasetProjectType: CreateProjectDatasetValueType;
  numberOfDatasetImages?: number;
  setDatasetProjectType: (
    datasetProjectType: CreateProjectDatasetValueType
  ) => void;
  setNumberOfDatasetImages: (numberOfDatasetImages: number) => void;
  createProjectPreBuild?: CreateProjectPreBuildFields;
  prebuildDataset: PrebuildDataset | null;
  setPrebuildDataset: (value: PrebuildDataset) => void;
  listPrebuildDataset: PrebuildDataset[];
  isLoadingPrebuildDataset: boolean;
  isCreatingProject: boolean;
}

export interface CreateProjectPreBuildFields {
  nameIdPrebuild: string;
  numberRadom: number;
}
