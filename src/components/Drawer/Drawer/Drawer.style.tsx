import { styled } from "solid-styled-components";

const DrawerContainer = styled("div")`
  display: flex;
  flex-direction: column;

  font-size: ${({ theme }) => theme?.fonts.size[2]};
`;

const DrawerHeader = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;

  transition: 0.1s;

  &:hover {
    background-color: ${({ theme }) => theme?.colors.shadow};
    & > div {
      background-color: transparent;
    }
  }
`;

const ChildrenContainer = styled("div")`
  padding-left: 10px;
`;

export { DrawerContainer, DrawerHeader, ChildrenContainer };
