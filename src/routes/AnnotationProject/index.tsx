import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import {
  ID_TOKEN_NAME,
  SYSTEM_DATE_TIME_FORMAT,
} from "constants/defaultValues";
import { ANNOTATION_PROJECT_DETAIL_ROUTE_NAME } from "constants/routeName";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { fetchListAnnotationProjects } from "reduxes/annotationProject/action";
import {
  selectorAnnotationListProjects,
  selectorIsFetchingListAnnotationProject,
} from "reduxes/annotationProject/selector";
import { ApiListAnnotationProjectsItem } from "reduxes/annotationProject/type";
import { getLocalStorage, getMomentWithCurrentTimeZone } from "utils/general";
import moment from "moment";
import { Empty } from "components";
import { AnnotationProjectItemProps } from "./type";

const limitTooLongLineStyle = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  lineHeight: 1.3,
  minHeight: 54,
};

function ProjectItem({ projectInfo }: AnnotationProjectItemProps) {
  const history = useHistory();

  const handleOnClickProjectItem = () => {
    history.push(
      `/${ANNOTATION_PROJECT_DETAIL_ROUTE_NAME}/${projectInfo.project_name}`
    );
  };
  return (
    <Box
      sx={{ cursor: "pointer" }}
      flexBasis="calc(33.33% - 6*8px + 6/3*8px)"
      bgcolor="primary.dark"
      borderRadius={2}
      p={2}
      onClick={handleOnClickProjectItem}
    >
      <Typography sx={limitTooLongLineStyle} variant="h6">
        {projectInfo.project_name}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        mt={1}
        gap={1}
        color="text.secondary"
        justifyContent="flex-start"
      >
        <TodayIcon sx={{ color: "text.secondary" }} fontSize="small" />
        <Typography variant="caption">
          {getMomentWithCurrentTimeZone(
            moment(projectInfo.created_date)
          ).format(SYSTEM_DATE_TIME_FORMAT)}
        </Typography>
      </Box>
      <Button
        sx={{
          mt: "auto",
          padding: 0,
          justifyContent: "flex-start",
          marginTop: 3,
        }}
      >
        <Typography color="text.primary" fontSize={14} fontWeight="medium">
          Open
        </Typography>
      </Button>
    </Box>
  );
}
function annotationProject() {
  const dispatch = useDispatch();
  const isFetchingProjects = useSelector(
    selectorIsFetchingListAnnotationProject
  );
  const listProjects = useSelector(selectorAnnotationListProjects);
  useEffect(() => {
    dispatch(
      fetchListAnnotationProjects({ idToken: getLocalStorage(ID_TOKEN_NAME) })
    );
  }, []);

  const renderPageContent = () => {
    if (isFetchingProjects === null || isFetchingProjects === true) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          flex={1}
          py={6}
        >
          <CircularProgress size={50} />
          <Typography mt={1}>Fetching project informations...</Typography>
        </Box>
      );
    }

    if (!listProjects || listProjects.length <= 0) {
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

    return listProjects.map((project: ApiListAnnotationProjectsItem) => (
      <ProjectItem key={project.project_id} projectInfo={project} />
    ));
  };

  return (
    <Container maxWidth="lg">
      <Typography mt={4} variant="h4" component="h1">
        Annotation Dashboard
      </Typography>
      <Box
        sx={{
          ":after": {
            content: " ",
            flex: "auto",
          },
        }}
        display="flex"
        mt={6}
        gap={6}
        flexWrap="wrap"
      >
        {renderPageContent()}
      </Box>
    </Container>
  );
}
export default annotationProject;
