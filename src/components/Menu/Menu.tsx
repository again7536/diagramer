import { For } from "solid-js";
import { v4 as uuidv4 } from "uuid";
import { SHAPE_TYPES } from "../../constants";
import { useStore } from "../../storage";
import { ShapeType } from "../../types";
import { IconButton } from "../Button/IconButton/IconButton";
import Input from "../Input/Input";
import { RecursiveShapeDrawer } from "../Drawer";
import * as S from "./Menu.style";

const Menu = () => {
  const { shapeStates, selectedShapeIds, getShapeState, addShape, setShapeOf } =
    useStore().shape;

  const handleClickBtn = (type: ShapeType) => {
    addShape({
      id: uuidv4(),
      type,
      cur: { p1: { x: 40, y: 40 }, p2: { x: 100, y: 100 } },
      prev: { p1: { x: 40, y: 40 }, p2: { x: 100, y: 100 } },
      children: [],
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
    <S.MenuContainer>
      <div>
        <S.MenuSubheader>shapes</S.MenuSubheader>
        <For each={Object.values(SHAPE_TYPES)}>
          {(type) => (
            <IconButton
              icon={type.icon}
              onClick={() => {
                handleClickBtn(type.name);
              }}
            />
          )}
        </For>
      </div>

      <div>
        <S.MenuSubheader>styles</S.MenuSubheader>
        <Input
          type="textarea"
          style={{ "padding-bottom": "200px" }}
          value={getShapeState(selectedShapeIds[0])?.css ?? ""}
          oninput={handleChangeCss}
        />
      </div>

      <RecursiveShapeDrawer shapeStates={shapeStates} />
    </S.MenuContainer>
  );
};

export default Menu;
