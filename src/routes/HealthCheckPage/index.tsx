import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { selectorListProjects } from "reduxes/project/selector";
import {
  // useDispatch,
  useSelector,
} from "react-redux";
import { CircularProgress } from "@mui/material";
import { a11yProps } from "utils/general";
import { Empty, TabPanel } from "components";
import HealthCheckMainContent from "./HealthCheckMainContent";

const HEALTH_CHECK_TAB_NAME = "health-check";

const HealthCheckPage = function () {
  const { projectName } = useParams<{ projectName: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const listProject = useSelector(selectorListProjects);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  // const dispatch = useDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTabIndex(newValue);
  };

  // useEffect(() => {
  //   dispatch()
  // }, []);

  useEffect(() => {
    if (listProject.length !== 0) {
      if (projectName) {
        const indexOf = projectName
          ? listProject.findIndex((p) => p.project_name === projectName)
          : 0;
        if (indexOf !== -1) {
          setSelectedTabIndex(indexOf + 1);
        } else {
          setSelectedTabIndex(-1);
        }
      }
      setIsLoading(false);
    }
  }, [listProject]);

  const renderPageContent = () => {
    if (isLoading) {
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
        <Box>
          <Empty />
        </Box>
      );
    }

    if (selectedTabIndex === -1) {
      return (
        <Typography component="h2">{`Project ${projectName} is not found`}</Typography>
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
        Data Health Check
      </Typography>
      {renderPageContent()}
    </Box>
  );
};

export default HealthCheckPage;
