import React, { useEffect, useState } from 'react';
import {
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
  CreateUserNewsTalkRoomMessageSeenMutationFn,
  GetOneOnOneTalkRoomMessagesQueryResult,
  SeenOneOnOneTalkRoomMessageMutationFn,
  OneOnOneTalkRoomMessageEdge,
  OneOnOneTalkRoomMessage,
  CreateOneOnOneTalkRoomMessageMutationFn,
  GetOneOnOneTalkRoomMessagesQuery,
} from 'src/generated/graphql';
import { IMessage } from 'react-native-gifted-chat';
import { BaseChat } from 'src/components/BaseChat';
import { NO_USER_IMAGE_URL } from 'src/constants';
import { createRandomStr } from 'src/utils';
import { getGraphQLError } from 'src/utils';
import { btoa } from 'react-native-quick-base64';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'src/types';
import { useMyId, useMyName, useMyImageUrl } from 'src/hooks/me';

type Props =
  | {
      type: 'Thought';
      roomId: number;
      messageData: GetThoughtTalkRoomMessagesQueryResult['data'];
      messageFetchMore: GetThoughtTalkRoomMessagesQueryResult['fetchMore'];
      createMessage: CreateThoughtTalkRoomMessageMutationFn;
      createSeen: CreateUserThoughtTalkRoomMessageSeenMutationFn;
      deleteTalkRoomFromCache: ({ talkRoomId }: { talkRoomId: number }) => void;
    }
  | {
      type: 'News';
      roomId: number;
      messageData: GetNewsTalkRoomMessagesQueryResult['data'];
      messageFetchMore: GetNewsTalkRoomMessagesQueryResult['fetchMore'];
      createMessage: CreateNewsTalkRoomMessageMutationFn;
      createSeen: CreateUserNewsTalkRoomMessageSeenMutationFn;
      deleteTalkRoomFromCache: ({ talkRoomId }: { talkRoomId: number }) => void;
    }
  | {
      type: 'OneOnOne';
      roomId: number;
      messageData: GetOneOnOneTalkRoomMessagesQueryResult['data'];
      messageFetchMore: GetOneOnOneTalkRoomMessagesQueryResult['fetchMore'];
      createMessage: CreateOneOnOneTalkRoomMessageMutationFn;
      createSeen: SeenOneOnOneTalkRoomMessageMutationFn;
      deleteTalkRoomFromCache: ({ talkRoomId }: { talkRoomId: number }) => void;
    };

const isTmp = (str: string) => str.slice(0, 3) === 'tmp';

