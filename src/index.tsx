/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { RootContext } from "./storage";

render(
  () => (
    <RootContext>
      <App />
    </RootContext>
  ),
  document.getElementById("root") as HTMLElement
);
