import { Index, Match, Switch, Show } from "solid-js";
import { SHAPE_TYPES } from "../../../constants";
import { useStore } from "../../../storage";
import { ShapeState, ShapeType } from "../../../types";
import { Drawer } from "../Drawer/Drawer";
import { DrawerItem } from "../DrawerItem/DrawerItem";

interface RecursiveShapeDrawerProps {
  parentId: string;
  getShapeState: (id: string) => ShapeState;
}

const SHAPE_TYPE_KEYMAP = Object.entries(SHAPE_TYPES).reduce(
  (acc, [key, type]) => ({ ...acc, [type.name]: key }),
  {} as { [key in ShapeType]: string }
);

//각각에 대해서 이벤트 건다

const RecursiveShapeDrawer = (props: RecursiveShapeDrawerProps) => {
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();

    const $target = e.target as HTMLElement;
    const overState = props.getShapeState($target.id);
    if (overState?.type === SHAPE_TYPES.GROUP.name) {
      if (e.offsetY < $target.clientHeight / 3) return;
    }
    if (overState?.type !== SHAPE_TYPES.GROUP.name) {
    }
  };

  return (
    <Index each={props.getShapeState(props.parentId).children}>
      {(childGetter) => {
        const child = childGetter();
        return (
          <Switch>
            <Match when={child().type === SHAPE_TYPES.GROUP.name}>
              <Drawer
                header={
                  <DrawerItem
                    icon={SHAPE_TYPES[SHAPE_TYPE_KEYMAP[child().type]].icon}
                  >
                    {child().type}
                  </DrawerItem>
                }
              >
                <RecursiveShapeDrawer
                  parentId={child().id}
                  getShapeState={props.getShapeState}
                />
              </Drawer>
            </Match>
            <Match when={child().type !== SHAPE_TYPES.GROUP.name}>
              <DrawerItem
                icon={SHAPE_TYPES[SHAPE_TYPE_KEYMAP[child().type]].icon}
              >
                {child().type}
              </DrawerItem>
            </Match>
          </Switch>
        );
      }}
    </Index>
  );
};

export { RecursiveShapeDrawer };
