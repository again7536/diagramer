import { createSignal } from "solid-js";

interface CreatePosParams {
  setPos: (next: Pos) => void;
  x: number;
  y: number;
}
interface Pos {
  x: number;
  y: number;
}
interface DragPos {
  startX: number;
  startY: number;
  initX: number;
  initY: number;
}

function createPos(props: CreatePosParams) {
  const [pos, setPos] = createSignal<Pos>({ x: props.x, y: props.y });
  const [isDrag, setDrag] = createSignal<boolean>(false);
  const [startPos, setStartPos] = createSignal<DragPos>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const handleDragStart = (e: MouseEvent) => {
    setDrag(true);
    setStartPos({
      startX: e.clientX,
      startY: e.clientY,
      initX: pos().x,
      initY: pos().y,
    });
  };
  const handleDrag = (e: MouseEvent) => {
    if (isDrag())
      setPos({
        x: e.clientX - startPos().startX + startPos().initX,
        y: e.clientY - startPos().startY + startPos().initY,
      });
  };
  const handleDragStop = (e: MouseEvent) => {
    setDrag(false);
    props.setPos({
      ...pos(),
    });
  };

  return { pos, handleDragStart, handleDrag, handleDragStop };
}

export default createPos;
