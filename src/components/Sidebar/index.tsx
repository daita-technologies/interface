import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";

import {
  Box,
  CircularProgress,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";

import AddBoxIcon from "@mui/icons-material/AddBox";
// import SettingsIcon from "@mui/icons-material/Settings";
// import ExtensionIcon from "@mui/icons-material/Extension";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ShareIcon from "@mui/icons-material/Share";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email";

import CreateProjectModal from "components/CreateProjectModal";

import { InviteFriendModal } from "components";
import {
  FETCH_LIST_PROJECTS,
  SET_IS_OPEN_CREATE_PROJECT_MODAL,
} from "reduxes/project/constants";
import { getLocalStorage } from "utils/general";
import { ID_TOKEN_NAME } from "constants/defaultValues";
import { ApiListProjectsItem } from "reduxes/project/type";
import { setIsOpenInviteFriend } from "reduxes/invite/action";
import { LOG_OUT } from "reduxes/auth/constants";
import AvatarProfile from "./AvatarProfile";
import {
  BaseNavItemType,
  NavItemProps,
  NavRowProps,
  NavProjectItemProps,
} from "./type";

const NavRow = function (props: NavRowProps) {
  const history = useHistory();
  const { name, Icon, to, triggerToggleCollapse, isActived, isSubNav } = props;

  const handleNavigateOrOpenCollapse = () => {
    if (to) {
      history.push(to);
    } else if (typeof triggerToggleCollapse === "function") {
      triggerToggleCollapse();
    }
  };

  return (
    <Box
      boxShadow={isActived && isSubNav ? 3 : 0}
      bgcolor={isActived ? "background.default" : undefined}
      borderRadius={isActived ? 1 : undefined}
    >
      <ListItemButton onClick={handleNavigateOrOpenCollapse}>
        <ListItemIcon>
          <Icon
            sx={{
              color: isActived ? "primary.main" : "text.secondary",
            }}
          />
        </ListItemIcon>
        <Typography noWrap color={isActived ? "primary" : ""}>
          {name}
        </Typography>
      </ListItemButton>
    </Box>
  );
};

const NavProjectItem = function (props: NavProjectItemProps) {
  const { name, Icon, to, subNav, onClick } = props;
  const dispatch = useDispatch();

  const currentProjectName = useSelector(
    (state: RootState) => state.projectReducer.currentProjectName
  );
  const [isOpenCollapse, setIsOpenCollapse] = useState(!!currentProjectName);

  const isFetchingProjects = useSelector(
    (state: RootState) => state.projectReducer.isFetchingProjects
  );

  useEffect(() => {
    if (currentProjectName) {
      setIsOpenCollapse(true);
    } else {
      setIsOpenCollapse(false);
    }
  }, [currentProjectName]);

  const toggleCollapse = () => {
    setIsOpenCollapse(!isOpenCollapse);
  };

  const renderListProjects = () => {
    if (isFetchingProjects === false) {
      if (subNav && subNav.length > 0) {
        return subNav.map((projectInfo: ApiListProjectsItem) => (
          <NavRow
            key={`sub-nav-${projectInfo.project_id}`}
            name={projectInfo.project_name}
            Icon={FolderOpenIcon}
            to={`/project/${projectInfo.project_name}`}
            isActived={currentProjectName === projectInfo.project_name}
            isSubNav
          />
        ));
      }

      return (
        <Box display="flex" justifyContent="center">
          <Typography variant="caption" fontStyle="italic">
            No Project
          </Typography>
        </Box>
      );
    }

    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  };

  const handleClickCreateNewProject = () => {
    dispatch({
      type: SET_IS_OPEN_CREATE_PROJECT_MODAL,
      payload: { isOpen: true },
    });
  };
  return (
    <Box p={1} onClick={onClick}>
      <NavRow
        name={name}
        Icon={Icon}
        to={to}
        triggerToggleCollapse={toggleCollapse}
        isActived={!!currentProjectName}
      />

      {subNav && (
        <Collapse in={isOpenCollapse}>
          <List sx={{ pl: 4, maxHeight: 40 * 5, overflowY: "auto" }}>
            <NavRow
              name="Create New Project"
              Icon={AddBoxIcon}
              triggerToggleCollapse={handleClickCreateNewProject}
              isSubNav
            />
            {renderListProjects()}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

const NavItem = function (props: NavItemProps) {
  const { name, Icon, to, subNav, onClick } = props;

  const location = useLocation();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);

  const toggleCollapse = () => {
    setIsOpenCollapse(!isOpenCollapse);
  };

  return (
    <Box p={1} onClick={onClick}>
      <NavRow
        name={name}
        Icon={Icon}
        to={to}
        triggerToggleCollapse={toggleCollapse}
        isActived={to === location.pathname}
      />

      {subNav && (
        <Collapse in={isOpenCollapse}>
          <List sx={{ pl: 4 }}>
            {subNav.map((subNavItem: BaseNavItemType) => (
              <NavRow
                key={`sub-nav-${subNavItem.name}`}
                name={subNavItem.name}
                Icon={subNavItem.Icon}
                to={subNavItem.to}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

const Sidebar = function () {
  const dispatch = useDispatch();

  const isOpenCreateProjectModal = useSelector(
    (state: RootState) => state.projectReducer.isOpenCreateProjectModal
  );
  const isLogged = useSelector(
    (state: RootState) => state.authReducer.isLogged
  );
  const listProjects = useSelector(
    (state: RootState) => state.projectReducer.listProjects
  );

  useEffect(() => {
    if (isLogged) {
      dispatch({
        type: FETCH_LIST_PROJECTS.REQUESTED,
        payload: { idToken: getLocalStorage(ID_TOKEN_NAME) },
      });
    }
  }, [isLogged]);

  const onClickLogOut = () => {
    dispatch({ type: LOG_OUT.REQUESTED });
  };

  if (isLogged) {
    return (
      <Box sx={{ width: "17%", backgroundColor: "background.paper" }}>
        <Box position="sticky" top={0}>
          <CreateProjectModal
            isOpen={isOpenCreateProjectModal}
            handleClose={() =>
              dispatch({
                type: SET_IS_OPEN_CREATE_PROJECT_MODAL,
                payload: { isOpen: false },
              })
            }
          />
          <AvatarProfile />
          <Divider sx={{ borderColor: "text.secondary" }} />
          <List sx={{ color: "text.secondary" }}>
            <NavItem name="Dashboard" Icon={DashboardIcon} to="/dashboard" />
            <NavProjectItem
              name="My Projects"
              Icon={AssignmentIcon}
              subNav={listProjects}
            />
            <NavItem
              name="Invite a Friend"
              Icon={ShareIcon}
              onClick={() => dispatch(setIsOpenInviteFriend({ isOpen: true }))}
            />
            <Box
              sx={{ color: "text.secondary" }}
              component="a"
              href="mailto:contact@daita.tech?subject=DAITA Platform User Enquiry"
            >
              <NavItem name="Contact Us" Icon={EmailIcon} />
            </Box>
            <InviteFriendModal />
          </List>
          {/* <Divider sx={{ borderColor: "text.secondary" }} />
          <List sx={{ color: "text.secondary" }}>
            <Typography pl={3} pt={2} variant="subtitle2">
              Settings
            </Typography>
            <NavItem name="Main Settings" Icon={SettingsIcon} />
            <NavItem name="Integrations" Icon={ExtensionIcon} />
          </List> */}
          <Divider sx={{ borderColor: "text.secondary" }} />
          <List sx={{ color: "text.secondary" }}>
            <NavItem name="Logout" Icon={LogoutIcon} onClick={onClickLogOut} />
          </List>
        </Box>
      </Box>
    );
  }

  return null;
};

export default Sidebar;
