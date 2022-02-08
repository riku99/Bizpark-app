import React, { useCallback, useState } from "react";
import { Box, FlatList, useColorModeValue } from "native-base";
import {
  useGetThoughtTalkRoomsQuery,
  useGetOutThoughtTalkRoomMutation,
  GetThoughtTalkRoomsQueryResult,
} from "src/generated/graphql";
import { RootNavigationProp } from "src/types";
import { useNavigation } from "@react-navigation/native";
import { InstaLikeModal } from "src/components/InstaLikeModal";
import { Alert } from "react-native";
import { useToast } from "react-native-toast-notifications";
import * as Haptics from "expo-haptics";
import { useDeleteThoughtTalkRoomsItemFromCache } from "src/hooks/thoughtTalkRoom";
import { TalkRoomListItem } from "src/components/TalkRoomListItem";

type Item = GetThoughtTalkRoomsQueryResult["data"]["thoughtTalkRooms"][number];

export const ThoughtTalkRoomList = React.memo(() => {
  const { data } = useGetThoughtTalkRoomsQuery();
  const [getOutMutation] = useGetOutThoughtTalkRoomMutation();
  const pressedColor = useColorModeValue("lt.pressed", "dt.pressed");
  const textGray = useColorModeValue("lt.textGray", "dt.textGray");
  const navigation = useNavigation<RootNavigationProp<"Tab">>();
  const toast = useToast();
  const [modalData, setModalData] = useState<{ roomId: number } | null>(null);

  const closeModal = () => {
    setModalData(null);
  };

  const { deleteThoghtTalkRoom } = useDeleteThoughtTalkRoomsItemFromCache();

  const modalList = [
    {
      title: "トークから抜ける",
      color: "red",
      onPress: () => {
        Alert.alert(
          "トークから抜ける",
          "このトークルームは表示されなくなります。トークから抜けてよろしいですか?",
          [
            {
              text: "キャンセル",
              style: "cancel",
            },
            {
              text: "抜ける",
              style: "destructive",
              onPress: async () => {
                if (modalData) {
                  try {
                    await getOutMutation({
                      variables: {
                        input: {
                          roomId: modalData.roomId,
                        },
                      },
                      update: () => {
                        deleteThoghtTalkRoom({ talkRoomId: modalData.roomId });
                      },
                    });

                    toast.show("削除しました", { type: "success" });
                  } catch (e) {
                  } finally {
                    setModalData(null);
                  }
                }
              },
            },
          ]
        );
      },
    },
  ];

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      let userImageUrls: string[] = [];

      const { edges } = item.messages;

      for (let i = 0; i <= 7; i++) {
        const member = item.members.edges[i];
        if (member) {
          userImageUrls.push(member.node.user.imageUrl);
        }
      }

      const title = item.thought.title ? item.thought.title : item.thought.text;
      const text = edges.length ? edges[0].node.text : "";
      const allMessageSeen = item.allMessageSeen;

      const onPress = () => {
        navigation.navigate("ThoughtTalkRoom", {
          screen: "ThoughtTalkRoomMain",
          params: {
            id: item.id,
          },
        });
      };

      const onLongPress = () => {
        Haptics.selectionAsync();
        setModalData({ roomId: item.id });
      };

      return (
        <TalkRoomListItem
          title={title}
          text={text}
          allMessageSeen={allMessageSeen}
          onPress={onPress}
          onLongPress={onLongPress}
          userImageUrls={userImageUrls}
        />
      );
    },
    [pressedColor, textGray]
  );

  if (!data) {
    return <></>;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={data.thoughtTalkRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <InstaLikeModal
        isVisible={!!modalData}
        list={modalList}
        onBackdropPress={closeModal}
        onCancel={closeModal}
      />
    </Box>
  );
});
