import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { CheckingApp } from "components";

import { ThemeProvider } from "@mui/system";
import { ToastContainer } from "react-toastify";

import App from "./App";

import store from "store";
import { darkTheme } from "styles/theme";

import "react-toastify/dist/ReactToastify.css";
import "styles/normalize.css";
import "styles/custom.css";
import "styles/toastify.css";

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <CheckingApp>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={6000}
          pauseOnHover
          theme="colored"
        />
      </CheckingApp>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