export const TalkRoomMessage = React.memo((props: Props) => {
  const { roomId } = props;

  const navigation = useNavigation<RootNavigationProp<'ThoughtTalkRoom'>>();

  const myId = useMyId();
  const myName = useMyName();
  const myImageUrl = useMyImageUrl();

  const [pageInfo, setPageInfo] = useState<PageInfo>(() => {
    switch (props.type) {
      case 'Thought':
        return props.messageData?.thoughtTalkRoom.messages.pageInfo;
      case 'News':
        return props.messageData?.newsTalkRoom.messages.pageInfo;
      case 'OneOnOne':
        return props.messageData?.oneOnOneTalkRoom.messages.pageInfo;
    }
  });

  useEffect(() => {
    if (props.messageData) {
      let newPageInfo: PageInfo;

      switch (props.type) {
        case 'Thought':
          newPageInfo = props.messageData.thoughtTalkRoom.messages.pageInfo;
          break;
        case 'News':
          newPageInfo = props.messageData.newsTalkRoom.messages.pageInfo;
          break;
        case 'OneOnOne':
          newPageInfo = props.messageData.oneOnOneTalkRoom.messages.pageInfo;
      }

      setPageInfo((currentInfo) => {
        // トークルームを開いたままActiveになるとキャッシュのPageInfoも更新される。その更新されたものを使用すると無限ローディングでダブるのでチェック
        if (Number(newPageInfo.endCursor) < Number(currentInfo.endCursor)) {
          return newPageInfo;
        } else {
          return currentInfo;
        }
      });
    }
  }, [props.messageData, props.type]);

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
    T extends
      | ThoughtTalkRoomMessage
      | NewsTalkRoomMessage
      | OneOnOneTalkRoomMessage
  >(
    message: T
  ): IMessage => {
    const { replyMessage: _replyMessage } = message;

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
            id: Number(_replyMessage.id),
            text: _replyMessage.text,
            user: {
              id: _replyMessage.sender.id,
              name: _replyMessage.sender.name,
            },
          }
        : null,
    };
  };

  // 初回キャッシュのデータからのみここでセット
  useEffect(() => {
    if (props.messageData) {
      let edges: (
        | ThoughtTalkRoomMessageEdge
        | NewsTalkRoomMessageEdge
        | OneOnOneTalkRoomMessageEdge
      )[];

      switch (props.type) {
        case 'Thought':
          edges = props.messageData.thoughtTalkRoom.messages.edges;
          break;
        case 'News':
          edges = props.messageData.newsTalkRoom.messages.edges;
          break;
        case 'OneOnOne':
          edges = props.messageData.oneOnOneTalkRoom.messages.edges;
      }

      const im: IMessage[] = edges.map((edge: typeof edges[number]) =>
        createNewIMessage(edge.node)
      );

      setMessages(im);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // SubscriptionやActive時のデータの取得で新たに取得したメッセージ追加
  useEffect(() => {
    if (props.messageData) {
      let messageEdges: (
        | ThoughtTalkRoomMessageEdge
        | NewsTalkRoomMessageEdge
        | OneOnOneTalkRoomMessageEdge
      )[];

      switch (props.type) {
        case 'Thought':
          messageEdges = props.messageData.thoughtTalkRoom.messages.edges;
          break;
        case 'News':
          messageEdges = props.messageData.newsTalkRoom.messages.edges;
          break;
        case 'OneOnOne':
          messageEdges = props.messageData.oneOnOneTalkRoom.messages.edges;
      }

      if (messageEdges.length) {
        const firstMessage = messageEdges[0].node;

        // 自分で送信したメッセージのサブスクライブは無視する
        if (firstMessage.sender.id === myId) {
          return;
        }

        setMessages((currentData) => {
          // fetchMoreとかでキャッシュ更新するとこのEffectも呼ばれる。ただ、新しいメッセージを作成する必要はないので現在のデータをリターン
          if (currentData.length && currentData[0]._id === firstMessage.id) {
            return currentData;
          }

          const newMessageData: IMessage[] = [];

          for (const messageEdge of messageEdges) {
            if (
              !currentData.length ||
              messageEdge.node.id !== Number(currentData[0]._id)
            ) {
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
  }, [props.messageData, setMessages, myId, props.type]); // eslint-disable-line react-hooks/exhaustive-deps

  // 既読の作成
  useEffect(() => {
    (async function () {
      if (latestMessage && latestMessage.user._id !== myId) {
        try {
          switch (props.type) {
            case 'Thought':
              await props.createSeen({
                variables: {
                  input: {
                    messageId: Number(latestMessage._id),
                    roomId,
                  },
                },
              });
              break;

            case 'News':
              await props.createSeen({
                variables: {
                  input: {
                    messageId: Number(latestMessage._id),
                    talkRoomId: roomId,
                  },
                },
              });
              break;

            case 'OneOnOne':
              await props.createSeen({
                variables: {
                  input: {
                    messageId: Number(latestMessage._id),
                    talkRoomId: roomId,
                  },
                },
              });
              break;

            default:
              break;
          }
        } catch (e) {
          // 既読作成時のエラー無視でいい
          console.log(e);
        }
      }
    })();
  }, [latestMessage, myId, props, roomId]);

  // メッセージ送信
  const onSendPress = async (inputMessages: IMessage[]) => {
    const newMessageData = inputMessages[0];

    const tempId = 'tmp' + createRandomStr();

    setReplyMessage(null);

    setMessages((currentData) => {
      const { text, createdAt } = newMessageData;
      const newTempIMessageData: IMessage = {
        _id: tempId,
        text,
        createdAt: new Date(Number(createdAt)),
        user: {
          _id: myId,
          name: myName,
          avatar: myImageUrl ?? NO_USER_IMAGE_URL,
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
      let newIMessageData: IMessage;

      const text = inputMessages[0].text;
      const replyTo = replyMessage ? Number(replyMessage._id) : null;

      switch (props.type) {
        case 'Thought':
          const { data: createdThoughtTalkRoomMessageData } =
            await props.createMessage({
              variables: {
                input: {
                  text,
                  roomId,
                  replyTo,
                },
              },
            });

          if (createdThoughtTalkRoomMessageData) {
            newIMessageData = createNewIMessage(
              createdThoughtTalkRoomMessageData.createThoughtTalkRoomMessage
            );
          }
          break;

        case 'News':
          const { data: createdNewsTalkRoomMessageData } =
            await props.createMessage({
              variables: {
                input: {
                  text,
                  talkRoomId: roomId,
                  replyTo,
                },
              },
            });

          if (createdNewsTalkRoomMessageData) {
            newIMessageData = createNewIMessage(
              createdNewsTalkRoomMessageData.createNewsTalkRoomMessage
            );
          }
          break;

        case 'OneOnOne':
          const { data: createdOneOnOneTalkRoomData } =
            await props.createMessage({
              variables: {
                input: {
                  text,
                  talkRoomId: roomId,
                  replyTo,
                },
              },
            });

          if (createdOneOnOneTalkRoomData) {
            newIMessageData = createNewIMessage(
              createdOneOnOneTalkRoomData.createOneOnOneTalkRoomMessage
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
        Alert.alert(error.message, '', [
          {
            text: 'OK',
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
          T extends
            | ThoughtTalkRoomMessageEdge
            | NewsTalkRoomMessageEdge
            | OneOnOneTalkRoomMessageEdge
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

        const messageCursor = endCursor ? btoa(endCursor) : null;

        if (props.type === 'Thought') {
          const { data } = await props.messageFetchMore<
            GetThoughtTalkRoomMessagesQuery,
            { messageCursor: string }
          >({
            variables: {
              messageCursor,
            },
          });

          const messageEdges = data.thoughtTalkRoom.messages.edges;

          if (messageEdges) {
            setNewMessages(messageEdges);
          }
        }

        if (props.type === 'News') {
          const { data } = await props.messageFetchMore<
            GetNewsTalkRoomMessagesQuery,
            { messageCursor: string }
          >({
            variables: {
              messageCursor,
            },
          });

          const messageEdges = data.newsTalkRoom.messages.edges;

          if (messageEdges) {
            setNewMessages(messageEdges);
          }
        }

        if (props.type === 'OneOnOne') {
          const { data } = await props.messageFetchMore<
            GetOneOnOneTalkRoomMessagesQuery,
            { after: string }
          >({
            variables: {
              after: messageCursor,
            },
          });

          const messageEdges = data.oneOnOneTalkRoom.messages.edges;

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
        _id: myId,
      }}
      onSend={onSendPress}
      infiniteLoad={infiniteLoad}
      onPressAvatar={(user) => {
        navigation.navigate('UserProfile', {
          id: user._id.toString(),
        });
      }}
    />
  );
});
