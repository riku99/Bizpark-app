import React from "react";
import { InstaLikeModal } from "src/components/InstaLikeModal";
import { Alert } from "react-native";

type Props = {
  isVisible;
  userId: string;
  blocking?: boolean;
  onBlockPress: () => Promise<void>;
  onUnBlockPress: () => Promise<void>;
  closeMenu: () => void;
};

export const Menu = ({
  isVisible,
  userId,
  blocking,
  onBlockPress,
  onUnBlockPress,
  closeMenu,
}: Props) => {
  const menuList = [
    {
      title: blocking ? "ブロック解除" : "ブロックする",
      color: "#f51000",
      onPress: async () => {
        if (userId) {
          try {
            if (!blocking) {
              Alert.alert(
                "ブロックしますか?",
                "シェアが表示されなくなり、フォローも解除されます",
                [
                  {
                    text: "キャンセル",
                    style: "cancel",
                  },
                  {
                    text: "ブロックする",
                    style: "destructive",
                    onPress: async () => {
                      await onBlockPress();
                    },
                  },
                ]
              );
            } else {
              Alert.alert(
                "ブロック解除しますか?",
                "シェアが表示されるようになり、フォローも可能になります",
                [
                  {
                    text: "キャンセル",
                    style: "cancel",
                  },
                  {
                    text: "解除する",
                    style: "destructive",
                    onPress: async () => {
                      await onUnBlockPress();
                    },
                  },
                ]
              );
            }
          } catch (e) {
          } finally {
            closeMenu();
          }
        }
      },
    },
  ];

  return (
    <InstaLikeModal
      list={menuList}
      onCancel={closeMenu}
      onBackdropPress={closeMenu}
      isVisible={isVisible}
    />
  );
};
