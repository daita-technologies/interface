import { Link, useHistory, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  selectorIsFetchingProjects,
  selectorListProjects,
} from "reduxes/project/selector";
import { selectorIsTaskPageLoading } from "reduxes/task/selector";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { Empty, TabPanel } from "components";
import { a11yProps } from "utils/general";
import { getTaskListInfo } from "reduxes/task/action";
import {
  AUGMENT_TASK_PROCESS_TYPE,
  DOWNLOAD_TASK_PROCESS_TYPE,
  GENERATE_REFERENCE_IMAGE_TYPE,
  HEALTHCHECK_TASK_PROCESS_TYPE,
  PREPROCESS_TASK_PROCESS_TYPE,
  UPLOAD_TASK_PROCESS_TYPE,
} from "constants/defaultValues";

import { TASK_LIST_PAGE_SIZE } from "reduxes/task/constants";
import TaskViewer from "./TaskViewer";

const TASK_LIST_TAB_NAME = "task-list";
const TASK_LIST_ALL_TAB_NAME = "All";

const TaskDashboard = function () {
  const { projectName } = useParams<{ projectName: string }>();
  const isPageLoading = useSelector(selectorIsTaskPageLoading);
  const listProject = useSelector(selectorListProjects);
  const isFetchingProjects = useSelector(selectorIsFetchingProjects);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const history = useHistory();
  const dispatch = useDispatch();

  const selectedProjectId = useMemo(() => {
    if (selectedTabIndex > 0) {
      // NOTE: -1 because of first index is "All projects"
      if (listProject && listProject[selectedTabIndex - 1]) {
        return listProject[selectedTabIndex - 1].project_id;
      }
    }

    return "";
  }, [selectedTabIndex]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // NOTE: newValue is index include "0 - All projects"
    if (newValue > -1) {
      if (newValue === 0) {
        history.push(`/task-list`);
      } else if (listProject[newValue - 1]) {
        // NOTE: -1 because of first index is "All projects"
        history.push(`/task-list/${listProject[newValue - 1].project_name}`);
      }
    }
  };

  const handleFetchTaskListInfo = (projectId: string = "") => {
    dispatch(
      getTaskListInfo({
        filter: {
          projectId,
          processType: [],
          statusQuery: [],
        },
        pagination: {
          pageToken: null,
        },
        sizeListItemsQuery: TASK_LIST_PAGE_SIZE,
      })
    );
  };

  const handleRouteChange = () => {
    if (listProject.length !== 0) {
      if (projectName) {
        const indexOf = listProject.findIndex(
          (p) => p.project_name === projectName
        );

        if (indexOf > -1) {
          // NOTE: +1 because of first index is "All projects"
          setSelectedTabIndex(indexOf + 1);
          history.push(`/task-list/${listProject[indexOf].project_name}`);
          handleFetchTaskListInfo(listProject[indexOf].project_id);
        } else {
          setSelectedTabIndex(0);
          history.push(`/task-list`);
          handleFetchTaskListInfo();
        }
      } else {
        setSelectedTabIndex(0);
        history.push(`/task-list`);
        handleFetchTaskListInfo();
      }
    }
  };

  useEffect(() => {
    handleRouteChange();
  }, [listProject, projectName]);

  const renderLoadingBox = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flex={1}
      py={6}
    >
      <CircularProgress size={50} />
    </Box>
  );

  const renderTabContent = () => {
    if (isPageLoading === null || isPageLoading === true) {
      return renderLoadingBox();
    }

    return (
      <>
        <TaskViewer
          projectId={selectedProjectId}
          taskProcessType={PREPROCESS_TASK_PROCESS_TYPE}
        />
        <TaskViewer
          projectId={selectedProjectId}
          taskProcessType={AUGMENT_TASK_PROCESS_TYPE}
        />
        <TaskViewer
          projectId={selectedProjectId}
          taskProcessType={HEALTHCHECK_TASK_PROCESS_TYPE}
        />
        <TaskViewer
          projectId={selectedProjectId}
          taskProcessType={UPLOAD_TASK_PROCESS_TYPE}
        />
        <TaskViewer
          projectId={selectedProjectId}
          taskProcessType={DOWNLOAD_TASK_PROCESS_TYPE}
        />
        <TaskViewer
          projectId={selectedProjectId}
          taskProcessType={GENERATE_REFERENCE_IMAGE_TYPE}
        />
      </>
    );
  };

  const renderPageContent = () => {
    if (isFetchingProjects === null || isFetchingProjects === true) {
      return renderLoadingBox();
    }

    if (!listProject || listProject.length <= 0) {
      return (
        <Box py={4}>
          <Empty
            description={
              <Box textAlign="center">
                <Typography color="text.secondary"> No Project Yet.</Typography>
                <Typography color="text.secondary">
                  Go to <Link to="/dashboard">Dashboard</Link> and create a new
                  project.
                </Typography>
              </Box>
            }
          />
        </Box>
      );
    }

    if (selectedTabIndex === -1) {
      return (
        <Box mt={4}>
          <Typography component="h2">
            The project{" "}
            <Typography component="span" fontWeight="bold">
              {projectName}
            </Typography>{" "}
            was not found.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTabIndex}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={TASK_LIST_ALL_TAB_NAME}
              {...a11yProps(TASK_LIST_TAB_NAME, 0)}
            />
            {listProject.map((project, index) => (
              <Tab
                key={project.project_id}
                label={project.project_name}
                {...a11yProps(TASK_LIST_TAB_NAME, index + 1)}
              />
            ))}
          </Tabs>
        </Box>
        <TabPanel
          tabName={TASK_LIST_TAB_NAME}
          tabId={0}
          activeTabId={selectedTabIndex}
        >
          {renderTabContent()}
        </TabPanel>
        {listProject.map((project, index) => (
          <TabPanel
            key={project.project_id}
            tabName={TASK_LIST_TAB_NAME}
            tabId={index + 1}
            activeTabId={selectedTabIndex}
          >
            {renderTabContent()}
          </TabPanel>
        ))}
      </Box>
    );
  };

  return (
    <Box mt={4} mb={10}>
      <Typography variant="h4" component="h1">
        Task List
      </Typography>
      {renderPageContent()}
    </Box>
  );
};

export default TaskDashboard;
