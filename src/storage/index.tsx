import { createContext, JSX, useContext } from "solid-js";
import { shapeStore } from "./shape";

interface RootContextProps {
  children: JSX.Element | JSX.Element[];
}

interface RootStore {
  shape: ReturnType<typeof shapeStore>;
}

const Context = createContext<RootStore>();

const RootContext = (props: RootContextProps) => {
  const store = {
    shape: shapeStore(),
  };

  return <Context.Provider value={store}>{props.children}</Context.Provider>;
};

const useStore = () => useContext(Context) as RootStore;

export { RootContext, useStore };
