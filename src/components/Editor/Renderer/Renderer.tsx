import { Show, Index, Switch, Match } from "solid-js";
import { SHAPE_TYPES } from "../../../constants";
import { ShapeState } from "../../../types";
import Ellipse from "../../Shapes/Ellipse/Ellipse";
import Line from "../../Shapes/Line/Line";
import Rect from "../../Shapes/Rect/Rect";

interface RendererProps {
  parentId: string;
  getShapeState: (id: string) => ShapeState;
}

const Renderer = (props: RendererProps) => {
  return (
    <Index each={props.getShapeState(props.parentId).children}>
      {(childGetter) => {
        const child = childGetter();
        return (
          <>
            <Switch>
              <Match when={child().type === SHAPE_TYPES.RECT.name}>
                <Rect {...child()} />
              </Match>
              <Match when={child().type === SHAPE_TYPES.LINE.name}>
                <Line {...child()} />
              </Match>
              <Match when={child().type === SHAPE_TYPES.ELLIPSE.name}>
                <Ellipse {...child()} />
              </Match>
            </Switch>
            <Renderer
              parentId={child().id}
              getShapeState={props.getShapeState}
            />
          </>
        );
      }}
    </Index>
  );
};

export default Renderer;
