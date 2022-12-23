import { toCSS } from "transformation-matrix";
import { ShapeState } from "../../../types";
import { getCenterPoint, getWidthHeight } from "../../../utils";

interface EllipseProps extends ShapeState {}

const Ellipse = (props: EllipseProps) => {
  return (
    <ellipse
      id={props.id}
      class="shape"
      style={props.css}
      cx={0}
      cy={0}
      rx={1}
      ry={1}
      transform={toCSS(props.cur)}
    />
  );
};

export default Ellipse;
