import { RectState } from "../../types";
import { createSignal, For, Show, splitProps } from "solid-js";
import Resizer from "../Resizer/Resizer";

interface RectProps extends RectState {}

const Rect = (props: RectProps) => {
  return (
    <rect
      id={props.id}
      class="shape"
      width={props.width}
      height={props.height}
      transform={`translate(${props.x}, ${props.y})`}
    />
  );
};

export default Rect;
