import { Box } from "@mui/material";
import { Layout, PageLoading, ScrollToTop } from "components";
import GuestLayout from "components/Layout/GuestLayout";
import routeConfig, {
  customLayoutRouteConfig,
  CustomRoute,
} from "config/routeConfig";
import { TOKEN_NAME } from "constants/defaultValues";
import { Route, Router, Switch } from "react-router-dom";
import history from "routerHistory";

window.addEventListener("storage", (event: StorageEvent) => {
  if (event.key === TOKEN_NAME && !event.newValue) {
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
});

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
            </GuestLayout>
          </Route>
          <Route>
            <Layout>
              {routeConfig.map(({ path, exact, component, isPrivate }) => (
                <CustomRoute
                  key={`route-${path}`}
                  path={path}
                  exact={exact}
                  component={component}
                  isPrivate={isPrivate}
                />
              ))}
            </Layout>
          </Route>
        </Switch>
      </Box>
      <ScrollToTop />
    </Router>
  );
};

export default App;
