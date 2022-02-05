import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { RootNavigationScreenProp } from "src/types";
import {
  useMeQuery,
  useCreateThoughtTalkRoomMessageMutation,
  useCreateUserThoughtTalkRoomMessageSeenMutation,
  GetThoughtTalkRoomMessagesQuery,
  CustomErrorResponseCode,
  PageInfo,
  GetThoughtTalkRoomMessagesQueryHookResult,
  GetThoughtTalkRoomMessagesQueryResult,
  GetThoughtTalkRoomMembersQueryResult,
  GetNewsTalkRoomMessagesQueryResult,
  GetNewsTalkRoomMessagesQuery,
  NewsTalkRoomMessageEdge,
  ThoughtTalkRoomMessageEdge,
  TalkRoomMessage,
  ThoughtTalkRoomMessage,
  NewsTalkRoomMessage,
} from "src/generated/graphql";
import { IMessage } from "react-native-gifted-chat";
import { BaseChat } from "src/components/BaseChat";
import { NO_USER_IMAGE_URL } from "src/constants";
import { createRandomStr } from "src/utils";
import { logJson, getGraphQLError } from "src/utils";
import { btoa } from "react-native-quick-base64";
import { Alert } from "react-native";
import { useDeleteThoughtTalkRoomsItemFromCache } from "src/hooks/thoughtTalkRoom";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";

type Props =
  | {
      type: "Thought";
      roomId: number;
      messageData: GetThoughtTalkRoomMessagesQueryResult["data"];
      messageFetchMore: GetThoughtTalkRoomMessagesQueryResult["fetchMore"];
    }
  | {
      type: "News";
      roomId: number;
      messageData: GetNewsTalkRoomMessagesQueryResult["data"];
      messageFetchMore: GetNewsTalkRoomMessagesQueryResult["fetchMore"];
    };

const isTmp = (str: string) => str.slice(0, 3) === "tmp";

