import React, { useLayoutEffect, useMemo, useEffect, useState } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useApolloClient } from "@apollo/client";
import {
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQueryResult,
  GetThoughtTalkRoomQuery,
  useGetThoughtTalkRoomQuery,
  useMeQuery,
  useOnThoughtTalkRoomMessageCreatedSubscription,
} from "src/generated/graphql";
import { GiftedChat, IMessage, Bubble } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BaseChat } from "src/components/BaseChat";
import { NO_USER_IMAGE_URL } from "src/constants";

type Props = RootNavigationScreenProp<"TalkRoom">;

export const TalkRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const client = useApolloClient();
  const {
    data: { me },
  } = useMeQuery();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, [navigation]);

  const { data } = useGetThoughtTalkRoomQuery({
    variables: {
      id,
    },
    fetchPolicy: "network-only",
  });

  const queryData = useMemo(() => {
    console.log("memo👀");
    const queryResult = client.cache.readQuery<
      GetThoughtTalkRoomsQueryResult["data"]
    >({
      query: GetThoughtTalkRoomsDocument,
    });

    return queryResult.thoughtTalkRooms.find((t) => t.id === id);
  }, [data]);

  useEffect(() => {
    console.log("🌙 list query data is");
    console.log(queryData.messages);
  }, [queryData]);

  const [messages, setMessages] = useState([]);

  // 初回キャッシュのデータからのみここでセット
  useEffect(() => {
    console.log("set message 🆗");
    if (queryData) {
      const im: IMessage[] = queryData.messages.map((message) => ({
        _id: message.id,
        text: message.text,
        createdAt: new Date(Number(message.createdAt)),
        user: {
          _id: message.sender.id,
          name: message.sender.name,
          avatar: message.sender.imageUrl ?? NO_USER_IMAGE_URL,
        },
      }));

      setMessages(im);
    }
  }, []);

  const {
    data: messageData,
    error,
  } = useOnThoughtTalkRoomMessageCreatedSubscription();
  console.log(messageData);
  if (messageData) {
    console.log("updated message!");
    console.log(messageData);
  }

  return (
    <BaseChat
      messages={messages}
      user={{
        _id: me.id,
      }}
    />
  );
};
