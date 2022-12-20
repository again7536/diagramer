import { Index, Match, Switch } from "solid-js";
import { SHAPE_TYPES } from "../../../constants";
import { ShapeState } from "../../../types";
import { Drawer } from "../Drawer/Drawer";
import { DrawerItem } from "../DrawerItem/DrawerItem";

interface RecursiveShapeDrawerProps {
  shapeStates: ShapeState[];
}

const RecursiveShapeDrawer = (props: RecursiveShapeDrawerProps) => {
  return (
    <Index each={props.shapeStates}>
      {(shapes) => (
        <Switch>
          <Match when={shapes().type === SHAPE_TYPES.GROUP.name}>
            <Drawer header={<DrawerItem icon="">hi</DrawerItem>}>
              <RecursiveShapeDrawer shapeStates={shapes().children} />
            </Drawer>
          </Match>
          <Match when={shapes().type !== SHAPE_TYPES.GROUP.name}>
            <DrawerItem icon="">hi</DrawerItem>
          </Match>
        </Switch>
      )}
    </Index>
  );
};

export { RecursiveShapeDrawer };
