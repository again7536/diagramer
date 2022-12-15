import { createSignal, For, Setter } from "solid-js";
import { createStore } from "solid-js/store";
import { ShapeState } from "../../types";
import Rect from "../Rect/Rect";
import { v4 as uuidv4 } from "uuid";

const Editor = () => {
  const [selected, setSelected] = createSignal<string>("");
  const [shapeStates, setShapeStates] = createStore<ShapeState[]>([]);

  const setShapeState = (nextState: ShapeState) => {
    setShapeStates((prevArr) => {
      const nextArr = [...prevArr];
      nextArr[nextArr.findIndex((s) => s.id === nextState.id)] = nextState;

      return nextArr;
    });
  };
  const handleClickBtn = () => {
    setShapeStates((prev) => [
      ...prev,
      { id: uuidv4(), x: 0, y: 0, width: 100, height: 100 },
    ]);
  };
  const handleSelectShape = (id: string) => setSelected(id);

  return (
    <>
      <button onClick={handleClickBtn}>rect</button>
      <svg xmlns="" width="600" height="600" viewBox="0 0 600 600">
        <For each={shapeStates}>
          {(state) => (
            <Rect
              {...state}
              setState={setShapeState}
              onSelect={handleSelectShape}
              isSelected={selected() === state.id}
            />
          )}
        </For>
      </svg>
    </>
  );
};

export default Editor;
