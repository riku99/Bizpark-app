import React, { useLayoutEffect, useMemo, useEffect, useState } from "react";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetThoughtTalkRoomQuery,
  useMeQuery,
  useCreateThoughtTalkRoomMessageMutation,
  useCreateUserThoughtTalkRoomMessageSeenMutation,
} from "src/generated/graphql";
import { IMessage } from "react-native-gifted-chat";
import { BaseChat } from "src/components/BaseChat";
import { NO_USER_IMAGE_URL } from "src/constants";
import { createRandomStr } from "src/utils";
import { useThoughtTalkRoomReadFragment } from "src/hooks/thoughtTalkRoom";
import { logJson } from "src/utils";

type Props = RootNavigationScreenProp<"TalkRoom">;

const isTmp = (str: string) => str.slice(0, 3) === "tmp";

export const TalkRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const {
    data: { me },
  } = useMeQuery();
  const [createMessageMutation] = useCreateThoughtTalkRoomMessageMutation();
  const [
    createSeenMutation,
  ] = useCreateUserThoughtTalkRoomMessageSeenMutation();
  const queryCacheData = useThoughtTalkRoomReadFragment({ id });

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

  // チャットに表示されるメッセージ
  const [messages, setMessages] = useState<IMessage[]>([]);

  // 初回キャッシュのデータからのみここでセット
  useEffect(() => {
    if (queryCacheData) {
      const im: IMessage[] = queryCacheData.messages.edges.map(
        ({ node: message }) => ({
          _id: message.id,
          text: message.text,
          createdAt: new Date(Number(message.createdAt)),
          user: {
            _id: message.sender.id,
            name: message.sender.name,
            avatar: message.sender.imageUrl ?? NO_USER_IMAGE_URL,
          },
        })
      );

      setMessages(im);
    }
  }, []);

  // Subscriptionで更新されたデータ追加;
  useEffect(() => {
    if (talkRoomData) {
      const talkRoomMessageEdges = talkRoomData.thoughtTalkRoom.messages.edges;
      if (talkRoomMessageEdges.length) {
        const subscribedMessage = talkRoomMessageEdges[0].node;

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
      if (messages.length && !isTmp(messages[0]._id.toString() as string)) {
        console.log("👀 create seen data");
        const firstData = messages[0];
        try {
          await createSeenMutation({
            variables: {
              input: {
                messageId: Number(firstData._id),
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
