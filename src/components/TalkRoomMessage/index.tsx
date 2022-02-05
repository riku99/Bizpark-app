import React, { useEffect, useState } from "react";
import {
  useMeQuery,
  GetThoughtTalkRoomMessagesQuery,
  CustomErrorResponseCode,
  PageInfo,
  GetThoughtTalkRoomMessagesQueryResult,
  GetNewsTalkRoomMessagesQueryResult,
  GetNewsTalkRoomMessagesQuery,
  NewsTalkRoomMessageEdge,
  ThoughtTalkRoomMessageEdge,
  ThoughtTalkRoomMessage,
  NewsTalkRoomMessage,
  CreateThoughtTalkRoomMessageMutationFn,
  CreateUserThoughtTalkRoomMessageSeenMutationFn,
  CreateNewsTalkRoomMessageMutationFn,
} from "src/generated/graphql";
import { IMessage } from "react-native-gifted-chat";
import { BaseChat } from "src/components/BaseChat";
import { NO_USER_IMAGE_URL } from "src/constants";
import { createRandomStr } from "src/utils";
import { logJson, getGraphQLError } from "src/utils";
import { btoa } from "react-native-quick-base64";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";

type Props = (
  | {
      type: "Thought";
      roomId: number;
      messageData: GetThoughtTalkRoomMessagesQueryResult["data"];
      messageFetchMore: GetThoughtTalkRoomMessagesQueryResult["fetchMore"];
      createMessage: CreateThoughtTalkRoomMessageMutationFn;
      createSeen: CreateUserThoughtTalkRoomMessageSeenMutationFn;
    }
  | {
      type: "News";
      roomId: number;
      messageData: GetNewsTalkRoomMessagesQueryResult["data"];
      messageFetchMore: GetNewsTalkRoomMessagesQueryResult["fetchMore"];
      createMessage: CreateNewsTalkRoomMessageMutationFn;
    }
) & {
  deleteTalkRoomFromCache: ({ talkRoomId }: { talkRoomId: number }) => void;
};

const isTmp = (str: string) => str.slice(0, 3) === "tmp";

export const TalkRoomMessage = (props: Props) => {
  const { roomId } = props;

  const navigation = useNavigation<RootNavigationProp<"ThoughtTalkRoom">>();

  const {
    data: { me },
  } = useMeQuery();

  const [pageInfo, setPageInfo] = useState<PageInfo>(
    props.type === "Thought"
      ? props.messageData?.thoughtTalkRoom.messages.pageInfo
      : props.messageData?.newsTalkRoom.messages.pageInfo
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
  ): IMessage => {
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
          switch (props.type) {
            case "Thought":
              await props.createSeen({
                variables: {
                  input: {
                    messageId: Number(latestMessage._id),
                    roomId,
                  },
                },
              });
              break;

            default:
              break;
          }
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
      let mutationResult: Awaited<
        ReturnType<
          | CreateThoughtTalkRoomMessageMutationFn
          | CreateNewsTalkRoomMessageMutationFn
        >
      >;

      let newIMessageData: IMessage;

      switch (props.type) {
        case "Thought":
          const {
            data: createdThoughtTalkRoomMessageData,
          } = await props.createMessage({
            variables: {
              input: {
                text: inputMessages[0].text,
                roomId,
                replyTo: replyMessage ? Number(replyMessage._id) : null,
              },
            },
          });

          if (createdThoughtTalkRoomMessageData) {
            newIMessageData = createNewIMessage(
              createdThoughtTalkRoomMessageData.createThoughtTalkRoomMessage
            );
          }
          break;

        case "News":
          const {
            data: createdNewsTalkRoomMessageData,
          } = await props.createMessage({
            variables: {
              input: {
                text: inputMessages[0].text,
                talkRoomId: roomId,
                replyTo: replyMessage ? Number(replyMessage._id) : null,
              },
            },
          });

          if (createdNewsTalkRoomMessageData) {
            newIMessageData = createNewIMessage(
              createdNewsTalkRoomMessageData.createNewsTalkRoomMessage
            );
          }
          break;

        default:
          break;
      }

      if (newIMessageData) {
        setMessages((currentData) => {
          const prev = currentData.filter((c) => c._id !== tempId);
          return [newIMessageData, ...prev];
        });
      }
    } catch (e) {
      const error = getGraphQLError(e, 0);

      // トークルームが削除されている or メンバーから削除されている場合はキャッシュからトークルーム消す
      if (error?.code === CustomErrorResponseCode.InvalidRequest) {
        Alert.alert(error.message, "", [
          {
            text: "OK",
            onPress: async () => {
              props.deleteTalkRoomFromCache({ talkRoomId: roomId });
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
  );
};
