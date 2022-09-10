import {
  AUGMENT_GENERATE_IMAGES_TYPE,
  LATEST_SELECTED_DATA_SOURCE_KEY_NAME,
  ORIGINAL_SOURCE,
} from "constants/defaultValues";
import { GENERATE_IMAGES } from "reduxes/generate/constants";
import { GenerateImageSucceedPayload } from "reduxes/generate/type";
import { getLocalStorage, objectIndexOf, setLocalStorage } from "utils/general";
import {
  CHANGE_SELECTED_DATA_SOURCE,
  CREATE_PROJECT,
  CREATE_SAMPLE_PROJECT,
  DELETE_PROJECT,
  FETCH_DETAIL_PROJECT,
  FETCH_LIST_PROJECTS,
  FETCH_METHOD_LIST,
  FETCH_PROJECT_TASK_LIST,
  FETCH_TASK_INFO,
  LOAD_PROJECT_THUMBNAIL_IMAGE,
  SET_CURRENT_PROJECT,
  SET_IS_EDITING_SPLIT_DATA,
  SET_IS_OPEN_CREATE_PROJECT_MODAL,
  SET_IS_OPEN_DELETE_CONFIRM,
  SET_IS_OPEN_UPDATE_PROJECT_INFO,
  SET_SPLIT_DATA_NUMBER,
  UPDATE_PROJECT_INFO,
  UPDATE_STATISTIC_PROJECT,
} from "./constants";
import {
  ApiUpdateProjectsInfo,
  ChangeSelectedDatSourcePayload,
  CreateSampleSucceedPayload,
  DeleteProjectSucceedPayload,
  FetchListMethodSucceedPayload,
  FetchTaskInfoSucceedPayload,
  LoadProjectThumbnailImagePayload,
  LoadProjectThumbnailImageSucceedPayload,
  ProjectReducerState,
  SetIsEditingSplitDataPayload,
  SetIsOpenDeleteConfirmPayload,
  SetIsOpenUpdateProjectInfoPayload,
  SetSplitDataNumberPayload,
  SPLIT_DATA_NUMBER_SOURCE_TYPE,
  UpdateProjectStatisticPayload,
} from "./type";

const inititalState: ProjectReducerState = {
  isCreatingSampleProject: false,
  isOpenCreateProjectModal: false,
  isCreatingProject: false,
  isFetchingProjects: null,
  isFetchingProjectTaskList: null,
  listProjects: [],
  currentProjectName: "",
  isFetchingDetailProject: null,
  currentProjectInfo: null,
  listMethod: null,
  selectedDataSource:
    (getLocalStorage(
      LATEST_SELECTED_DATA_SOURCE_KEY_NAME
    ) as SPLIT_DATA_NUMBER_SOURCE_TYPE) || ORIGINAL_SOURCE,
  tasks: {},
  thumbnails: {},
  deleteConfirmDialogInfo: null,
  isEditingSplitData: false,
  updateProjectInfoDialog: null,
};

