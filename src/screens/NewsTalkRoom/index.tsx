import React, { useLayoutEffect } from "react";
import {} from "react-native";
import { Box } from "native-base";
import { HeaderBackButton } from "@react-navigation/elements";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetNewsTalkRoomMessagesQuery,
  useMeQuery,
} from "src/generated/graphql";
import { TalkRoomMessage } from "src/components/TalkRoomMessage";

type Props = RootNavigationScreenProp<"ThoughtTalkRoomMain">;

export const NewsTalkRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;

  const {
    data: { me },
  } = useMeQuery();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);

  const { data: messageData, fetchMore } = useGetNewsTalkRoomMessagesQuery({
    variables: {
      talkRoomId: id,
    },
    fetchPolicy: "cache-only",
  });

  return (
    <>
      <TalkRoomMessage
        type="News"
        roomId={id}
        messageData={messageData}
        messageFetchMore={fetchMore}
      />
    </>
  );
};
