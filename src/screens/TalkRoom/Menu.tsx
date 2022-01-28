import React from "react";
import {} from "native-base";
import { InstaLikeModal, ListItem } from "src/components/InstaLikeModal";
import { Alert } from "react-native";
import { useDeleteThoughtTalkRoomMutation } from "src/generated/graphql";
import { useDeleteThoughtTalkRoomsItemFromCache } from "src/hooks/thoughtTalkRoom";
import { spinnerVisibleVar } from "src/stores/spinner";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";

type Props = {
  isVisible: boolean;
  closeMenu: () => void;
  talkRoomId: number;
};

export const Menu = ({ isVisible, closeMenu, talkRoomId }: Props) => {
  const [deleteTalkRoomMutation] = useDeleteThoughtTalkRoomMutation();

  const { deleteThoghtTalkRoom } = useDeleteThoughtTalkRoomsItemFromCache();

  const navigation = useNavigation<RootNavigationProp<"TalkRoom">>();

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
                spinnerVisibleVar(true);
                try {
                  await deleteTalkRoomMutation({
                    variables: {
                      input: {
                        talkRoomId,
                      },
                    },
                    update: () => {
                      deleteThoghtTalkRoom({ talkRoomId });
                      navigation.goBack();
                    },
                  });
                } catch (e) {
                  closeMenu();
                  console.log(e);
                } finally {
                  spinnerVisibleVar(false);
                }
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
