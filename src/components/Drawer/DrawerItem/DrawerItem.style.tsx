import { styled } from "solid-styled-components";

const DrawerItemContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  text-align: left;

  width: 100%;
  height: 35px;
  padding: 0 5px;
  transition: 0.1s;

  &:hover {
    background-color: ${({ theme }) => theme?.colors.shadow};
  }

  i {
    width: 15px;
    font-size: 12px;
    padding-right: 5px;
  }
`;

export { DrawerItemContainer };
