import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StorageIcon from "@mui/icons-material/Storage";
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  CircularProgress,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setShowDialogCloneProjectToAnnotation } from "reduxes/annotationProject/action";
import {
  loadProjectThumbnailImage,
  setIsOpenDeleteProject,
  setIsOpenUpdateProjectInfo,
} from "reduxes/project/action";
import { SET_IS_OPEN_CREATE_PROJECT_MODAL } from "reduxes/project/constants";
import {
  selectorIsFetchingProjects,
  selectorListProjects,
  selectorProjectThumbnail,
} from "reduxes/project/selector";
import {
  ApiListProjectsItem,
  SetIsOpenUpdateProjectInfoPayload,
} from "reduxes/project/type";
import { formatBytes, separateNumber } from "utils/general";
import { ProjectItemProps } from "./type";
import UpdateProjectInfoDialog from "./UpdateProjectInfoDialog";

const ProjectItemMenu = React.forwardRef<
  HTMLDivElement,
  {
    projectId: string;
    projectName: string;
    description: string;
  }
>(({ projectId, projectName, description }, menuRef) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
    const isOpenUpdateProjectInfoPayload: SetIsOpenUpdateProjectInfoPayload = {
      isOpen: true,
      isProcessing: false,
      projectId,
      projectName,
      updateInfo: {
        projectName,
        description,
      },
    };
    dispatch(setIsOpenUpdateProjectInfo(isOpenUpdateProjectInfoPayload));
    event.stopPropagation();
  };
  const handleCloneToAnnotationClick = () => {
    dispatch(
      setShowDialogCloneProjectToAnnotation({
        dialogCloneProjectToAnnotation: {
          isShow: true,
          projectName,
        },
      })
    );
  };
  return (
    <>
      <IconButton className="dot-option-symbol" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        ref={menuRef}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            dispatch(
              setIsOpenDeleteProject({ isOpen: true, projectId, projectName })
            );
          }}
        >
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditClick}>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloneToAnnotationClick}>
          <ListItemText>Clone to Annotation</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
});

const ProjectItem = function ({ projectInfo }: ProjectItemProps) {
  const optionMenuWrapperRef = useRef<HTMLDivElement>();
  const optionMenuRef = React.createRef<HTMLDivElement>();
  const history = useHistory();
  const dispatch = useDispatch();

  const { groups, project_name, project_id, thum_key, description } =
    projectInfo;

  const projectThumbnailUrl = useSelector(selectorProjectThumbnail(project_id));

  useEffect(() => {
    dispatch(
      loadProjectThumbnailImage({
        projectId: project_id,
        fullPhotoKey: thum_key,
      })
    );
  }, []);

  const getTotalProjectSize = () => {
    if (groups) {
      return (
        (groups.ORIGINAL?.size || 0) +
        (groups.PREPROCESS?.size || 0) +
        (groups.AUGMENT?.size || 0)
      );
    }

    return 0;
  };

  const getTotalProjectCount = () => {
    if (groups) {
      return (
        (groups.ORIGINAL?.count || 0) +
        (groups.PREPROCESS?.count || 0) +
        (groups.AUGMENT?.count || 0)
      );
    }

    return 0;
  };

  const handleOnClickProjectItem = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (optionMenuWrapperRef.current) {
      if (optionMenuWrapperRef.current.contains(event.target as Node)) {
        // do nothing
      } else if (
        optionMenuRef.current &&
        optionMenuRef.current.contains(event.target as Element)
      ) {
        // do nothing
      } else {
        history.push(`/project/${project_name}`);
      }
    } else {
      history.push(`/project/${project_name}`);
    }
  };

  const renderThumbnail = (isContent: boolean) => {
    if (projectThumbnailUrl === null) {
      return <CircularProgress />;
    }

    if (projectThumbnailUrl === "") {
      return (
        <CategoryIcon sx={isContent ? { width: 60, height: 60 } : undefined} />
      );
    }
    return (
      <CardMedia
        sx={{ maxHeight: 160 }}
        component="img"
        src={projectThumbnailUrl}
      />
    );
  };
  const limitTooLongLineStyle = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    maxWidth: 200,
    lineHeight: 1.3,
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
        {projectThumbnailUrl === null ? (
          <CircularProgress sx={{ mr: 2 }} size={20} />
        ) : (
          <Avatar sx={{ marginRight: 2 }} src={projectThumbnailUrl}>
            <CategoryIcon />
          </Avatar>
        )}
        <Box>
          <Typography sx={limitTooLongLineStyle} variant="h6">
            {project_name}
          </Typography>
          {description && description !== "" && (
            <Typography sx={limitTooLongLineStyle} variant="body2">
              {description}
            </Typography>
          )}
        </Box>

        <Box ref={optionMenuWrapperRef} ml="auto">
          <ProjectItemMenu
            ref={optionMenuRef}
            projectId={project_id}
            projectName={project_name}
            description={description}
          />
        </Box>
      </Box>
      <Box
        bgcolor="grey.400"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight={160}
        maxHeight={160}
      >
        {renderThumbnail(true)}
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        py={1}
        px={2}
      >
        <StorageIcon sx={{ width: 14, height: 14, marginRight: "6px" }} />
        <Typography variant="caption" lineHeight={1}>
          {formatBytes(getTotalProjectSize())}
        </Typography>
      </Box>
      <Box
        pt={1}
        px={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          sx={{ padding: 0 }}
          onClick={() => history.push(`/project/${project_name}`)}
        >
          <Typography color="text.primary" fontSize={14} fontWeight="medium">
            Open
          </Typography>
        </Button>
        <Typography variant="body2" fontStyle="italic">
          Dataset Size: {separateNumber(getTotalProjectCount().toString())}{" "}
          Images
        </Typography>
      </Box>
    </Box>
  );
};

const ProjectList = function () {
  const dispatch = useDispatch();
  const listProjects = useSelector(selectorListProjects);
  const isFetchingProjects = useSelector(selectorIsFetchingProjects);

  const renderCreateNewProjectButton = () => (
    <Button
      sx={{
        backgroundColor: "primary.dark",
        color: "text.primary",
        borderRadius: 20,
        p: 2,
      }}
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() =>
        dispatch({
          type: SET_IS_OPEN_CREATE_PROJECT_MODAL,
          payload: { isOpen: true },
        })
      }
    >
      CREATE NEW PROJECT
    </Button>
  );

  if (isFetchingProjects === null || isFetchingProjects === true) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={8}
        mb={2}
      >
        <CircularProgress size={40} />
        <Typography
          mt={1}
          color="text.secondary"
          variant="body2"
          fontStyle="italic"
        >
          Fetching projects information...
        </Typography>
      </Box>
    );
  }

  if (listProjects.length > 0) {
    return (
      <>
        <UpdateProjectInfoDialog />
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
          {listProjects.map((project: ApiListProjectsItem) => (
            <ProjectItem key={project.project_id} projectInfo={project} />
          ))}
          <Box
            flexBasis="calc(33.33% - 6*8px + 6/3*8px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight={300}
          >
            {renderCreateNewProjectButton()}
          </Box>
        </Box>
      </>
    );
  }

  return (
    <Box py={2} display="flex" justifyContent="center" alignItems="center">
      {renderCreateNewProjectButton()}
    </Box>
  );
};

export default ProjectList;
