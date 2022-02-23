import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";
import { createSampleProject } from "reduxes/project/action";
import { getLocalStorage } from "utils/general";
import { ID_TOKEN_NAME, TOKEN_NAME } from "constants/defaultValues";
import {
  selectorIsCreatingSampleProject,
  selectorListProjects,
} from "reduxes/project/selector";
import { ApiListProjectsItem } from "reduxes/project/type";
import { FETCH_LIST_PROJECTS } from "reduxes/project/constants";
import ProjectList from "./ProjectList";

const EmptyDashboardMessage = function ({
  projectCount,
}: {
  projectCount: number;
}) {
  const isCreatingSampleProject = useSelector(selectorIsCreatingSampleProject);
  const dispatch = useDispatch();

  const onClickCreateSampleProject = () => {
    toast.info("Creating sample project...");
    dispatch(
      createSampleProject({
        idToken: getLocalStorage(ID_TOKEN_NAME) || "",
        accessToken: getLocalStorage(TOKEN_NAME) || "",
      })
    );
  };

  return (
    <Box mt={4} textAlign="center">
      {projectCount <= 0 && (
        <Typography variant="h4" component="h1">
          👋 Welcome to DAITA, let's get started.
        </Typography>
      )}
      <Typography sx={{ mt: 2 }}>
        👉 If you just want to play, you can create a sandbox project{" "}
        <Box
          component="span"
          sx={{
            borderBottom: "1px solid",
            borderColor: isCreatingSampleProject
              ? "text.secondary"
              : "text.primary",
            cursor: isCreatingSampleProject ? "default" : "pointer",
            position: "relative",
            color: isCreatingSampleProject ? "text.secondary" : undefined,
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
          onClick={
            isCreatingSampleProject ? undefined : onClickCreateSampleProject
          }
        >
          {isCreatingSampleProject && (
            <CircularProgress
              sx={{ position: "absolute", left: "calc(50% - 10px)" }}
              size={20}
            />
          )}
          here
        </Box>
        . You don't have to upload any data!
      </Typography>
    </Box>
  );
};

const Dashboard = function () {
  const projectCount = useSelector(
    (state: RootState) => state.projectReducer.listProjects.length
  );

  const dispatch = useDispatch();

  const isFetchingProjects = useSelector(
    (state: RootState) => state.projectReducer.isFetchingProjects
  );

  const listProjects = useSelector(selectorListProjects);

  const isAlreadyCreatedSampleProject = useMemo(
    () =>
      listProjects.some(
        (projectItem: ApiListProjectsItem) => projectItem.is_sample
      ),
    [listProjects]
  );

  useEffect(() => {
    dispatch({
      type: FETCH_LIST_PROJECTS.REQUESTED,
      payload: {
        idToken: getLocalStorage(ID_TOKEN_NAME),
      },
    });
  }, []);

  const renderEmptyDashboardMessage = () => {
    if (isFetchingProjects === false && !isAlreadyCreatedSampleProject) {
      return <EmptyDashboardMessage projectCount={projectCount} />;
    }

    return null;
  };

  return (
    <Container maxWidth="lg">
      <Box pb={6}>
        <Box
          mt={4}
          px={3}
          py={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderRadius={2}
          bgcolor="background.paper"
          maxWidth={200}
        >
          <AssignmentIcon fontSize="large" />

          {isFetchingProjects === null || isFetchingProjects === true ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <Typography sx={{ mt: 2 }} variant="h5" component="p">
                {projectCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                # of Projects
              </Typography>
            </>
          )}
        </Box>
        {renderEmptyDashboardMessage()}
        <Box mt={6}>
          <ProjectList />
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
