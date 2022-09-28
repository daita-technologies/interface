import { Box, Button, Container, Typography } from "@mui/material";
import { ID_TOKEN_NAME } from "constants/defaultValues";
import { ANNOTATION_PROJECT_ROUTE_NAME } from "constants/routeName";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchListAnnotationProjects } from "reduxes/annotationProject/action";
import { selectorAnnotationListProjects } from "reduxes/annotationProject/selector";
import { ApiListAnnotationProjectsItem } from "reduxes/annotationProject/type";
import { getLocalStorage } from "utils/general";
import { AnnotationProjectItemProps } from "./type";

const ProjectItem = function ({ projectInfo }: AnnotationProjectItemProps) {
  const history = useHistory();
  const dispatch = useDispatch();

  const limitTooLongLineStyle = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    maxWidth: 200,
    lineHeight: 1.3,
  };
  const handleOnClickProjectItem = () => {
    history.push(
      `/${ANNOTATION_PROJECT_ROUTE_NAME}/${projectInfo.project_name}`
    );
  };
  return (
    <Box
      sx={{ cursor: "pointer" }}
      flexBasis="calc(33.33% - 6*8px + 6/3*8px)"
      bgcolor="primary.dark"
      borderRadius={2}
      py={2}
      onClick={handleOnClickProjectItem}
    >
      <Box display="flex" alignItems="center" pb={1} px={2} height={100}>
        <Box>
          <Typography sx={limitTooLongLineStyle} variant="h6">
            {projectInfo.project_name}
          </Typography>
        </Box>
      </Box>
      <Box
        bgcolor="grey.400"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight={160}
        maxHeight={160}
      ></Box>
      <Box
        pt={1}
        px={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button sx={{ padding: 0 }} onClick={() => console.log("object")}>
          <Typography color="text.primary" fontSize={14} fontWeight="medium">
            Open
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};
const annotationProject = function () {
  const dispatch = useDispatch();
  const listProjects = useSelector(selectorAnnotationListProjects);
  useEffect(() => {
    dispatch(
      fetchListAnnotationProjects({ idToken: getLocalStorage(ID_TOKEN_NAME) })
    );
  }, []);
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          ":after": {
            content: " ",
            flex: "auto",
          },
        }}
        display="flex"
        gap={6}
        flexWrap="wrap"
      >
        {listProjects.map((project: ApiListAnnotationProjectsItem) => (
          <ProjectItem key={project.project_id} projectInfo={project} />
        ))}
      </Box>
    </Container>
  );
};
export default annotationProject;
