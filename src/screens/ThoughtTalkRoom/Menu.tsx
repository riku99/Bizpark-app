import React from "react";
import { InstaLikeModal, ListItem } from "src/components/InstaLikeModal";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";

type Props = {
  isVisible: boolean;
  closeMenu: () => void;
  talkRoomId: number;
  thoughtId: string;
};

export const Menu = ({
  isVisible,
  closeMenu,
  talkRoomId,
  thoughtId,
}: Props) => {
  const navigation = useNavigation<RootNavigationProp<"ThoughtTalkRoomMain">>();

  const menuList: ListItem[] = [
    {
      title: "元の投稿を見る",
      onPress: () => {
        closeMenu();
        navigation.navigate("Thought", {
          id: thoughtId,
        });
      },
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
