import React from "react";
import { Box, Button } from "native-base";
import { CloseButton } from "src/components/CloseButton";
import { StyleSheet } from "react-native";
import {
  GetNewsTalkRoomsDocument,
  GetNewsTalkRoomsQuery,
  useJoinNewsTalkRoomMutation,
} from "src/generated/graphql";
import { useFindNewsTalkRoomFromNewsId } from "src/hooks/newsTalkRoom";
import { spinnerVisibleVar } from "src/stores/spinner";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";

type Props = {
  onCloseButtonPress: () => void;
  newsId: number;
};

export const JoinTalkButton = ({ onCloseButtonPress, newsId }: Props) => {
  const navigation = useNavigation<RootNavigationProp<"NewsWebView">>();

  const [joinNewsTalkRoomMutation] = useJoinNewsTalkRoomMutation();

  const { findNewsTalkRoom } = useFindNewsTalkRoomFromNewsId();

  const onJoinPress = async () => {
    let talkRoomId: number | null = null;

    const existingTalkRoom = findNewsTalkRoom({ newsId });

    if (existingTalkRoom) {
      talkRoomId = existingTalkRoom.id;
    } else {
      try {
        spinnerVisibleVar(true);
        const { data } = await joinNewsTalkRoomMutation({
          variables: {
            input: {
              newsId,
            },
          },
          update: (cache, { data: responseData }) => {
            const queryData = cache.readQuery<GetNewsTalkRoomsQuery>({
              query: GetNewsTalkRoomsDocument,
            });

            if (queryData) {
              cache.writeQuery({
                query: GetNewsTalkRoomsDocument,
                data: {
                  newsTalkRooms: [
                    responseData.joinNewsTalkRoom,
                    ...queryData.newsTalkRooms,
                  ],
                },
              });

              talkRoomId = responseData.joinNewsTalkRoom.id;
            }
          },
        });
      } catch (e) {
        console.log(e);
      } finally {
        spinnerVisibleVar(false);
      }
    }

    if (talkRoomId) {
      navigation.navigate("NewsTalkRoom", {
        screen: "NewsTalkRoomMain",
        params: {
          id: talkRoomId,
        },
      });
    }
  };

  return (
    <Box
      position="absolute"
      w="90%"
      alignItems="center"
      alignSelf="center"
      bottom={4}
    >
      <CloseButton
        size={7}
        style={styles.closeButton}
        onPress={onCloseButtonPress}
      />
      <Button w="100%" _text={{ fontSize: 16 }} onPress={onJoinPress}>
        このニュースについてトークする
      </Button>
    </Box>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: "flex-end",
    transform: [{ translateY: -15 }],
  },
});