export const TalkRoom = (props: Props) => {
  const { roomId } = props;

  const navigation = useNavigation<RootNavigationProp<"ThoughtTalkRoom">>();

  const {
    data: { me },
  } = useMeQuery();

  const [createMessageMutation] = useCreateThoughtTalkRoomMessageMutation();

  const [
    createSeenMutation,
  ] = useCreateUserThoughtTalkRoomMessageSeenMutation();

  const { deleteThoghtTalkRoom } = useDeleteThoughtTalkRoomsItemFromCache();

  const [pageInfo, setPageInfo] = useState<PageInfo>(
    props.type === "Thought"
      ? props.messageData?.thoughtTalkRoom.messages.pageInfo
      : props.messageData.newsTalkRoom.messages.pageInfo
  );

  useEffect(() => {
    if (props.messageData) {
      const newMessageInfo =
        props.type === "Thought"
          ? props.messageData.thoughtTalkRoom.messages.pageInfo
          : props.messageData.newsTalkRoom.messages.pageInfo;

      setPageInfo((currentInfo) => {
        // トークルームを開いたままActiveになるとキャッシュのPageInfoも更新される。その更新されたものを使用すると無限ローディングでダブるのでチェック
        if (Number(newMessageInfo.endCursor) < Number(currentInfo.endCursor)) {
          return newMessageInfo;
        } else {
          return currentInfo;
        }
      });
    }
  }, [props.messageData]);

  // チャットに表示されるメッセージ
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [latestMessage, setLatestMessage] = useState<IMessage | null>(null);

  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  useEffect(() => {
    if (messages.length && !isTmp(messages[0]._id.toString() as string)) {
      setLatestMessage(messages[0]);
    }
  }, [messages]);

  // チャットに表示するためのメッセージデータの作成
  const createNewIMessage = <
    T extends ThoughtTalkRoomMessage | NewsTalkRoomMessage
  >(
    message: T
  ) => {
    const { replyMessage } = message;

    return {
      _id: message.id,
      text: message.text,
      createdAt: new Date(Number(message.createdAt)),
      user: {
        _id: message.sender.id,
        name: message.sender.name,
        avatar: message.sender.imageUrl ?? NO_USER_IMAGE_URL,
      },
      replyMessage: replyMessage
        ? {
            id: Number(replyMessage.id),
            text: replyMessage.text,
            user: {
              id: replyMessage.sender.id,
              name: replyMessage.sender.name,
            },
          }
        : null,
    };
  };

  // 初回キャッシュのデータからのみここでセット
  useEffect(() => {
    if (props.messageData) {
      const edges =
        props.type === "Thought"
          ? props.messageData.thoughtTalkRoom.messages.edges
          : props.messageData.newsTalkRoom.messages.edges;

      const im: IMessage[] = edges.map((edge: typeof edges[number]) =>
        createNewIMessage(edge.node)
      );

      setMessages(im);
    }
  }, []);

  // SubscriptionやActive時のデータの取得で新たに取得したメッセージ追加
  useEffect(() => {
    if (props.messageData) {
      const messageEdges =
        props.type === "Thought"
          ? props.messageData.thoughtTalkRoom.messages.edges
          : props.messageData.newsTalkRoom.messages.edges;
      if (messageEdges.length) {
        const firstMessage = messageEdges[0].node;

        // 自分で送信したメッセージのサブスクライブは無視する
        if (firstMessage.sender.id === me.id) {
          return;
        }

        setMessages((currentData) => {
          // fetchMoreとかでキャッシュ更新するとこのEffectも呼ばれる。ただ、新しいメッセージを作成する必要はないので現在のデータをリターン
          if (currentData.length && currentData[0]._id === firstMessage.id) {
            return currentData;
          }

          const newMessageData: IMessage[] = [];

          for (const messageEdge of messageEdges) {
            if (messageEdge.node.id !== Number(currentData[0]._id)) {
              const IMessageData = createNewIMessage(messageEdge.node);

              newMessageData.push(IMessageData);
            } else {
              break;
            }
          }

          return [...newMessageData, ...currentData];
        });
      }
    }
  }, [props.messageData, setMessages]);

  // 既読の作成
  useEffect(() => {
    (async function () {
      if (latestMessage && latestMessage.user._id !== me.id) {
        try {
          await createSeenMutation({
            variables: {
              input: {
                messageId: Number(latestMessage._id),
                roomId,
              },
            },
          });
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [latestMessage]);

  // メッセージ送信
  const onSendPress = async (inputMessages: IMessage[]) => {
    const newMessageData = inputMessages[0];

    const tempId = "tmp" + createRandomStr();

    setReplyMessage(null);

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
        replyMessage: replyMessage
          ? {
              id: Number(replyMessage._id),
              text: replyMessage.text,
              user: {
                id: replyMessage.user._id,
                name: replyMessage.user.name,
              },
            }
          : null,
      };

      return [newTempIMessageData, ...currentData];
    });

    try {
      const { data } = await createMessageMutation({
        variables: {
          input: {
            text: inputMessages[0].text,
            roomId,
            replyTo: replyMessage ? Number(replyMessage._id) : null,
          },
        },
      });

      const newIMessageData = createNewIMessage(
        data.createThoughtTalkRoomMessage
      );

      setMessages((currentData) => {
        const prev = currentData.filter((c) => c._id !== tempId);
        return [newIMessageData, ...prev];
      });
    } catch (e) {
      const error = getGraphQLError(e, 0);

      if (error?.code === CustomErrorResponseCode.InvalidRequest) {
        Alert.alert(error.message, "", [
          {
            text: "OK",
            onPress: async () => {
              deleteThoghtTalkRoom({ talkRoomId: roomId });
              navigation.goBack();
            },
          },
        ]);
      }

      setMessages((c) => {
        return c.filter((_c) => _c._id !== tempId);
      });
    }
  };

  const infiniteLoad = async () => {
    if (pageInfo) {
      if (pageInfo.hasNextPage) {
        const { endCursor } = pageInfo;

        const setNewMessages = <
          T extends ThoughtTalkRoomMessageEdge | NewsTalkRoomMessageEdge
        >(
          messageEdges: T[]
        ) => {
          if (messageEdges) {
            const im: IMessage[] = messageEdges.map((edge) => {
              return createNewIMessage(edge.node);
            });

            setMessages((currentMessages) => {
              return [...currentMessages, ...im];
            });
          }
        };

        if (props.type === "Thought") {
          const { data } = await props.messageFetchMore<
            GetThoughtTalkRoomMessagesQuery,
            { messageCursor: string }
          >({
            variables: {
              messageCursor: endCursor ? btoa(endCursor) : null,
            },
          });

          const messageEdges = data.thoughtTalkRoom.messages.edges;

          if (messageEdges) {
            setNewMessages(messageEdges);
          }
        }

        if (props.type === "News") {
          const { data } = await props.messageFetchMore<
            GetNewsTalkRoomMessagesQuery,
            { messageCursor: string }
          >({
            variables: {
              messageCursor: endCursor ? btoa(endCursor) : null,
            },
          });

          const messageEdges = data.newsTalkRoom.messages.edges;

          if (messageEdges) {
            setNewMessages(messageEdges);
          }
        }
      }
    }
  };

  return (
    <>
      <BaseChat
        messages={messages}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
        user={{
          _id: me.id,
        }}
        onSend={onSendPress}
        infiniteLoad={infiniteLoad}
      />
    </>
  );
};
