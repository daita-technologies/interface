import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

import { selectorIsLogged } from "reduxes/auth/selector";
import {
  DashboardPage,
  ForgotPasswordPage,
  LoginPage,
  ProjectDetail,
  RegisterPage,
  VerifyAccountPage,
} from "routes";
import { CustomRouteProps } from "./type";

export const CustomRoute = function ({
  path,
  exact,
  component,
  isPrivate,
}: CustomRouteProps) {
  const isLogged = useSelector(selectorIsLogged);

  const RouteComponent = (
    <Route path={path} exact={exact} component={component} />
  );
  const isAuthRoute =
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path === "/verify";

  if (isLogged) {
    if (isAuthRoute) {
      return <Redirect to="/dashboard" />;
    }
    return RouteComponent;
  }

  if (!isPrivate) {
    return RouteComponent;
  }

  return <Redirect to="/login" />;
};

const routeConfig = [
  {
    path: "/",
    component: () => <Redirect to="/dashboard" />,
    exact: true,
    isPrivate: false,
  },
  {
    path: "/login",
    component: LoginPage,
    isPrivate: false,
  },
  {
    path: "/register",
    component: RegisterPage,
    isPrivate: false,
  },
  {
    path: "/forgot-password",
    component: ForgotPasswordPage,
    isPrivate: false,
  },
  {
    path: "/verify",
    component: VerifyAccountPage,
    isPrivate: false,
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    isPrivate: true,
  },
  {
    path: "/project/:projectName",
    component: ProjectDetail,
    exact: true,
    isPrivate: true,
  },
];

export default routeConfig;
