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
  useCreateThoughtTalkRoomMessageMutation,
  useCreateUserThoughtTalkRoomMessageSeenMutation,
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
  const [createMessageMutation] = useCreateThoughtTalkRoomMessageMutation();
  const [
    createSeenMutation,
  ] = useCreateUserThoughtTalkRoomMessageSeenMutation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, [navigation]);

  const { data: talkRoomData } = useGetThoughtTalkRoomQuery({
    variables: {
      id,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const queryCacheData = useMemo(() => {
    const queryResult = client.cache.readQuery<
      GetThoughtTalkRoomsQueryResult["data"]
    >({
      query: GetThoughtTalkRoomsDocument,
    });

    return queryResult.thoughtTalkRooms.find((t) => t.id === id);
  }, [client]);

  // チャットに表示されるメッセージ
  const [messages, setMessages] = useState<IMessage[]>([]);

  // 初回キャッシュのデータからのみここでセット
  useEffect(() => {
    if (queryCacheData) {
      const im: IMessage[] = queryCacheData.messages.map((message) => ({
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

  // Subscriptionで更新されたデータ追加
  useEffect(() => {
    if (talkRoomData && messages.length) {
      const newMessageData = talkRoomData.thoughtTalkRoom.messages[0];
      if (messages[0]._id !== newMessageData.id) {
        setMessages((currentData) => {
          const { id, text, createdAt, sender } = newMessageData;
          const newIMessageData: IMessage = {
            _id: id,
            text,
            createdAt: new Date(Number(createdAt)),
            user: {
              _id: sender.id,
              name: sender.name,
              avatar: sender.imageUrl ?? NO_USER_IMAGE_URL,
            },
          };

          return [newIMessageData, ...currentData];
        });
      }
    }
  }, [talkRoomData, messages]);

  // 既読の作成
  useEffect(() => {
    (async function () {
      console.log(messages.length);
      if (messages.length) {
        console.log("👀 create seen");
        const firstData = messages[0];
        try {
          await createSeenMutation({
            variables: {
              input: {
                messageId: firstData._id as string,
                roomId: id,
              },
            },
          });
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [messages]);

  const onSendPress = async (message: IMessage[]) => {
    await createMessageMutation({
      variables: {
        input: {
          text: message[0].text,
          roomId: id,
        },
      },
    });
  };

  return (
    <BaseChat
      messages={messages}
      user={{
        _id: me.id,
      }}
      onSend={onSendPress}
    />
  );
};
