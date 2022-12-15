import type { Component } from "solid-js";
import Editor from "./components/Editor/Editor";
import Menu from "./components/Menu/Menu";

const App: Component = () => {
  return (
    <div style={{ display: "flex", "flex-direction": "row" }}>
      <div style={{ flex: "2 0 200px" }}>
        <Menu />
      </div>
      <div style={{ flex: "9 1" }}>
        <Editor />
      </div>
    </div>
  );
};

export default App;
