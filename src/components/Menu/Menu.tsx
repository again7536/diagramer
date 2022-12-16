import { v4 as uuidv4 } from "uuid";
import { useStore } from "../../storage";
import { ShapeType } from "../../types";
import styles from "./Menu.module.scss";

const Menu = () => {
  const { selectedShapeIds, getShapeState, addShape, setShapeOf } =
    useStore().shape;

  const handleClickBtn = (type: ShapeType) => {
    addShape({
      id: uuidv4(),
      type,
      cur: {
        x: 40,
        y: 40,
        width: 100,
        height: 100,
      },
      prev: {
        x: 40,
        y: 40,
        width: 100,
        height: 100,
      },
    });
  };
  const handleChangeCss = (e: InputEvent) => {
    const $target = e.target as HTMLTextAreaElement;
    setShapeOf(selectedShapeIds[0], {
      ...getShapeState(selectedShapeIds[0]),
      css: $target.value,
    });
  };

  return (
    <div class={styles.menuContainer}>
      <button onClick={() => handleClickBtn("rect")}>rect</button>
      <button onClick={() => handleClickBtn("line")}>line</button>
      <button onClick={() => handleClickBtn("circle")}>circle</button>
      <textarea
        style={{ height: "200px" }}
        value={getShapeState(selectedShapeIds[0])?.css ?? ""}
        oninput={handleChangeCss}
      />
    </div>
  );
};

export default Menu;
