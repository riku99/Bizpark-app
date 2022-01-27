import React from "react";
import {} from "native-base";
import { InstaLikeModal, ListItem } from "src/components/InstaLikeModal";

type Props = {
  isVisible: boolean;
  closeMenu: () => void;
};

export const Menu = ({ isVisible, closeMenu }: Props) => {
  const menuList: ListItem[] = [
    {
      title: "トークルームを解散",
      color: "red",
      onPress: () => {},
    },
  ];

  return (
    <InstaLikeModal
      isVisible={isVisible}
      onBackdropPress={closeMenu}
      onCancel={closeMenu}
      list={menuList}
    />
  );
};
