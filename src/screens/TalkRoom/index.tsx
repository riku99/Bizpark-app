import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetThoughtTalkRoomQuery,
  useMeQuery,
  useCreateThoughtTalkRoomMessageMutation,
  useCreateUserThoughtTalkRoomMessageSeenMutation,
  GetThoughtTalkRoomMessagesQuery,
  CustomErrorResponseCode,
} from "src/generated/graphql";
import { IMessage } from "react-native-gifted-chat";
import { BaseChat } from "src/components/BaseChat";
import { NO_USER_IMAGE_URL } from "src/constants";
import { createRandomStr } from "src/utils";
import { useThoughtTalkRoomReadFragment } from "src/hooks/thoughtTalkRoom";
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

  const fragmentCacheData = useThoughtTalkRoomReadFragment({ id });

  const {
    data: talkRoomData,
    fetchMore,
    error: talkRoomError,
  } = useGetThoughtTalkRoomQuery({
    variables: {
      id,
    },
    // fetchPolicy: "network-only",
    // nextFetchPolicy: "cache-first",
  });

  const { deleteThoghtTalkRoom } = useDeleteThoughtTalkRoomsItemFromCache();

  // トークルームが見つからなかった時の処理
  useEffect(() => {
    if (talkRoomError) {
      const e = getGraphQLError(talkRoomError, 0);
      if (e.code === CustomErrorResponseCode.NotFound) {
        Alert.alert(e.message, "", [
          {
            text: "OK",
            style: "cancel",
            onPress: () => {
              deleteThoghtTalkRoom({ talkRoomId: id });
              navigation.goBack();
            },
          },
        ]);
      }
    }
  }, [talkRoomError]);

  const [modalVisible, setModalVisible] = useState(false);

  // このトークルームの元の投稿が自分のものかどうか
  const isMyThuoghtTalkRoomData = useMemo(() => {
    if (!talkRoomData || !me) {
      return false;
    }

    return talkRoomData.thoughtTalkRoom.thought.contributor.id === me.id;
  }, [talkRoomData, me]);

  const renderHeaderTitle = useCallback(() => {
    return (
      <HeaderTitle
        talkRoomData={talkRoomData}
        onPress={() => {
          navigation.navigate("TalkRoomMembers", {
            talkRoomId: id,
          });
        }}
      />
    );
  }, [talkRoomData, navigation]);

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
          const {
            id,
            text,
            createdAt,
            sender,
            replyMessage,
          } = subscribedMessage;

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

          return [newIMessageData, ...currentData];
        });
      }
    }
  }, [talkRoomData, setMessages]);

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
    // fetchで取得したデータを常に使うと、Subscriptionで取得したデータがデフォルトのfirstを超えている場合pageInfoのデータと実際に取得したいデータの辻褄が合わなくなるのでcacheのpageInfoの方も検証
    if (talkRoomData && fragmentCacheData) {
      const {
        pageInfo: fetchInfo,
        edges: fetchEdges,
      } = talkRoomData.thoughtTalkRoom.messages;

      const {
        edges: cacheEdges,
        pageInfo: cacheInfo,
      } = fragmentCacheData.messages;

      const pageInfo =
        cacheEdges.length > fetchEdges.length ? cacheInfo : fetchInfo;

      if (pageInfo.hasNextPage) {
        // 基本CursorにはpageInfoのものを使っているが、メッセージはSubscriptionにより状態が更新されていくので messages のIDを使用
        const endCursor = messages[messages.length - 1]._id.toString();

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
