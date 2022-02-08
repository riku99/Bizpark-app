import React from "react";
import { InstaLikeModal, ListItem } from "src/components/InstaLikeModal";

type Props = {
  closeMenu: () => void;
  isVisible: boolean;
};

export const Menu = ({ closeMenu, isVisible }: Props) => {
  const itemList: ListItem[] = [
    {
      title: "元のニュースを見る",
      onPress: () => {},
    },
  ];

  return (
    <InstaLikeModal
      isVisible={isVisible}
      list={itemList}
      onBackdropPress={closeMenu}
      onCancel={closeMenu}
    />
  );
};
