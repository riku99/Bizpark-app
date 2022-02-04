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
  useGetThoughtTalkRoomMembersQuery,
  useGetThoughtTalkRoomMessagesQuery,
  useGetThoughtTalkRoomParentQuery,
  PageInfo,
} from "src/generated/graphql";
import { IMessage } from "react-native-gifted-chat";
import { BaseChat } from "src/components/BaseChat";
import { NO_USER_IMAGE_URL } from "src/constants";
import { createRandomStr } from "src/utils";
import { logJson, getGraphQLError } from "src/utils";
import { btoa } from "react-native-quick-base64";
import { HeaderBackButton } from "@react-navigation/elements";
import { Alert } from "react-native";
import { DotsHorizontal } from "src/components/DotsHorizontal";
import { Menu } from "./Menu";
import { HeaderTitle } from "./HeaderTitle";
import { useDeleteThoughtTalkRoomsItemFromCache } from "src/hooks/thoughtTalkRoom";

type Props = RootNavigationScreenProp<"TalkRoomMain">;

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

  // MessagesQueryもMembersQueryもParentQueryも基本全てキャッシュあるのでそこから取得されるが、messagesはキャッシュからじゃないとエラー出る可能性あるのでfetchPolicyを指定
  const { fetchMore, data: messagesData } = useGetThoughtTalkRoomMessagesQuery({
    variables: {
      id,
    },
    fetchPolicy: "cache-only",
  });

  const [pageInfo, setPageInfo] = useState<PageInfo>(
    messagesData?.thoughtTalkRoom.messages.pageInfo
  );

  useEffect(() => {
    if (messagesData) {
      const newMessageInfo = messagesData.thoughtTalkRoom.messages.pageInfo;

      setPageInfo((currentInfo) => {
        // トークルームを開いたままActiveになるとキャッシュのPageInfoも更新される。その更新されたものを使用すると無限ローディングでダブるのでチェック
        if (Number(newMessageInfo.endCursor) < Number(currentInfo.endCursor)) {
          return newMessageInfo;
        } else {
          return currentInfo;
        }
      });
    }
  }, [messagesData]);

  const { data: membersData } = useGetThoughtTalkRoomMembersQuery({
    variables: {
      talkRoomId: id,
    },
  });

  const { data: thoughtData } = useGetThoughtTalkRoomParentQuery({
    variables: {
      id,
    },
  });

  const { deleteThoghtTalkRoom } = useDeleteThoughtTalkRoomsItemFromCache();

  const [modalVisible, setModalVisible] = useState(false);

  // このトークルームの元の投稿が自分のものかどうか
  const isMyThuoghtTalkRoomData = useMemo(() => {
    if (!thoughtData || !me) {
      return false;
    }

    return thoughtData.thoughtTalkRoom.thought.contributor.id === me.id;
  }, [thoughtData, me]);

  const renderHeaderTitle = useCallback(() => {
    return (
      <HeaderTitle
        members={membersData?.thoughtTalkRoom.members}
        onPress={() => {
          navigation.navigate("TalkRoomMembers", {
            talkRoomId: id,
          });
        }}
      />
    );
  }, [membersData, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: renderHeaderTitle,
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => (
        <DotsHorizontal onPress={() => setModalVisible(true)} />
      ),
    });
  }, [navigation, renderHeaderTitle]);

  // チャットに表示されるメッセージ
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [latestMessage, setLatestMessage] = useState<IMessage | null>(null);

  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  useEffect(() => {
    if (messages.length && !isTmp(messages[0]._id.toString() as string)) {
      setLatestMessage(messages[0]);
    }
  }, [messages]);

  // 初回キャッシュのデータからのみここでセット
  useEffect(() => {
    if (messagesData) {
      const im: IMessage[] = messagesData.thoughtTalkRoom.messages.edges.map(
        ({ node: message }) => ({
          _id: message.id,
          text: message.text,
          createdAt: new Date(Number(message.createdAt)),
          user: {
            _id: message.sender.id,
            name: message.sender.name,
            avatar: message.sender.imageUrl ?? NO_USER_IMAGE_URL,
          },
          replyMessage: message.replyMessage
            ? {
                id: message.replyMessage.id,
                text: message.replyMessage.text,
                user: {
                  id: message.replyMessage.sender.id,
                  name: message.replyMessage.sender.name,
                },
              }
            : null,
        })
      );

      setMessages(im);
    }
  }, []);

  // SubscriptionやActive時のデータの取得で新たに取得したメッセージ追加
  useEffect(() => {
    if (messagesData) {
      const talkRoomMessageEdges = messagesData.thoughtTalkRoom.messages.edges;
      if (talkRoomMessageEdges.length) {
        const firstMessage = talkRoomMessageEdges[0].node;

        // 自分で送信したメッセージのサブスクライブは無視する
        if (firstMessage.sender.id === me.id) {
          return;
        }

        setMessages((currentData) => {
          // fetchMoreとかでキャッシュ更新するとこのEffectも呼ばれる。ただ、新しいメッセージを作成する必要はないので現在のデータをリターン
          if (currentData.length && currentData[0]._id === firstMessage.id) {
            return currentData;
          }

          const newIMessagesData: IMessage[] = [];

          for (const messageEdge of talkRoomMessageEdges) {
            if (messageEdge.node.id !== Number(currentData[0]._id)) {
              const {
                id,
                text,
                createdAt,
                sender,
                replyMessage,
              } = messageEdge.node;

              const IMssageData = {
                _id: id,
                text,
                createdAt: new Date(Number(createdAt)),
                user: {
                  _id: sender.id,
                  name: sender.name,
                  avatar: sender.imageUrl ?? NO_USER_IMAGE_URL,
                },
                replyMessage: replyMessage
                  ? {
                      id: replyMessage.id,
                      text: replyMessage.text,
                      user: {
                        id: replyMessage.sender.id,
                        name: replyMessage.sender.name,
                      },
                    }
                  : null,
              };

              newIMessagesData.push(IMssageData);
            } else {
              break;
            }
          }

          return [...newIMessagesData, ...currentData];
        });
      }
    }
  }, [messagesData, setMessages]);

  // 既読の作成
  useEffect(() => {
    (async function () {
      if (latestMessage && latestMessage.user._id !== me.id) {
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
            roomId: id,
            replyTo: replyMessage ? Number(replyMessage._id) : null,
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
              deleteThoghtTalkRoom({ talkRoomId: id });
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
            ({ node: message }) => {
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
            }
          );

          setMessages((currentMessages) => {
            return [...currentMessages, ...im];
          });
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

      <Menu
        isVisible={modalVisible}
        closeMenu={() => {
          setModalVisible(false);
        }}
        talkRoomId={id}
        isMyThuoghtTalkRoomData={isMyThuoghtTalkRoomData}
      />
    </>
  );
};
