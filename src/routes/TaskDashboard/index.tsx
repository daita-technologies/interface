import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TaskViewer from "./TaskViewer";
import { selectorListProjects } from "reduxes/project/selector";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TaskDashboard = function () {
  const { projectName } = useParams<{ projectName: string }>();
  const [isLoading, setIsLoading] = useState(!!projectName);
  const listProject = useSelector(selectorListProjects);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTabIndex(newValue);
  };
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
  if (selectedTabIndex === -1) {
    return <h1>{`Project ${projectName} is not found`}</h1>;
  }
  return (
    <Box mt={4} mb={10}>
      <Typography variant="h4" component="h1">
        Task List
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTabIndex}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All" {...a11yProps(0)} />
            {listProject.map((project, index) => (
              <Tab
                key={project.project_id}
                label={project.project_name}
                {...a11yProps(index + 1)}
              />
            ))}
          </Tabs>
        </Box>
        <TabPanel value={selectedTabIndex} index={0}>
          <TaskViewer imageSourceType="PREPROCESS" listProject={listProject} />
          <TaskViewer imageSourceType="AUGMENT" listProject={listProject} />
        </TabPanel>
        {listProject.map((project, index) => (
          <TabPanel
            key={project.project_id}
            value={selectedTabIndex}
            index={index + 1}
          >
            <TaskViewer
              projectName={project.project_name}
              imageSourceType="PREPROCESS"
              listProject={listProject}
            />
            <TaskViewer
              projectName={project.project_name}
              imageSourceType="AUGMENT"
              listProject={listProject}
            />
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default TaskDashboard;
