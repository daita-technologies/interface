import { Container, Grid, Typography } from "@mui/material";
import { connect } from "react-redux";
import { RootState } from "reduxes";
import UserInfoForm from "routes/RegisterPage/UserInfoForm";

const ProfilePage = (props: any) => {
  const { userInfo } = props.authReducer;

  return (
    <Container sx={{ mt: 2 }} maxWidth="lg">
      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid item xs={8}>
          <Typography variant="h6">Profile</Typography>
          <Container sx={{ m: 0 }} maxWidth="xs">
            <UserInfoForm
              offFields={{ password: true, confirmPassword: true }}
              editMode
              userInfo={userInfo}
            />
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
};

export default connect(
  (state: RootState) => ({
    authReducer: state.authReducer,
  }),
  null
)(ProfilePage);
