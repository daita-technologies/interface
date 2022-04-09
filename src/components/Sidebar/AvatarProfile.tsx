// import React from "react";
import {
  // useDispatch,
  useSelector,
} from "react-redux";
import { RootState } from "reduxes";
import {
  Avatar,
  Box,
  // Button,
  // IconButton,
  // Menu,
  // MenuList,
  // MenuItem,
  Typography,
} from "@mui/material";

// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// import { LOG_OUT } from "reduxes/auth/constants";

const AvatarProfile = function () {
  // const dispatch = useDispatch();
  const isLogged = useSelector(
    (state: RootState) => state.authReducer.isLogged
  );
  const userInfo = useSelector(
    (state: RootState) => state.authReducer.userInfo
  );

  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const isOpen = Boolean(anchorEl);

  // const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const onClickLogOut = () => {
  //   dispatch({ type: LOG_OUT.REQUESTED });
  //   handleClose();
  // };

  if (userInfo) {
    const { username } = userInfo;

    return (
      <Box>
        <Box pt={6}>
          {isLogged ? (
            <Box pl={4}>
              <Avatar
                alt={`${username}-avatar`}
                src="/assets/images/default-avatar.png"
              />
            </Box>
          ) : (
            <AccountCircleIcon />
          )}
          {username && (
            <Typography
              sx={{
                color: "text.primary",
                my: 2,
                pl: 4,
                textTransform: "none",
              }}
              noWrap
            >
              {username}
            </Typography>
            // <Button
            //   sx={{
            //     color: "text.primary",
            //     my: 2,
            //     pl: 4,
            //     textTransform: "none",
            //   }}
            //   aria-label="account of current user"
            //   aria-controls="menu-appbar"
            //   onClick={handleMenu}
            //   fullWidth
            //   variant="text"
            // >
            //   {username}
            //   <ArrowDropDownIcon sx={{ ml: "auto" }} />
            // </Button>
          )}
        </Box>
        {/* <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isOpen}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: "15%",
            },
          }}
        >
          <MenuItem onClick={onClickProfile}>Profile</MenuItem>
          <MenuItem onClick={onClickLogOut}>Log out</MenuItem>
        </Menu> */}
      </Box>
    );
  }
  return null;
};

export default AvatarProfile;
