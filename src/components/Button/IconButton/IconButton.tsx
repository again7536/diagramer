import { StyledIconButton } from "./IconButton.style";

interface IconButtonProps {
  icon: string;
  radius?: number;
  onClick: (e: MouseEvent) => void;
}

const IconButton = (props: IconButtonProps) => {
  return (
    <StyledIconButton {...props} radius={props.radius ?? 32}>
      <i class={props.icon} />
    </StyledIconButton>
  );
};

export { IconButton };
