import React from "react";
import {} from "native-base";
import { InstaLikeModal, ListItem } from "src/components/InstaLikeModal";
import { Alert } from "react-native";
import { useDeleteThoughtTalkRoomMutation } from "src/generated/graphql";

type Props = {
  isVisible: boolean;
  closeMenu: () => void;
  talkRoomId: number;
};

export const Menu = ({ isVisible, closeMenu, talkRoomId }: Props) => {
  const [deleteTalkRoomMutation] = useDeleteThoughtTalkRoomMutation();

  const menuList: ListItem[] = [
    {
      title: "トークルームを解散",
      color: "red",
      onPress: () => {
        Alert.alert(
          "トークルームを解散",
          "全てのメンバー、メッセージが削除されます。解散してよろしいですか?",
          [
            {
              text: "キャンセル",
              style: "cancel",
            },
            {
              text: "解散",
              style: "destructive",
              onPress: async () => {
                await deleteTalkRoomMutation({
                  variables: {
                    input: {
                      talkRoomId,
                    },
                  },
                });
              },
            },
          ]
        );
      },
    },
    {
      title: "元の投稿を見る",
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
