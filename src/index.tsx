/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { RootContext } from "./storage";
import { ThemeProvider } from "solid-styled-components";
import { theme } from "./styles/theme";
import "@fortawesome/fontawesome-free/css/all.css";
import GlobalStyles from "./styles/global";

render(
  () => (
    <RootContext>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </RootContext>
  ),
  document.getElementById("root") as HTMLElement
);
