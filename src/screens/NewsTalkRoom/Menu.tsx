import React from "react";
import { InstaLikeModal, ListItem } from "src/components/InstaLikeModal";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";

type Props = {
  closeMenu: () => void;
  isVisible: boolean;
  newsId: number;
};

export const Menu = ({ closeMenu, isVisible, newsId }: Props) => {
  const navigation = useNavigation<RootNavigationProp<"NewsTalkRoom">>();

  const itemList: ListItem[] = [
    {
      title: "元のニュースを見る",
      onPress: () => {
        closeMenu();
        navigation.navigate("NewsWebView", {
          id: newsId,
        });
      },
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
