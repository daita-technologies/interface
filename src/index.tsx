import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { CheckingApp, ConfirmDialogProvider } from "components";

import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";

import store from "store";
import { darkTheme } from "styles/theme";

import App from "./App";

import "react-toastify/dist/ReactToastify.css";
import "styles/normalize.css";
import "styles/custom.css";
import "styles/toastify.css";

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <ConfirmDialogProvider>
        <CheckingApp>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={6000}
            pauseOnHover
            theme="colored"
          />
        </CheckingApp>
      </ConfirmDialogProvider>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
