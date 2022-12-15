import createPos from "../../hooks/createPos";
import { RectState } from "../../types";
import { For, Show } from "solid-js";
import Resizer from "../Resizer/Resizer";

interface RectProps extends RectState {
  setState: (next: RectState) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const Rect = (props: RectProps) => {
  const { pos, handleDragStart, handleDrag, handleDragStop } = createPos({
    x: props.x,
    y: props.y,
    setPos: (next) => props.setState({ ...props, ...next }),
  });

  return (
    <>
      <rect
        width={props.width}
        height={props.height}
        transform={`translate(${pos().x}, ${pos().y})`}
        onmousedown={(e) => {
          handleDragStart(e);
          props.onSelect(props.id);
        }}
        onmousemove={handleDrag}
        onmouseup={handleDragStop}
      />
      <Show when={props.isSelected}>
        <Resizer
          {...props}
          x={pos().x}
          y={pos().y}
          onResize={(size) => props.setState({ ...props, ...size })}
        />
      </Show>
    </>
  );
};

export default Rect;
