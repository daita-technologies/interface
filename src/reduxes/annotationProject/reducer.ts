import {
  CLONE_PROJECT_TO_ANNOTATION,
  SET_CURRENT_ANNOTATION_PROJECT,
  SHOW_DIALOG_CLONE_PROJECT_TO_ANNOTATION,
} from "./constants";
import {
  AnnotationProjectReducer,
  SetCurrentAnnotationProjectProps,
  SetDialogCloneProjectToAnnotationProps,
} from "./type";

const inititalState: AnnotationProjectReducer = {
  currentProjectName: "",
  isCloningProjectToAnnotation: false,
  listProjects: [
    {
      gen_status: "FINISH",
      project_name: "test",
      s3_prefix:
        "client-data-test/us-east-2:b07f3e64-5a07-4b04-82f3-fe274fca14cc/test_e69b649ba9004d7e83f4b271bfddda0a",
      project_id: "test_e69b649ba9004d7e83f4b271bfddda0a",
      description: "",
      ls_task: [],
      groups: {
        ORIGINAL: {
          count: 1,
          size: 48984,
          data_number: [0, 1, 2],
        },
      },
      thum_key:
        "client-data-test/us-east-2:b07f3e64-5a07-4b04-82f3-fe274fca14cc/test_e69b649ba9004d7e83f4b271bfddda0a/test2.jpg",
    },
    {
      gen_status: "FINISH",
      project_name: "test",
      s3_prefix:
        "client-data-test/us-east-2:68899a67-af9b-4a2a-acfe-a0f649ec453d/test_6aad460cb35643cab91326ce94b44bca",
      project_id: "test_6aad460cb35643cab91326ce94b44bca",
      description: "",
      ls_task: [],
      groups: {
        ORIGINAL: {
          count: 5000,
          size: 313033381,
          data_number: [0, 1, 2],
        },
      },
      thum_key:
        "client-data-test/us-east-2:68899a67-af9b-4a2a-acfe-a0f649ec453d/test_6aad460cb35643cab91326ce94b44bca/sample_000000.png",
    },
    {
      gen_status: "FINISH",
      project_name: "testaa",
      s3_prefix:
        "client-data-test/us-east-2:68899a67-af9b-4a2a-acfe-a0f649ec453d/testaa_66f46d0fd54e4160995a7be8615f2e19",
      project_id: "testaa_66f46d0fd54e4160995a7be8615f2e19",
      description: "ad",
      ls_task: [],
      groups: {
        ORIGINAL: {
          count: 598,
          size: 37473653,
          data_number: [0, 1, 2],
        },
      },
      thum_key:
        "client-data-test/us-east-2:68899a67-af9b-4a2a-acfe-a0f649ec453d/testaa_66f46d0fd54e4160995a7be8615f2e19/sample_002752.png",
    },
  ],
  dialogCloneProjectToAnnotation: { isShow: false },
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
  }
  return state;
};
export default annotationProjectReducer;