const projectReducer = (
  state = inititalState,
  action: any
): ProjectReducerState => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case SET_IS_OPEN_CREATE_PROJECT_MODAL:
      return { ...state, isOpenCreateProjectModal: payload.isOpen };
    case CREATE_PROJECT.REQUESTED:
      return { ...state, isCreatingProject: true };
    case CREATE_PROJECT.SUCCEEDED: {
      const newListProject: Array<any> = [...state.listProjects];
      newListProject.unshift(payload.createdProject);
      return {
        ...state,
        isCreatingProject: false,
        listProjects: newListProject,
      };
    }
    case CREATE_PROJECT.FAILED:
      return { ...state, isCreatingProject: false };
    case FETCH_LIST_PROJECTS.REQUESTED: {
      const { notShowLoading } = payload;
      return { ...state, isFetchingProjects: !notShowLoading };
    }
    case FETCH_LIST_PROJECTS.SUCCEEDED: {
      return {
        ...state,
        isFetchingProjects: false,
        listProjects: payload.listProjects,
      };
    }
    case FETCH_LIST_PROJECTS.FAILED:
      return { ...state, isFetchingProjects: false };

    case SET_CURRENT_PROJECT:
      if (payload.projectName) {
        return { ...state, currentProjectName: payload.projectName };
      }
      setLocalStorage(LATEST_SELECTED_DATA_SOURCE_KEY_NAME, ORIGINAL_SOURCE);
      return {
        ...state,
        currentProjectName: "",
        currentProjectInfo: null,
        tasks: {},
        selectedDataSource: ORIGINAL_SOURCE,
      };
    case FETCH_DETAIL_PROJECT.REQUESTED: {
      const { notShowLoading } = payload;
      return { ...state, isFetchingDetailProject: !notShowLoading };
    }
    case FETCH_DETAIL_PROJECT.SUCCEEDED:
      return {
        ...state,
        isFetchingDetailProject: false,
        currentProjectInfo: payload.currentProjectInfo,
      };
    case FETCH_DETAIL_PROJECT.FAILED:
      return { ...state, isFetchingDetailProject: false };
    case UPDATE_STATISTIC_PROJECT: {
      const { projectId, updateInfo } =
        payload as UpdateProjectStatisticPayload;
      if (
        state.currentProjectInfo &&
        state.currentProjectInfo.project_id === projectId
      ) {
        const { groups } = state.currentProjectInfo;
        const { fileInfo, typeMethod } = updateInfo;
        const { isExist, isDelete, size, sizeOld } = fileInfo;
        let newSize = 0;
        let newCount = 0;
        if (groups) {
          newSize = groups[typeMethod]?.size || 0;
          newCount = groups[typeMethod]?.count || 0;
          if (isDelete) {
            newSize -= size;
            newCount -= 1;
          } else if (isExist) {
            newSize += fileInfo.size - (sizeOld || 0);
          } else {
            newSize += size;
            newCount += 1;
          }

          return {
            ...state,
            currentProjectInfo: {
              ...state.currentProjectInfo,
              groups: {
                ...groups,
                [typeMethod]: {
                  ...groups[typeMethod],
                  size: newSize,
                  count: newCount,
                },
              },
            },
          };
        }

        newSize = 0;
        newCount = 0;
        if (isExist) {
          newSize += fileInfo.size - (sizeOld || 0);
        } else {
          newSize += size;
          newCount += 1;
        }

        const matchProjectIndex = objectIndexOf(
          state.listProjects,
          projectId,
          "project_id"
        );

        const newListProjects = [...state.listProjects];
        if (matchProjectIndex > -1) {
          let targetGroups = newListProjects[matchProjectIndex].groups;
          if (!targetGroups) {
            targetGroups = {};
          }
          targetGroups[typeMethod] = {
            size: newSize,
            count: newCount,
            data_number: [0, 0, 0],
          };
        }

        return {
          ...state,
          currentProjectInfo: {
            ...state.currentProjectInfo,
            groups: {
              [typeMethod]: {
                size: newSize,
                count: newCount,
                data_number: null,
              },
            },
          },
        };
      }
      return state;
    }
    case SET_SPLIT_DATA_NUMBER: {
      const { typeMethod, splitDataNumber } =
        payload as SetSplitDataNumberPayload;
      if (state.currentProjectInfo) {
        const { groups } = state.currentProjectInfo;
        if (groups) {
          return {
            ...state,
            currentProjectInfo: {
              ...state.currentProjectInfo,
              groups: {
                ...groups,
                [typeMethod]: {
                  ...groups[typeMethod],
                  data_number: splitDataNumber,
                },
              },
            },
          };
        }

        return state;
      }
      return state;
    }
    case FETCH_METHOD_LIST.REQUESTED: {
      return state;
    }
    case FETCH_METHOD_LIST.SUCCEEDED: {
      const { listMethod } = payload as FetchListMethodSucceedPayload;
      return { ...state, listMethod };
    }
    case FETCH_METHOD_LIST.FAILED: {
      return state;
    }
    case CHANGE_SELECTED_DATA_SOURCE: {
      const { newSelectedDataSource } =
        payload as ChangeSelectedDatSourcePayload;
      setLocalStorage(
        LATEST_SELECTED_DATA_SOURCE_KEY_NAME,
        newSelectedDataSource
      );
      return {
        ...state,
        selectedDataSource: newSelectedDataSource,
      };
    }
    case FETCH_PROJECT_TASK_LIST.REQUESTED:
      return {
        ...state,
        isFetchingProjectTaskList: true,
      };
    case FETCH_PROJECT_TASK_LIST.SUCCEEDED:
      return {
        ...state,
        isFetchingProjectTaskList: false,
      };
    case FETCH_PROJECT_TASK_LIST.FAILED:
      return {
        ...state,
        isFetchingProjectTaskList: false,
      };
    case FETCH_TASK_INFO.REQUESTED:
      return state;
    case FETCH_TASK_INFO.SUCCEEDED: {
      const { taskInfo, projectId } = payload as FetchTaskInfoSucceedPayload;
      const { currentProjectInfo } = state;
      if (currentProjectInfo) {
        const { project_id, ls_task } = currentProjectInfo;

        if (project_id !== projectId) {
          return state;
        }

        if (project_id) {
          const matchProjectIndex = objectIndexOf(
            state.listProjects,
            project_id,
            "project_id"
          );

          if (matchProjectIndex > -1) {
            const newListProject = [...state.listProjects];

            const matchTaskIdIndex = objectIndexOf(
              newListProject[matchProjectIndex].ls_task,
              taskInfo.task_id,
              "task_id"
            );

            // NOTE: add fetched task to listProject
            if (matchTaskIdIndex > -1) {
              newListProject[matchProjectIndex].ls_task[matchTaskIdIndex] = {
                task_id: taskInfo.task_id,
                project_id,
                process_type: taskInfo.process_type,
              };
            } else {
              newListProject[matchProjectIndex].ls_task.push({
                task_id: taskInfo.task_id,
                project_id,
                process_type: taskInfo.process_type,
              });
            }

            // NOTE: add fetched task to currentInfo
            const newCurrentProjectInfo = { ...currentProjectInfo };
            const task = ls_task.find((t) => t.task_id === taskInfo.task_id);
            if (!task) {
              newCurrentProjectInfo.ls_task.push(taskInfo);
            }

            return {
              ...state,
              tasks: {
                ...state.tasks,
                [taskInfo.task_id]: taskInfo,
              },
              listProjects: newListProject,
              currentProjectInfo: newCurrentProjectInfo,
              isFetchingProjectTaskList: false,
            };
          }

          return {
            ...state,
            tasks: {
              ...state.tasks,
              [taskInfo.task_id]: taskInfo,
            },
          };
        }

        return state;
      }

      return state;
    }
    case FETCH_TASK_INFO.FAILED:
      return state;
    case CREATE_SAMPLE_PROJECT.REQUESTED:
      return {
        ...state,
        isCreatingSampleProject: true,
      };
    case CREATE_SAMPLE_PROJECT.FAILED:
      return {
        ...state,
        isCreatingSampleProject: false,
      };
    case CREATE_SAMPLE_PROJECT.SUCCEEDED: {
      return {
        ...state,
        isCreatingSampleProject: false,
        listProjects: [
          ...state.listProjects,
          {
            ...(payload as CreateSampleSucceedPayload),
            groups: null,
            ls_task: [],
            description: "",
          },
        ],
      };
    }
    case SET_IS_OPEN_DELETE_CONFIRM: {
      return {
        ...state,
        deleteConfirmDialogInfo: payload as SetIsOpenDeleteConfirmPayload,
      };
    }
    case DELETE_PROJECT.SUCCEEDED: {
      const { projectId } = payload as DeleteProjectSucceedPayload;
      const matchProjectIndex = objectIndexOf(
        state.listProjects,
        projectId,
        "project_id"
      );
      if (matchProjectIndex > -1) {
        const newListProjects = [...state.listProjects];
        newListProjects.splice(matchProjectIndex, 1);
        return {
          ...state,
          listProjects: newListProjects,
          deleteConfirmDialogInfo: null,
          currentProjectInfo: null,
        };
      }
      return {
        ...state,
        deleteConfirmDialogInfo: null,
      };
    }

    case GENERATE_IMAGES.SUCCEEDED: {
      const { currentProjectInfo } = state;
      const { generateMethod } = payload as GenerateImageSucceedPayload;
      if (
        currentProjectInfo &&
        generateMethod === AUGMENT_GENERATE_IMAGES_TYPE
      ) {
        return {
          ...state,
          currentProjectInfo: {
            ...currentProjectInfo,
            times_generated: (currentProjectInfo.times_generated || 0) + 1,
          },
        };
      }
      return state;
    }

    case SET_IS_EDITING_SPLIT_DATA: {
      const { isEditing } = payload as SetIsEditingSplitDataPayload;
      return { ...state, isEditingSplitData: isEditing };
    }

    case LOAD_PROJECT_THUMBNAIL_IMAGE.REQUESTED: {
      const { projectId } = payload as LoadProjectThumbnailImagePayload;
      const newThumbnails = { ...state.thumbnails };
      newThumbnails[projectId] = null;
      return { ...state, thumbnails: newThumbnails };
    }
    case LOAD_PROJECT_THUMBNAIL_IMAGE.SUCCEEDED:
    case LOAD_PROJECT_THUMBNAIL_IMAGE.FAILED: {
      const { projectId, thumbnailUrl } =
        payload as LoadProjectThumbnailImageSucceedPayload;
      const newThumbnails = { ...state.thumbnails };
      newThumbnails[projectId] = thumbnailUrl;
      return { ...state, thumbnails: newThumbnails };
    }
    case SET_IS_OPEN_UPDATE_PROJECT_INFO: {
      return {
        ...state,
        updateProjectInfoDialog: payload as SetIsOpenUpdateProjectInfoPayload,
      };
    }
    case UPDATE_PROJECT_INFO.REQUESTED: {
      const { projectId, projectName, updateInfo } =
        payload as SetIsOpenUpdateProjectInfoPayload;
      return {
        ...state,
        updateProjectInfoDialog: {
          ...state.updateProjectInfoDialog,
          isOpen: true,
          projectId,
          projectName,
          updateInfo,
          isProcessing: true,
        },
      };
    }
    case UPDATE_PROJECT_INFO.SUCCEEDED: {
      const { project_id, project_name, description } =
        payload as ApiUpdateProjectsInfo;
      const newListProject = [...state.listProjects];
      const project = newListProject.find((pj) => pj.project_id == project_id);
      if (project) {
        project.project_name = project_name;
        project.description = description;
      }
      return {
        ...state,
        listProjects: newListProject,
        updateProjectInfoDialog: {
          isOpen: false,
          isProcessing: false,
        },
      };
    }
    case UPDATE_PROJECT_INFO.FAILED: {
      // const { projectId } = payload as UpdateProjectInfoPayload;
      if (state.updateProjectInfoDialog) {
        return {
          ...state,
          updateProjectInfoDialog: {
            ...state.updateProjectInfoDialog,
            isProcessing: false,
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export default projectReducer;
