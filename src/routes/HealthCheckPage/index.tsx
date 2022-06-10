import { useHistory, useParams } from "react-router-dom";

import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  selectorIsFetchingProjects,
  selectorListProjects,
} from "reduxes/project/selector";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { a11yProps } from "utils/general";
import { resetDataHealthCheckState } from "reduxes/healthCheck/action";
import { DATASET_HEALTH_CHECK_ROUTE_NAME } from "constants/routeName";
import { Empty, TabPanel, Link } from "components";
import HealthCheckMainContent from "./HealthCheckMainContent";

const HEALTH_CHECK_TAB_NAME = "health-check";

const HealthCheckPage = function () {
  const { projectName } = useParams<{ projectName: string }>();
  const dispatch = useDispatch();
  const [selectedTabIndex, setSelectedTabIndex] = useState(-1);
  const listProject = useSelector(selectorListProjects);
  const isFetchingProjects = useSelector(selectorIsFetchingProjects);
  const history = useHistory();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTabIndex(newValue);
    dispatch(resetDataHealthCheckState());

    if (newValue > -1 && listProject[newValue]) {
      history.push(
        `/${DATASET_HEALTH_CHECK_ROUTE_NAME}/${listProject[newValue].project_name}`
      );
    }
  };

  useEffect(() => {
    if (listProject.length !== 0) {
      if (projectName) {
        const indexOf = listProject.findIndex(
          (p) => p.project_name === projectName
        );
        setSelectedTabIndex(indexOf);

        if (indexOf > -1 && projectName !== listProject[indexOf].project_name) {
          history.push(
            `/${DATASET_HEALTH_CHECK_ROUTE_NAME}/${listProject[indexOf].project_name}`
          );
        }
      } else {
        history.push(
          `/${DATASET_HEALTH_CHECK_ROUTE_NAME}/${listProject[0].project_name}`
        );
      }
    }
  }, [listProject]);

  const renderPageContent = () => {
    if (isFetchingProjects === null || isFetchingProjects === true) {
      return (
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
    }

    if (!listProject || listProject.length <= 0) {
      return (
        <Box py={4}>
          <Empty
            description={
              <Box textAlign="center">
                <Typography color="text.secondary"> No project yet.</Typography>
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
      <Box sx={{ width: "100%", my: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTabIndex}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            {listProject.map((project, index) => (
              <Tab
                key={project.project_id}
                label={project.project_name}
                {...a11yProps(HEALTH_CHECK_TAB_NAME, index)}
              />
            ))}
          </Tabs>
        </Box>
        {listProject.map((project, index) => (
          <TabPanel
            key={project.project_id}
            tabName={HEALTH_CHECK_TAB_NAME}
            tabId={index}
            activeTabId={selectedTabIndex}
          >
            <HealthCheckMainContent projectId={project.project_id} />
          </TabPanel>
        ))}
      </Box>
    );
  };

  return (
    <Box mt={4} mb={10}>
      <Typography variant="h4" component="h1">
        Dataset Health Check
      </Typography>
      {renderPageContent()}
    </Box>
  );
};

export default HealthCheckPage;
