import {
  CLONE_PROJECT_TO_ANNOTATION,
  FETCH_ANNOTATION_FILES,
  FETCH_ANNOTATION_AND_FILE_INFO,
  FETCH_DETAIL_ANNOTATION_PROJECT,
  FETCH_LIST_ANNOTATION_PROJECTS,
  SET_CURRENT_ANNOTATION_PROJECT,
  SHOW_DIALOG_CLONE_PROJECT_TO_ANNOTATION,
} from "./constants";
import {
  AnnotationFilesApi,
  AnnotationProjectReducer,
  FetchDetailAnnotationProjectsProps,
  SetCurrentAnnotationProjectProps,
  SetDialogCloneProjectToAnnotationProps,
} from "./type";

const inititalState: AnnotationProjectReducer = {
  currentProjectName: "",
  isCloningProjectToAnnotation: false,
  // listProjects: [
  //   {
  //     gen_status: "FINISH",
  //     project_name: "fdsfdsfds",
  //     is_sample: false,
  //     s3_prefix:
  //       "client-data-test/us-east-2:68899a67-af9b-4a2a-acfe-a0f649ec453d/fdsfdsfds_cfecb8116e254f7ab32cf1cc0470a9cf",
  //     project_id: "fdsfdsfds_cfecb8116e254f7ab32cf1cc0470a9cf",
  //     description: "",
  //     ls_task: [],
  //     groups: {
  //       ORIGINAL: {
  //         count: 5000,
  //         size: 313033381,
  //         data_number: [0, 1, 2],
  //       },
  //     },
  //     thum_key:
  //       "client-data-test/us-east-2:68899a67-af9b-4a2a-acfe-a0f649ec453d/fdsfdsfds_cfecb8116e254f7ab32cf1cc0470a9cf/sample_000000.png",
  //   },
  //   {
  //     gen_status: "FINISH",
  //     project_name: "test",
  //     is_sample: false,
  //     s3_prefix:
  //       "client-data-test/us-east-2:68899a67-af9b-4a2a-acfe-a0f649ec453d/test_6aad460cb35643cab91326ce94b44bca",
  //     project_id: "test_6aad460cb35643cab91326ce94b44bca",
  //     description: "",
  //     ls_task: [],
  //     groups: {
  //       ORIGINAL: {
  //         count: 5000,
  //         size: 313033381,
  //         data_number: [0, 1, 2],
  //       },
  //     },
  //     thum_key:
  //       "client-data-test/us-east-2:68899a67-af9b-4a2a-acfe-a0f649ec453d/test_6aad460cb35643cab91326ce94b44bca/sample_000000.png",
  //   },
  //   {
  //     gen_status: "FINISH",
  //     project_name: "testaa",
  //     is_sample: false,
  //     s3_prefix:
  //       "client-data-test/us-east-2:68899a67-af9b-4a2a-acfe-a0f649ec453d/testaa_66f46d0fd54e4160995a7be8615f2e19",
  //     project_id: "testaa_66f46d0fd54e4160995a7be8615f2e19",
  //     description: "ad",
  //     ls_task: [],
  //     groups: {
  //       ORIGINAL: {
  //         count: 598,
  //         size: 37473653,
  //         data_number: [0, 1, 2],
  //       },
  //     },
  //     thum_key:
  //       "client-data-test/us-east-2:68899a67-af9b-4a2a-acfe-a0f649ec453d/testaa_66f46d0fd54e4160995a7be8615f2e19/sample_002752.png",
  //   },
  // ],
  listProjects: [],
  dialogCloneProjectToAnnotation: { isShow: false },
  isFetchingProjects: false,
  currentProjectInfo: null,
  isFetchingDetailProject: false,
  currentAnnotationAndFileInfo: null,
  currentAnnotationFiles: null,
};
const annotationProjectReducer = (
  state = inititalState,
  action: any
): AnnotationProjectReducer => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case CLONE_PROJECT_TO_ANNOTATION.REQUESTED:
      return { ...state, isCloningProjectToAnnotation: true };
    case CLONE_PROJECT_TO_ANNOTATION.SUCCEEDED:
      return {
        ...state,
        isCloningProjectToAnnotation: false,
        dialogCloneProjectToAnnotation: { isShow: false, projectName: "" },
      };
    case CLONE_PROJECT_TO_ANNOTATION.FAILED:
      return { ...state, isCloningProjectToAnnotation: false };
    case SHOW_DIALOG_CLONE_PROJECT_TO_ANNOTATION:
      const { dialogCloneProjectToAnnotation } =
        payload as SetDialogCloneProjectToAnnotationProps;
      if (!dialogCloneProjectToAnnotation.isShow) {
        dialogCloneProjectToAnnotation.projectName = "";
      }
      return { ...state, dialogCloneProjectToAnnotation };
    case SET_CURRENT_ANNOTATION_PROJECT: {
      const { projectName } = payload as SetCurrentAnnotationProjectProps;
      return { ...state, currentProjectName: projectName };
    }
    case FETCH_LIST_ANNOTATION_PROJECTS.REQUESTED: {
      const { notShowLoading } = payload;
      return { ...state, isFetchingProjects: !notShowLoading };
    }
    case FETCH_LIST_ANNOTATION_PROJECTS.SUCCEEDED: {
      return {
        ...state,
        isFetchingProjects: false,
        listProjects: payload.listProjects,
      };
    }
    case FETCH_LIST_ANNOTATION_PROJECTS.FAILED:
      return { ...state, isFetchingProjects: false };
    case FETCH_DETAIL_ANNOTATION_PROJECT.REQUESTED: {
      return { ...state, isFetchingDetailProject: true };
    }
    case FETCH_DETAIL_ANNOTATION_PROJECT.SUCCEEDED:
      return {
        ...state,
        isFetchingDetailProject: false,
        currentProjectInfo: payload.currentProjectInfo,
      };
    case FETCH_DETAIL_ANNOTATION_PROJECT.FAILED:
      return { ...state, isFetchingDetailProject: false };
    case FETCH_ANNOTATION_AND_FILE_INFO.SUCCEEDED:
      console.log(
        " payload.currentAnnotationAndFileInfo",
        payload.currentAnnotationAndFileInfo
      );
      return {
        ...state,
        currentAnnotationAndFileInfo: payload.currentAnnotationAndFileInfo,
      };
    case FETCH_ANNOTATION_FILES.SUCCEEDED:
      const { items, next_token, projectId } = payload as AnnotationFilesApi;
      const { currentAnnotationFiles } = state;
      if (
        currentAnnotationFiles &&
        state.currentProjectInfo?.project_id === projectId
      ) {
        currentAnnotationFiles.next_token = { ...next_token };
        currentAnnotationFiles.items = [
          ...currentAnnotationFiles.items,
          ...items,
        ];
      } else {
        state.currentAnnotationFiles = { items, next_token, projectId };
      }
      return {
        ...state,
      };
  }
  return state;
};
export default annotationProjectReducer;