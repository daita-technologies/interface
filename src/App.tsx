import { Box } from "@mui/material";
import { Layout, PageLoading, ScrollToTop } from "components";
import GuestLayout from "components/Layout/GuestLayout";
import routeConfig, {
  customLayoutRouteConfig,
  CustomRoute,
} from "config/routeConfig";
import { TOKEN_NAME } from "constants/defaultValues";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import history from "routerHistory";

window.addEventListener("storage", (event: StorageEvent) => {
  if (event.key === TOKEN_NAME && !event.newValue) {
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
});

function RedirectToHompage() {
  return <Redirect to="/" />;
}

const App = function () {
  // eslint-disable-next-line no-console
  console.log(`
██████╗      ███═╗    ██╗ ██████████╗     ███═╗
██   ██╗    ██ ██╚╗   ██║     ██╔═══╝    ██ ██╚╗
██   ██║   ██   ██╚╗  ██║     ██║       ██   ██╚╗
██   ██║  █████████╚╗ ██║     ██║      █████████╚╗
██████╔╝ ██╔═════╗██║ ██║     ██║     ██╔═════╗██║
╚═════╝  ╚═╝     ╚══╝ ╚═╝     ╚═╝     ╚═╝     ╚══╝
===============================

Looking for a job? 🤓
Apply here: contact@daita.tech

===============================
  `);
  return (
    <Router history={history}>
      <PageLoading />
      <Box>
        <Switch>
          <Route path={customLayoutRouteConfig.map((t) => t.path)}>
            <GuestLayout>
              <Switch>
                {customLayoutRouteConfig.map(
                  ({ path, exact, component, isPrivate }) => (
                    <CustomRoute
                      key={`route-${path}`}
                      path={path}
                      exact={exact}
                      component={component}
                      isPrivate={isPrivate}
                    />
                  )
                )}
              </Switch>
            </GuestLayout>
          </Route>
          <Route path={routeConfig.map((t) => t.path)}>
            <Layout>
              <Switch>
                {routeConfig.map(({ path, exact, component, isPrivate }) => (
                  <CustomRoute
                    key={`route-${path}`}
                    path={path}
                    exact={exact}
                    component={component}
                    isPrivate={isPrivate}
                  />
                ))}
                <Route component={RedirectToHompage} />
              </Switch>
            </Layout>
          </Route>
        </Switch>
      </Box>
      <ScrollToTop />
    </Router>
  );
};

export default App;
