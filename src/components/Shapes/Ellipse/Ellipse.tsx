import { ShapeState } from "../../../types";
import { getCenterPoint, getWidthHeight } from "../../../utils";

interface EllipseProps extends ShapeState {}

const Ellipse = (props: EllipseProps) => {
  return (
    <ellipse
      id={props.id}
      class="shape"
      style={props.css}
      cx={getCenterPoint(props.cur).x}
      cy={getCenterPoint(props.cur).y}
      rx={getWidthHeight(props.cur).w / 2}
      ry={getWidthHeight(props.cur).h / 2}
    />
  );
};

export default Ellipse;
