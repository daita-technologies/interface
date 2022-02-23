import { Router, Switch } from "react-router-dom";
import { Box } from "@mui/material";
import { Layout, PageLoading, ScrollToTop } from "components";
import history from "routerHistory";

import routeConfig, { CustomRoute } from "config/routeConfig";
import { TOKEN_NAME } from "constants/defaultValues";

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
          </Switch>
        </Layout>
      </Box>
      <ScrollToTop />
    </Router>
  );
};

export default App;
