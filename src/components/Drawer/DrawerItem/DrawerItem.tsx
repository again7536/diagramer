import { JSXElement } from "solid-js";
import * as S from "./DrawerItem.style";

interface DrawerItemProps {
  icon: string;
  children: JSXElement | JSXElement[];
  ref?: HTMLDivElement;
}

const DrawerItem = (props: DrawerItemProps) => {
  return (
    <S.DrawerItemContainer ref={props.ref}>
      <i class={props.icon} />
      {props.children}
    </S.DrawerItemContainer>
  );
};

export { DrawerItem };
