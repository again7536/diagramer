import { styled } from "solid-styled-components";

interface StyledIconButtonProps {
  radius: number;
}

const StyledIconButton = styled("button")<StyledIconButtonProps>`
  width: ${({ radius }) => radius}px;
  height: ${({ radius }) => radius}px;
  line-height: ${({ radius }) => radius}px;
  font-size: ${({ radius }) => radius / 1.9}px;

  transition: 0.2s;
  border-radius: 50%;
  border: none;

  background-color: transparent;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme?.colors.shadow};
  }
`;

export { StyledIconButton };
