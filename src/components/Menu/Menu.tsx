import { createMemo } from "solid-js";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../../storage";
import styles from "./Menu.module.scss";

const Menu = () => {
  const { shapeStates, selected, addShape, setShapeOf } = useStore().shape;
  const selectedIdx = createMemo(() =>
    shapeStates.findIndex((s) => s.id === selected()?.id)
  );

  const handleClickBtn = (type: "rect" | "line") => {
    addShape({
      id: uuidv4(),
      type,
      x: 40,
      y: 40,
      width: 100,
      height: 100,
    });
  };
  const handleChangeCss = (e: InputEvent) => {
    setShapeOf(selectedIdx(), {
      ...shapeStates[selectedIdx()],
      css: (e.target as HTMLTextAreaElement).value,
    });
    console.log(shapeStates[selectedIdx()].css);
  };

  return (
    <div class={styles.menuContainer}>
      <button onClick={() => handleClickBtn("rect")}>rect</button>
      <button onClick={() => handleClickBtn("line")}>line</button>
      <textarea
        style={{ height: "200px" }}
        value={shapeStates[selectedIdx()]?.css ?? ""}
        oninput={handleChangeCss}
      />
    </div>
  );
};

export default Menu;
