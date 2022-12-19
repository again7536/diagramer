import { v4 as uuidv4 } from "uuid";
import { SHAPE_TYPES } from "../../constants";
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
      cur: { p1: { x: 40, y: 40 }, p2: { x: 100, y: 100 } },
      prev: { p1: { x: 40, y: 40 }, p2: { x: 100, y: 100 } },
      snapped: {},
    });
  };
  const handleChangeCss = (e: InputEvent) => {
    const $target = e.target as HTMLTextAreaElement;
    const state = getShapeState(selectedShapeIds[0]);
    state &&
      setShapeOf(selectedShapeIds[0], {
        ...state,
        css: $target.value,
      });
  };

  return (
    <div class={styles.menuContainer}>
      <button onClick={() => handleClickBtn(SHAPE_TYPES.RECT)}>rect</button>
      <button onClick={() => handleClickBtn(SHAPE_TYPES.LINE)}>line</button>
      <button onClick={() => handleClickBtn(SHAPE_TYPES.ELLIPSE)}>
        circle
      </button>
      <textarea
        style={{ height: "200px" }}
        value={getShapeState(selectedShapeIds[0])?.css ?? ""}
        oninput={handleChangeCss}
      />
    </div>
  );
};

export default Menu;
