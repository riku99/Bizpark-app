import React, { useLayoutEffect, useMemo, useEffect, useState } from "react";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetThoughtTalkRoomQuery,
  useMeQuery,
  useCreateThoughtTalkRoomMessageMutation,
  useCreateUserThoughtTalkRoomMessageSeenMutation,
  useGetThoughtTalkRoomMessagesQuery,
  GetThoughtTalkRoomMessagesQuery,
} from "src/generated/graphql";
import { IMessage } from "react-native-gifted-chat";
import { BaseChat } from "src/components/BaseChat";
import { NO_USER_IMAGE_URL } from "src/constants";
import { createRandomStr } from "src/utils";
import { useThoughtTalkRoomReadFragment } from "src/hooks/thoughtTalkRoom";
import { logJson } from "src/utils";
import { btoa } from "react-native-quick-base64";

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
  const fragmentCacheData = useThoughtTalkRoomReadFragment({ id });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, [navigation]);

  const { data: talkRoomData, fetchMore } = useGetThoughtTalkRoomMessagesQuery({
    variables: {
      id,
    },
    // fetchPolicy: "network-only",
    // nextFetchPolicy: "cache-first",
  });

  // チャットに表示されるメッセージ
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [latestMessage, setLatestMessage] = useState<IMessage | null>(null);

  useEffect(() => {
    if (messages.length && !isTmp(messages[0]._id.toString() as string)) {
      setLatestMessage(messages[0]);
    }
  }, [messages]);

  // 初回キャッシュのデータからのみここでセット
  useEffect(() => {
    if (fragmentCacheData) {
      const im: IMessage[] = fragmentCacheData.messages.edges.map(
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

          // fetchMoreとかでキャッシュ更新するとこのEffectも呼ばれる。ただ、新しいメッセージを作成する必要はないので現在のデータをリターン
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

  // useEffect(() => {
  //   console.log("fetchMoreの後に呼ばれたくない");
  // }, [messages]);

  // useEffect(() => {
  //   if (latestMessage && latestMessage.user._id !== me.id) {
  //     console.log("既読作る");
  //   }
  // }, [latestMessage]);

  // 既読の作成
  useEffect(() => {
    (async function () {
      if (latestMessage && latestMessage.user._id !== me.id) {
        console.log("👀 create seen");
        try {
          await createSeenMutation({
            variables: {
              input: {
                messageId: Number(latestMessage._id),
                roomId: id,
              },
            },
          });
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [latestMessage]);

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

  const infiniteLoad = async () => {
    if (talkRoomData) {
      const { pageInfo } = talkRoomData.thoughtTalkRoom.messages;
      if (pageInfo.hasNextPage) {
        const { endCursor } = pageInfo;

        const { data: fetchData } = await fetchMore<
          GetThoughtTalkRoomMessagesQuery,
          { messageCursor: string }
        >({
          variables: {
            messageCursor: endCursor ? btoa(endCursor) : null,
          },
        });

        if (fetchData) {
          const im: IMessage[] = fetchData.thoughtTalkRoom.messages.edges.map(
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

          setMessages((currentMessages) => {
            return [...currentMessages, ...im];
          });
        }
      }
    }
  };

  return (
    <BaseChat
      messages={messages}
      user={{
        _id: me.id,
      }}
      onSend={onSendPress}
      infiniteLoad={infiniteLoad}
    />
  );
};
