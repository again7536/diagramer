import {
  createMemo,
  createSignal,
  For,
  Index,
  Match,
  Setter,
  Show,
  Switch,
} from "solid-js";
import Rect from "../Shapes/Rect/Rect";
import Resizer from "../Resizer/Resizer";
import { CIRCLE_CONFIG } from "../../constants";
import { useStore } from "../../storage";
import Line from "../Shapes/Line/Line";
import Circle from "../Shapes/Circle/Circle";
import { calcShapeState } from "../../utils/calcShapeState";
import { Dimension } from "../../types";

interface DragStartDimension {
  startX: number;
  startY: number;
}

const Editor = () => {
  let svgRef: SVGSVGElement | undefined;
  /*
    selectedShapeIds : most recently selectedElem shape
    selectedElem: most recently selectedElem "SVGElement"
  */
  const {
    shapeStates,
    selectedShapeIds,
    selectedElem,
    getShapeState,
    setSelectedShapeIds,
    setSelectedElem,
    setShapeOf,
  } = useStore().shape;
  const [isDrag, setDrag] = createSignal<boolean>(false);
  const [selectorDim, setSelectorDim] = createSignal<Dimension>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [startDim, setStartDim] = createSignal<DragStartDimension>({
    startX: 0,
    startY: 0,
  });

  const handleMouseDown = (e: MouseEvent) => {
    const $target = e.target as SVGElement;
    if ($target.classList[0] === "shape") setSelectedShapeIds([$target.id]);

    setDrag(true);
    setSelectedElem($target);
    setStartDim({
      startX: e.clientX,
      startY: e.clientY,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrag() || !selectedElem()) return;
    const $selectedElem = selectedElem() as SVGElement;
    const diffX = e.clientX - startDim().startX;
    const diffY = e.clientY - startDim().startY;

    if ($selectedElem === svgRef) {
      setSelectorDim({
        width: diffX,
        height: diffY,
        x: startDim().startX - (svgRef?.getBoundingClientRect().left ?? 0),
        y: startDim().startY - (svgRef?.getBoundingClientRect().top ?? 0),
      });
      return;
    }

    if ($selectedElem.classList[0].startsWith("resizer")) {
      const resizerIdx = +$selectedElem.classList[0].split("-")[1];
      selectedShapeIds.forEach((shapeId) => {
        const state = getShapeState(shapeId);
        setShapeOf(shapeId, {
          ...state,
          cur: {
            ...calcShapeState({
              ...CIRCLE_CONFIG[resizerIdx].resize,
              ...state.prev,
              diffX,
              diffY,
            }),
          },
        });
      });
      return;
    }

    if ($selectedElem.classList[0] === "shape") {
      selectedShapeIds.forEach((shapeId) => {
        const state = getShapeState(shapeId);
        setShapeOf(shapeId, {
          ...state,
          cur: {
            ...state.cur,
            x: diffX + state.prev.x,
            y: diffY + state.prev.y,
          },
        });
      });
      return;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    setDrag(false);

    const $selected = selectedElem() as SVGElement;
    if ($selected === svgRef) {
      const filtered = shapeStates
        .filter((state) => {
          const cx = state.cur.x + state.cur.width / 2;
          const cy = state.cur.y + state.cur.height / 2;
          if (
            cx > selectorDim().x &&
            cx < selectorDim().x + selectorDim().width &&
            cy > selectorDim().y &&
            cy < selectorDim().y + selectorDim().height
          )
            return state;
        })
        .map((f) => f.id);

      setSelectedElem(
        $selected.querySelector<SVGElement>(`[id='${filtered[0]}']`) ??
          undefined
      );
      setSelectedShapeIds(filtered);
      setSelectorDim({ width: 0, height: 0, x: 0, y: 0 });
    } else {
      selectedShapeIds.forEach((shapeId) => {
        const state = getShapeState(shapeId);
        setShapeOf(shapeId, {
          ...state,
          prev: {
            ...state.cur,
          },
        });
      });
    }
  };

  return (
    <svg
      ref={svgRef}
      width="600"
      height="600"
      viewBox="0 0 600 600"
      onmousedown={handleMouseDown}
      onmousemove={handleMouseMove}
      onmouseup={handleMouseUp}
    >
      <Index each={shapeStates}>
        {(state) => (
          <Switch>
            <Match when={state().type === "rect"}>
              <Rect {...state()} />
            </Match>
            <Match when={state().type === "line"}>
              <Line {...state()} />
            </Match>
            <Match when={state().type === "circle"}>
              <Circle {...state()} />
            </Match>
          </Switch>
        )}
      </Index>
      <For each={selectedShapeIds}>
        {(id) => <Resizer {...getShapeState(id)} />}
      </For>
      <Show when={selectedElem() === svgRef}>
        <rect {...selectorDim()} fill="#0000ff30" />
      </Show>
    </svg>
  );
};

export default Editor;
