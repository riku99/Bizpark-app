import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
} from "react";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetThoughtTalkRoomQuery,
  useMeQuery,
  useCreateThoughtTalkRoomMessageMutation,
  useCreateUserThoughtTalkRoomMessageSeenMutation,
  GetThoughtTalkRoomMessagesQuery,
  CustomErrorResponseCode,
  useGetThoughtTalkRoomsLazyQuery,
} from "src/generated/graphql";
import { IMessage } from "react-native-gifted-chat";
import { BaseChat } from "src/components/BaseChat";
import { NO_USER_IMAGE_URL } from "src/constants";
import { createRandomStr } from "src/utils";
import { useThoughtTalkRoomReadFragment } from "src/hooks/thoughtTalkRoom";
import { logJson, getGraphQLError } from "src/utils";
import { btoa } from "react-native-quick-base64";
import { UserImages, TRANSLATE_IMAGE_X } from "src/components/UserImages";
import { Pressable } from "native-base";
import { HeaderBackButton } from "@react-navigation/elements";
import { Indicator } from "src/components/Indicator";
import { Alert } from "react-native";
import { DotsHorizontal } from "src/components/DotsHorizontal";
import { Menu } from "./Menu";

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
  const [getThougtTalkRoomsQuery] = useGetThoughtTalkRoomsLazyQuery({
    fetchPolicy: "network-only",
  });
  const fragmentCacheData = useThoughtTalkRoomReadFragment({ id });
  const { data: talkRoomData, fetchMore } = useGetThoughtTalkRoomQuery({
    variables: {
      id,
    },
    // fetchPolicy: "network-only",
    // nextFetchPolicy: "cache-first",
  });

  const [modalVisible, setModalVisible] = useState(false);

  const renderHeaderTitle = useCallback(() => {
    if (!talkRoomData) {
      return <Indicator />;
    }

    const urls = talkRoomData.thoughtTalkRoom.members.edges
      .slice(0, 7)
      .map((edge) => edge.node.user.imageUrl);

    return (
      <Pressable
        onPress={() => {
          navigation.navigate("TalkRoomMembers", {
            talkRoomId: id,
          });
        }}
      >
        <UserImages
          data={urls}
          imageSize="6"
          style={{
            transform: [
              { translateX: (urls.length - 1) * (TRANSLATE_IMAGE_X / 2) },
            ],
          }}
        />
      </Pressable>
    );
  }, [talkRoomData]);

  const renderHeaderRight = useCallback(() => {
    if (!talkRoomData) {
      return null;
    }

    const isMyShareData =
      talkRoomData.thoughtTalkRoom.thought.contributor.id === me.id;

    if (!isMyShareData) {
      return null;
    }

    return <DotsHorizontal onPress={() => setModalVisible(true)} />;
  }, [talkRoomData, me]);

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
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderTitle, renderHeaderRight]);

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
      const error = getGraphQLError(e, 0);

      if (error?.code === CustomErrorResponseCode.InvalidRequest) {
        Alert.alert(error.message, "", [
          {
            text: "OK",
            onPress: async () => {
              await getThougtTalkRoomsQuery();
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
    <>
      <BaseChat
        messages={messages}
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
      />
    </>
  );
};
