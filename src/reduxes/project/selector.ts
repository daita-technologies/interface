import { RootState } from "reduxes";
import { objectIndexOf } from "utils/general";
import {
  ERROR_TASK_STATUS,
  FINISH_ERROR_TASK_STATUS,
  FINISH_TASK_STATUS,
} from "constants/defaultValues";
import { ProjectInfo } from "./type";

export const selectorListProjects = (state: RootState) =>
  state.projectReducer.listProjects;

export const selectorIsFetchingProjects = (state: RootState) =>
  state.projectReducer.isFetchingProjects;

export const selectorIsFetchingDetailProject = (state: RootState) =>
  state.projectReducer.isFetchingDetailProject;

export const selectorCurrentTaskList = (state: RootState) => {
  const { currentProjectInfo } = state.projectReducer;
  // const { listProjects } = state.projectReducer;
  if (currentProjectInfo) {
    const { ls_task } = currentProjectInfo;

    return ls_task;
    // const matchProjectIndex = objectIndexOf(
    //   listProjects,
    //   project_id,
    //   "project_id"
    // );
    // if (matchProjectIndex > -1) {
    //   return state.projectReducer.listProjects[matchProjectIndex].ls_task;
    // }
    // return [];
  }

  return [];
};

export const selectorTaskList = (state: RootState, projectId: string) => {
  const { listProjects } = state.projectReducer;
  if (listProjects) {
    const matchIndex = listProjects.findIndex(
      (project) => project.project_id === projectId
    );

    if (matchIndex > -1) {
      return listProjects[matchIndex].ls_task;
    }

    return [];
  }

  return [];
};

export const selectorCurrentProjectId = (state: RootState) =>
  state.projectReducer.currentProjectInfo?.project_id || "";

export const selectorCurrentProjectName = (state: RootState) =>
  state.projectReducer.currentProjectInfo?.project_name || "";

export const selectorProjectNameFromId = (
  state: RootState,
  projectId: string
) => {
  if (projectId) {
    const matchProjectIndex = objectIndexOf(
      state.projectReducer.listProjects,
      projectId,
      "project_id"
    );
    if (matchProjectIndex > 0) {
      return state.projectReducer.listProjects[matchProjectIndex].project_name;
    }
    return null;
  }

  return null;
};

export const selectorCurrentProjectTotalOriginalImage = (state: RootState) => {
  const { currentProjectInfo } = state.projectReducer;
  if (currentProjectInfo) {
    const { groups } = state.projectReducer.currentProjectInfo as ProjectInfo;
    if (groups) {
      return groups?.ORIGINAL?.count || 0;
    }

    return 0;
  }

  return 0;
};

export const selectorCurrentProjectTotalPreprocessImage = (
  state: RootState
) => {
  const { currentProjectInfo } = state.projectReducer;
  if (currentProjectInfo) {
    const { groups } = state.projectReducer.currentProjectInfo as ProjectInfo;
    if (groups) {
      return groups?.PREPROCESS?.count || 0;
    }

    return 0;
  }

  return 0;
};

export const selectorCurrentProjectTotalAugmentImage = (state: RootState) => {
  const { currentProjectInfo } = state.projectReducer;
  if (currentProjectInfo) {
    const { groups } = state.projectReducer.currentProjectInfo as ProjectInfo;
    if (groups) {
      return groups?.AUGMENT?.count || 0;
    }

    return 0;
  }

  return 0;
};

export const selectorCurrentProjectTotalImage = (state: RootState) => {
  const { currentProjectInfo } = state.projectReducer;
  if (currentProjectInfo) {
    const { groups } = state.projectReducer.currentProjectInfo as ProjectInfo;
    if (groups) {
      const totalOriginalImage = groups?.ORIGINAL?.count || 0;
      const totalAugmentImage = groups?.AUGMENT?.count || 0;
      const totalPreprocessImage = groups?.PREPROCESS?.count || 0;
      return totalOriginalImage + totalAugmentImage + totalPreprocessImage;
    }

    return 0;
  }

  return 0;
};

export const selectorCurrentProjectOriginalSplitDataNumber = (
  state: RootState
) => {
  const { currentProjectInfo } = state.projectReducer;
  if (currentProjectInfo) {
    const { groups } = currentProjectInfo;
    if (groups) {
      return groups.ORIGINAL?.data_number;
    }

    return null;
  }

  return null;
};

export const selectorCurrentProjectPreprocessSplitDataNumber = (
  state: RootState
) => {
  const { currentProjectInfo } = state.projectReducer;
  if (currentProjectInfo) {
    const { groups } = currentProjectInfo;
    if (groups) {
      return groups.PREPROCESS?.data_number;
    }

    return null;
  }

  return null;
};

export const selectorCurrentProjectAugmentedTimes = (state: RootState) => {
  const { currentProjectInfo } = state.projectReducer;
  if (currentProjectInfo) {
    return currentProjectInfo.times_generated;
  }

  return 0;
};

export const selectorMethodList = (state: RootState) =>
  state.projectReducer.listMethod;

export const selectorSelectedDataSource = (state: RootState) =>
  state.projectReducer.selectedDataSource;

export const selectorIsFetchingProjectTaskList = (state: RootState) =>
  state.projectReducer.isFetchingProjectTaskList;

export const selectorCurrentTaskListInfo = (state: RootState) =>
  state.projectReducer.tasks;

export const selectorIsCreatingSampleProject = (state: RootState) =>
  state.projectReducer.isCreatingSampleProject;

export const selectorDeleteConfirmDialogInfo = (state: RootState) =>
  state.projectReducer.deleteConfirmDialogInfo;

const NOT_RUNNING_TASK_STATUS_ARRAY = [
  FINISH_TASK_STATUS,
  ERROR_TASK_STATUS,
  FINISH_ERROR_TASK_STATUS,
];

export const selectorHaveTaskRunning = (state: RootState) => {
  const { tasks } = state.projectReducer;
  if (tasks) {
    return Object.keys(tasks).some(
      (taskId: string) =>
        NOT_RUNNING_TASK_STATUS_ARRAY.indexOf(tasks[taskId].status) <= -1
    );
  }

  return false;
};

export const selectorIsEditingSplitData = (state: RootState) =>
  state.projectReducer.isEditingSplitData;

export const selectorProjectThumbnail =
  (projectId: string) => (state: RootState) =>
    state.projectReducer.thumbnails[projectId];
export const selectorUpdateProjectInfoDialog = (state: RootState) =>
  state.projectReducer.updateProjectInfoDialog;
