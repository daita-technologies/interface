import {
  ANNOTATION_PROJECT_ROUTE_NAME,
  DATASET_HEALTH_CHECK_ROUTE_NAME,
  MY_TASKS_ROUTE_NAME,
  OLD_DATASET_HEALTH_CHECK_ROUTE_NAME,
  OLD_MY_TASK_ROUTE_NAME,
} from "constants/routeName";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { selectorIsLogged } from "reduxes/auth/selector";
import {
  DashboardPage,
  ForgotPasswordPage,
  HealthCheckPage,
  LoginPage,
  ProjectDetail,
  RegisterPage,
  TaskDashboard,
  VerifyAccountPage,
} from "routes";
import AnnotationPage from "routes/AnnotationPage";
import AnnotationProject from "routes/AnnotationProject";
import PrivacyPolicy from "routes/PrivacyPolicy";
import Terms from "routes/Terms";
import { CustomRouteProps } from "./type";
import AnnotationProjectDetail from "routes/AnnotationProjectDetail";

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
export const customLayoutRouteConfig = [
  {
    path: "/we-take-your-privacy-seriously",
    component: PrivacyPolicy,
    exact: true,
    isPrivate: false,
  },
  {
    path: "/terms",
    component: Terms,
    exact: true,
    isPrivate: false,
  },
];
export const emptyLayoutRouteConfig = [
  {
    path: "/annotation",
    component: AnnotationPage,
    exact: true,
    isPrivate: false,
  },
];
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
  {
    path: `/${MY_TASKS_ROUTE_NAME}`,
    component: TaskDashboard,
    exact: true,
    isPrivate: true,
  },
  {
    path: `/${MY_TASKS_ROUTE_NAME}/:projectName`,
    component: TaskDashboard,
    exact: false,
    isPrivate: true,
  },
  {
    path: `/${OLD_MY_TASK_ROUTE_NAME}`,
    component: () => <Redirect to={`/${MY_TASKS_ROUTE_NAME}`} />,
    exact: true,
    isPrivate: true,
  },
  {
    path: `/${OLD_MY_TASK_ROUTE_NAME}/:projectName`,
    component: ({ match }: any) => (
      <Redirect to={`/${MY_TASKS_ROUTE_NAME}/${match.params.projectName}`} />
    ),
    exact: false,
    isPrivate: true,
  },
  {
    path: `/${DATASET_HEALTH_CHECK_ROUTE_NAME}`,
    component: HealthCheckPage,
    exact: true,
    isPrivate: true,
  },
  {
    path: `/${DATASET_HEALTH_CHECK_ROUTE_NAME}/:projectName`,
    component: HealthCheckPage,
    exact: true,
    isPrivate: true,
  },
  {
    path: `/${OLD_DATASET_HEALTH_CHECK_ROUTE_NAME}`,
    component: () => <Redirect to={`/${DATASET_HEALTH_CHECK_ROUTE_NAME}`} />,
    exact: true,
    isPrivate: true,
  },
  {
    path: `/${OLD_DATASET_HEALTH_CHECK_ROUTE_NAME}/:projectName`,
    component: ({ match }: any) => (
      <Redirect
        to={`/${DATASET_HEALTH_CHECK_ROUTE_NAME}/${match.params.projectName}`}
      />
    ),
    exact: false,
    isPrivate: true,
  },
  {
    path: `/${ANNOTATION_PROJECT_ROUTE_NAME}`,
    component: AnnotationProject,
    exact: true,
    isPrivate: true,
  },
  {
    path: `/${ANNOTATION_PROJECT_ROUTE_NAME}/:projectName`,
    component: AnnotationProjectDetail,
    exact: true,
    isPrivate: true,
  },
];

export default routeConfig;
