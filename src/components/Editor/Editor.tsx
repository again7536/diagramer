import { createMemo, createSignal, For, Index, Setter, Show } from "solid-js";
import Rect from "../Rect/Rect";
import { v4 as uuidv4 } from "uuid";
import Resizer from "../Resizer/Resizer";
import { CIRCLE_CONFIG } from "../../constants";
import { useStore } from "../../storage";

interface DragPos {
  startX: number;
  startY: number;
  initX: number;
  initY: number;
  initWidth: number;
  initHeight: number;
}

const Editor = () => {
  let svgRef: SVGSVGElement | undefined;
  /*
    If id exists, it is shape
    Otherwise, it is resizer
  */
  const { shapeStates, selected, setSelected, setShapeOf } = useStore().shape;

  const [isDrag, setDrag] = createSignal<boolean>(false);
  const [startDim, setStartDim] = createSignal<DragPos>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    initWidth: 0,
    initHeight: 0,
  });
  const selectedShapeIdx = createMemo(() =>
    shapeStates.findIndex((s) => s.id === selected().id)
  );

  const handleMouseDown = (e: MouseEvent) => {
    setDrag(true);

    const $target = e.target as SVGElement;
    setSelected((prev) => ({
      className:
        $target.classList[0] === "" ? prev.className : $target.classList[0],
      id: $target.id === "" ? prev.id : $target.id,
    }));
    const shapeState = shapeStates[selectedShapeIdx()];

    setStartDim({
      startX: e.clientX,
      startY: e.clientY,
      initX: shapeState?.x ?? 0,
      initY: shapeState?.y ?? 0,
      initWidth: shapeState?.width ?? 0,
      initHeight: shapeState?.height ?? 0,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrag()) return;
    const diffX = e.clientX - startDim().startX;
    const diffY = e.clientY - startDim().startY;
    const selectedShapeState = shapeStates[selectedShapeIdx()];
    if (selected().className === "shape") {
      setShapeOf(selectedShapeIdx(), {
        ...selectedShapeState,
        x: diffX + startDim().initX,
        y: diffY + startDim().initY,
      });
      return;
    }
    if (selected().className.startsWith("resizer")) {
      const resizerIdx = +selected().className.split("-")[1];
      setShapeOf(selectedShapeIdx(), {
        ...selectedShapeState,
        x: CIRCLE_CONFIG[resizerIdx].resize.dx * diffX + startDim().initX,
        y: CIRCLE_CONFIG[resizerIdx].resize.dy * diffY + startDim().initY,
        width:
          CIRCLE_CONFIG[resizerIdx].resize.dwidth * diffX +
          startDim().initWidth,
        height:
          CIRCLE_CONFIG[resizerIdx].resize.dheight * diffY +
          startDim().initHeight,
      });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    setDrag(false);

    const $target = e.target as SVGElement;
    if ($target === svgRef) return;
    if ($target.classList[0] === "shape") {
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
      <Index each={shapeStates}>{(state) => <Rect {...state()} />}</Index>
      <Show when={selected().id}>
        <Resizer {...shapeStates[selectedShapeIdx()]} />
      </Show>
    </svg>
  );
};

export default Editor;
