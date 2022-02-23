import React from "react";
import { AppBar, Toolbar } from "@mui/material";

// import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import { connect } from "react-redux";
import { RootState } from "reduxes";
// import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = (props: any) => {
  // const onClickProfile = () => {
  //   history.push("/profile");
  //   handleClose();
  // };

  const { isLogged } = props.authReducer;

  if (isLogged) {
    return (
      <AppBar id="header" position="sticky">
        <Toolbar>
          {/* <IconButton
            edge="start"
            // className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          <Typography className={classes.pageTitle} variant="h6">
            Dashboard
          </Typography> */}
          <Link to="/">
            <HomeIcon sx={{ color: "common.white" }} />
          </Link>
        </Toolbar>
      </AppBar>
    );
  }

  return null;
};

export default connect(
  (state: RootState) => ({
    authReducer: state.authReducer,
  }),
  null
)(Header);
