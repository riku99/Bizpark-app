import React, { useLayoutEffect, useMemo, useEffect, useState } from "react";
import { RootNavigationScreenProp } from "src/types";
import { useApolloClient, gql } from "@apollo/client";
import {
  useGetThoughtTalkRoomQuery,
  useMeQuery,
  useCreateThoughtTalkRoomMessageMutation,
  useCreateUserThoughtTalkRoomMessageSeenMutation,
  ThoughtTalkRoomPartsFragment,
} from "src/generated/graphql";
import { IMessage } from "react-native-gifted-chat";
import { BaseChat } from "src/components/BaseChat";
import { NO_USER_IMAGE_URL } from "src/constants";
import { createRandomStr } from "src/utils";

type Props = RootNavigationScreenProp<"TalkRoom">;

const isTmp = (str: string) => str.slice(0, 3) === "tmp";

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

  // ここ「一回のみのアクセス」でいいのならFragmentの方が都合いい
  const queryCacheData = useMemo(() => {
    const fragmentResult = client.cache.readFragment<ThoughtTalkRoomPartsFragment>(
      {
        id: client.cache.identify({
          __typename: "ThoughtTalkRoom",
          id,
        }),
        fragment: gql`
          fragment TalkRoomMessage on ThoughtTalkRoom {
            messages {
              id
              text
              createdAt
              sender {
                id
                name
                imageUrl
              }
              roomId
            }
          }
        `,
      }
    );

    return fragmentResult;
  }, [client]);

  useEffect(() => {
    console.log("queryCacheDataの変更がありました");
  }, [queryCacheData]);

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

  // Subscriptionで更新されたデータ追加;
  useEffect(() => {
    if (talkRoomData) {
      const talkRoomDataMessages = talkRoomData.thoughtTalkRoom.messages;
      if (talkRoomDataMessages.length) {
        const subscribedMessage = talkRoomData.thoughtTalkRoom.messages[0];

        // 自分で送信したメッセージのサブスクライブは無視する
        if (subscribedMessage.sender.id === me.id) {
          return;
        }

        setMessages((currentData) => {
          const { id, text, createdAt, sender } = subscribedMessage;

          if (
            currentData.length &&
            currentData[0]._id === subscribedMessage.id
          ) {
            return currentData;
          }

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
  }, [talkRoomData, setMessages]);

  // 既読の作成
  useEffect(() => {
    (async function () {
      if (messages.length && !isTmp(messages[0]._id as string)) {
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

  const onSendPress = async (inputMessages: IMessage[]) => {
    const newMessageData = inputMessages[0];

    const tempId = "tmp" + createRandomStr();

    setMessages((currentData) => {
      const { text, createdAt } = newMessageData;
      const newTempIMessageData: IMessage = {
        _id: tempId,
        text,
        createdAt: new Date(Number(createdAt)),
        user: {
          _id: me.id,
          name: me.name,
          avatar: me.imageUrl ?? NO_USER_IMAGE_URL,
        },
      };

      return [newTempIMessageData, ...currentData];
    });
    try {
      const { data } = await createMessageMutation({
        variables: {
          input: {
            text: inputMessages[0].text,
            roomId: id,
          },
        },
      });

      const messageData = data.createThoughtTalkRoomMessage;

      const newIMessageData: IMessage = {
        _id: messageData.id,
        text: messageData.text,
        createdAt: new Date(Number(messageData.createdAt)),
        user: {
          _id: me.id,
          name: me.name,
          avatar: me.imageUrl,
        },
      };

      setMessages((currentData) => {
        const prev = currentData.filter((c) => c._id !== tempId);
        return [newIMessageData, ...prev];
      });
    } catch (e) {
      setMessages((c) => {
        return c.filter((_c) => _c._id !== tempId);
      });
    }
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
