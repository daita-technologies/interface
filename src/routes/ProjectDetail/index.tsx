import {
  Box,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { BeforeUnload, TabPanel, UploadFile } from "components";
import DuplicateFilesModal from "components/DuplicateFilesModal";
import {
  AUGMENTATION_GENERATE_TAB,
  GENERATING_SAMPLE_PROJECT_STATUS,
  ID_TOKEN_NAME,
  PREPROCESS_GENERATE_TAB,
} from "constants/defaultValues";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { RootState } from "reduxes";
import { selectorIsDeletingImages } from "reduxes/album/selector";
import { selectorIsDownloading } from "reduxes/download/selector";
import { changeActiveGenerateTab } from "reduxes/generate/action";
import { selectorActiveGenerateTabId } from "reduxes/generate/selector";
import { TabGenerateIdType } from "reduxes/generate/type";
import {
  fetchMethodList,
  setIsOpenDeleteProject,
} from "reduxes/project/action";
import {
  FETCH_DETAIL_PROJECT,
  FETCH_LIST_PROJECTS,
  SET_CURRENT_PROJECT,
} from "reduxes/project/constants";
import {
  selectorIsFetchingDetailProject,
  selectorMethodList,
} from "reduxes/project/selector";
import { ProjectInfo } from "reduxes/project/type";
import {
  a11yProps,
  formatBytes,
  getLocalStorage,
  separateNumber,
} from "utils/general";
import AlbumViewer from "./AlbumViewer";
import ImageAugmentation from "./ImageAugmentation";
import ProcessingOption from "./PreprocessingOption";
import TaskList from "./TaskList";

const TAB_GENERATE_NAME = "generate_tab";

const ProjectDetail = function () {
  const { projectName } = useParams<{ projectName: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentProjectInfo: ProjectInfo | null = useSelector(
    (state: RootState) => state.projectReducer.currentProjectInfo
  );
  const isFetchingDetailProject = useSelector(selectorIsFetchingDetailProject);

  const methodList = useSelector(selectorMethodList);

  const isDownloading = useSelector(selectorIsDownloading);

  const activeGenerateTabId = useSelector(selectorActiveGenerateTabId);

  const isDeletingImages = useSelector(selectorIsDeletingImages);

  useEffect(() => {
    if (!methodList) {
      dispatch(
        fetchMethodList({ idToken: getLocalStorage(ID_TOKEN_NAME) || "" })
      );
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: SET_CURRENT_PROJECT,
      payload: { projectName: projectName || "" },
    });

    dispatch({
      type: FETCH_DETAIL_PROJECT.REQUESTED,
      payload: {
        idToken: getLocalStorage(ID_TOKEN_NAME),
        projectName: projectName || "",
      },
    });

    return () => {
      dispatch({
        type: SET_CURRENT_PROJECT,
        payload: { projectName: "" },
      });
    };
  }, [location, projectName]);

  useEffect(() => {
    if (
      currentProjectInfo &&
      currentProjectInfo.is_sample &&
      currentProjectInfo.gen_status === GENERATING_SAMPLE_PROJECT_STATUS
    ) {
      const timer = setTimeout(() => {
        dispatch({
          type: FETCH_DETAIL_PROJECT.REQUESTED,
          payload: {
            idToken: getLocalStorage(ID_TOKEN_NAME),
            projectName: currentProjectInfo.project_name || "",
            notShowLoading: true,
          },
        });
        dispatch({
          type: FETCH_LIST_PROJECTS.REQUESTED,
          payload: {
            idToken: getLocalStorage(ID_TOKEN_NAME),
            notShowLoading: true,
          },
        });
      }, 1 * 60 * 1000);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {};
  }, [currentProjectInfo]);

  const renderContent = function () {
    if (isFetchingDetailProject === null || isFetchingDetailProject === true) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flex={1}
          py={6}
        >
          <CircularProgress size={20} />
        </Box>
      );
    }

    if (
      currentProjectInfo &&
      currentProjectInfo.project_id &&
      currentProjectInfo.project_name
    ) {
      // const ProjectInfo = {
      //   count_all: {
      //     N: "100000",
      //   },

      //   count_ori: {
      //     N: "1000000",
      //   },

      //   total_size: {
      //     N: "1236500000000.23",
      //   },
      // };
      const {
        groups,
        // count_all,
        // count_ori,
        // total_size,
        // identity_id,
        //  count_gen,
      } = currentProjectInfo;

      const totalOriginalImage = groups?.ORIGINAL?.count || 0;
      const totalPreprocessImage = groups?.PREPROCESS?.count || 0;
      const totalAugmentImage = groups?.AUGMENT?.count || 0;
      const totalOriginalSize = groups?.ORIGINAL?.size || 0;
      const totalPreprocessSize = groups?.PREPROCESS?.size || 0;
      const totalAugmentSize = groups?.AUGMENT?.size || 0;
      return (
        <>
          <Box flex={1} mr={1}>
            <Typography fontSize={18} fontWeight="bold">
              Data
            </Typography>
            <Typography fontSize={14}>Original</Typography>
            <Typography fontSize={14}>Preprocessing</Typography>
            <Typography fontSize={14}>Augmentation</Typography>
            <Divider sx={{ borderColor: "text.secondary", my: 1 }} />
            <Typography fontSize={18} fontWeight="bold">
              Total
            </Typography>
          </Box>
          <Box flex={1} mr={1}>
            <Typography fontSize={18} fontWeight="bold">
              Number of Images
            </Typography>
            <Typography fontSize={14}>
              {separateNumber(totalOriginalImage.toString())}
            </Typography>
            <Typography fontSize={14}>
              {separateNumber(totalPreprocessImage.toString())}
            </Typography>
            <Typography fontSize={14}>
              {separateNumber(totalAugmentImage.toString())}
            </Typography>
            <Divider sx={{ borderColor: "text.secondary", my: 1 }} />
            <Typography fontSize={18} fontWeight="bold">
              {separateNumber(
                (
                  totalOriginalImage +
                  totalPreprocessImage +
                  totalAugmentImage
                ).toString()
              )}
            </Typography>
          </Box>

          <Box flex={1} ml={1}>
            <Typography fontSize={18} fontWeight="bold">
              Dataset Storage
            </Typography>
            <Typography fontSize={14}>
              {formatBytes(totalOriginalSize)}
            </Typography>
            <Typography fontSize={14}>
              {formatBytes(totalPreprocessSize)}
            </Typography>
            <Typography fontSize={14}>
              {formatBytes(totalAugmentSize)}
            </Typography>
            <Divider sx={{ borderColor: "text.secondary", my: 1 }} />
            <Typography fontSize={18} fontWeight="bold">
              {formatBytes(
                totalOriginalSize + totalPreprocessSize + totalAugmentSize
              )}
            </Typography>
          </Box>
        </>
      );
    }

    return null;
  };

  const renderUploadFile = () => {
    if (
      currentProjectInfo &&
      currentProjectInfo.project_id &&
      currentProjectInfo.project_name
    ) {
      return (
        <Box>
          <UploadFile
            projectId={currentProjectInfo.project_id}
            projectName={currentProjectInfo.project_name}
          />
          <AlbumViewer projectId={currentProjectInfo.project_id} />
        </Box>
      );
    }

    return null;
  };

  const renderTaskList = () => <TaskList />;

  const renderDeleteContent = () => {
    if (currentProjectInfo) {
      return (
        <Box mt={10} display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            color="error"
            onClick={() =>
              dispatch(
                setIsOpenDeleteProject({
                  isOpen: true,
                  projectId: currentProjectInfo.project_id,
                  projectName,
                })
              )
            }
          >
            Delete Project
          </Button>
        </Box>
      );
    }
    return null;
  };

  const renderProject = () => {
    if (
      currentProjectInfo &&
      currentProjectInfo.is_sample &&
      currentProjectInfo.gen_status === GENERATING_SAMPLE_PROJECT_STATUS
    ) {
      return (
        <Box mt={4}>
          <Typography sx={{ mb: 2 }}>
            The project is being built, please come back in a few minutes...
          </Typography>
          <LinearProgress />
        </Box>
      );
    }
    const onChangeGenerateTab = (
      event: React.SyntheticEvent,
      newActiveTabId: TabGenerateIdType
    ) => {
      dispatch(
        changeActiveGenerateTab({
          tabId: newActiveTabId,
        })
      );
    };

    return (
      <>
        <Box my={2}>{renderTaskList()}</Box>
        <Box>
          <Box
            mt={2}
            p={2}
            display="flex"
            bgcolor="background.paper"
            borderRadius={2}
          >
            {renderContent()}
          </Box>
        </Box>
        {isFetchingDetailProject === null || isFetchingDetailProject ? (
          <Box mt={10} display="flex" justifyContent="center">
            <CircularProgress size={40} />
          </Box>
        ) : (
          renderUploadFile()
        )}
        <Box mt={2} p={2} borderRadius={2} bgcolor="background.paper" flex={1}>
          <Box display="flex" alignItems="center">
            <Typography fontSize={18}>Generate Your Data</Typography>
          </Box>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeGenerateTabId}
                onChange={onChangeGenerateTab}
                aria-label="basic tabs example"
              >
                <Tab
                  label="Preprocess"
                  {...a11yProps(TAB_GENERATE_NAME, PREPROCESS_GENERATE_TAB)}
                />
                <Tab
                  label="Augmentation"
                  {...a11yProps(TAB_GENERATE_NAME, AUGMENTATION_GENERATE_TAB)}
                />
              </Tabs>
            </Box>
            <TabPanel
              tabName={TAB_GENERATE_NAME}
              tabId={PREPROCESS_GENERATE_TAB}
              activeTabId={activeGenerateTabId}
            >
              <Box mt={2} display="flex" gap={1}>
                <ProcessingOption />
              </Box>
            </TabPanel>
            <TabPanel
              tabName={TAB_GENERATE_NAME}
              tabId={AUGMENTATION_GENERATE_TAB}
              activeTabId={activeGenerateTabId}
            >
              <Box mt={2} display="flex" gap={1}>
                <ImageAugmentation />
              </Box>
            </TabPanel>
          </Box>
        </Box>

        {renderDeleteContent()}
      </>
    );
  };

  return (
    <Box mt={4} mb={10}>
      {/* <BeforeUnload
        isActive={!!isDownloading}
        message={`We are currently processing your data dowload.\r\nAre you sure you want to quit?`}
      /> */}
      <BeforeUnload
        isActive={!!isDeletingImages}
        message="We are deleting your project, please wait for a while.\r\nAre you sure you want to quit?"
      />
      <Typography variant="h4" component="h1">
        {projectName}
      </Typography>
      <Divider sx={{ my: 1, borderWidth: 2, borderColor: "text.primary" }} />
      {renderProject()}

      <DuplicateFilesModal />
    </Box>
  );
};

export default ProjectDetail;
