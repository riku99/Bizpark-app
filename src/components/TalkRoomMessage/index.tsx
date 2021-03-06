import { useApolloClient } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { IMessage } from 'react-native-gifted-chat';
import { btoa } from 'react-native-quick-base64';
import { BaseChat } from 'src/components/BaseChat';
import { NO_USER_IMAGE_URL } from 'src/constants';
import {
  CreateNewsTalkRoomMessageMutationFn,
  CreateOneOnOneTalkRoomMessageMutationFn,
  CreateThoughtTalkRoomMessageMutationFn,
  CreateUserNewsTalkRoomMessageSeenMutationFn,
  CreateUserThoughtTalkRoomMessageSeenMutationFn,
  GetNewsTalkRoomMessagesQuery,
  GetNewsTalkRoomMessagesQueryResult,
  GetNewsTalkRoomsDocument,
  GetNewsTalkRoomsQueryResult,
  GetOneOnOneTalkRoomMessagesQuery,
  GetOneOnOneTalkRoomMessagesQueryResult,
  GetOneOnOneTalkRoomsDocument,
  GetOneOnOneTalkRoomsQueryResult,
  GetThoughtTalkRoomMessagesQuery,
  GetThoughtTalkRoomMessagesQueryResult,
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQueryResult,
  MessageSendError,
  NewsTalkRoomMessage,
  NewsTalkRoomMessageEdge,
  OneOnOneTalkRoomMessage,
  OneOnOneTalkRoomMessageEdge,
  PageInfo,
  SeenOneOnOneTalkRoomMessageMutationFn,
  ThoughtTalkRoomMessage,
  ThoughtTalkRoomMessageEdge,
} from 'src/generated/graphql';
import { useMyId, useMyImageUrl, useMyName } from 'src/hooks/me';
import { RootNavigationProp } from 'src/types';
import { createRandomStr, getGraphQLError } from 'src/utils';

type Props =
  | {
      type: 'Thought';
      roomId: number;
      messageData: GetThoughtTalkRoomMessagesQueryResult['data'];
      messageFetchMore: GetThoughtTalkRoomMessagesQueryResult['fetchMore'];
      createMessage: CreateThoughtTalkRoomMessageMutationFn;
      createSeen: CreateUserThoughtTalkRoomMessageSeenMutationFn;
      deleteTalkRoomFromCache: ({ talkRoomId }: { talkRoomId: number }) => void;
      talkRoomsData: GetThoughtTalkRoomsQueryResult['data'];
    }
  | {
      type: 'News';
      roomId: number;
      messageData: GetNewsTalkRoomMessagesQueryResult['data'];
      messageFetchMore: GetNewsTalkRoomMessagesQueryResult['fetchMore'];
      createMessage: CreateNewsTalkRoomMessageMutationFn;
      createSeen: CreateUserNewsTalkRoomMessageSeenMutationFn;
      deleteTalkRoomFromCache: ({ talkRoomId }: { talkRoomId: number }) => void;
      talkRoomsData: GetNewsTalkRoomsQueryResult['data'];
    }
  | {
      type: 'OneOnOne';
      roomId: number;
      messageData: GetOneOnOneTalkRoomMessagesQueryResult['data'];
      messageFetchMore: GetOneOnOneTalkRoomMessagesQueryResult['fetchMore'];
      createMessage: CreateOneOnOneTalkRoomMessageMutationFn;
      createSeen: SeenOneOnOneTalkRoomMessageMutationFn;
      deleteTalkRoomFromCache: ({ talkRoomId }: { talkRoomId: number }) => void;
      talkRoomsData: GetOneOnOneTalkRoomsQueryResult['data'];
    };

const isTmp = (str: string) => str.slice(0, 3) === 'tmp';

export const TalkRoomMessage = React.memo((props: Props) => {
  const { roomId } = props;

  const navigation = useNavigation<RootNavigationProp<'ThoughtTalkRoom'>>();

  const myId = useMyId();
  const myName = useMyName();
  const myImageUrl = useMyImageUrl();
  const { cache } = useApolloClient();

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
        // ????????????????????????????????????Active??????????????????????????????PageInfo????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        if (Number(newPageInfo.endCursor) < Number(currentInfo.endCursor)) {
          return newPageInfo;
        } else {
          return currentInfo;
        }
      });
    }
  }, [props.messageData, props.type]);

  // ?????????????????????????????????????????????
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [latestMessage, setLatestMessage] = useState<IMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  useEffect(() => {
    if (messages.length && !isTmp(messages[0]._id.toString() as string)) {
      setLatestMessage(messages[0]);
    }
  }, [messages]);

  // ?????????????????????????????????????????????????????????????????????
  const createNewIMessage = <
    T extends
      | ThoughtTalkRoomMessage
      | NewsTalkRoomMessage
      | OneOnOneTalkRoomMessage
  >(
    message: T
  ): IMessage => {
    const { replyMessage: _replyMessage } = message;

    const creaetdAt = new Date(Number(message.createdAt));

    return {
      _id: message.id,
      text: message.text,
      createdAt: creaetdAt,
      user: {
        _id: message.sender?.id,
        name: message.sender?.name,
        avatar: message.sender?.imageUrl ?? NO_USER_IMAGE_URL,
      },
      replyMessage: _replyMessage
        ? {
            id: Number(_replyMessage.id),
            text: _replyMessage.text,
            user: {
              id: _replyMessage.sender?.id,
              name: _replyMessage.sender?.name,
            },
          }
        : null,
    };
  };

  // ???????????????????????????????????????????????????????????????
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

  // Subscription???Active?????????????????????????????????????????????????????????????????????
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

        // ???????????????????????????????????????????????????????????????????????????
        if (firstMessage.sender?.id === myId) {
          return;
        }

        setMessages((currentData) => {
          // fetchMore?????????????????????????????????????????????Effect????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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

  // ???????????????
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
          // ??????????????????????????????????????????
          console.log(e);
        }
      }
    })();
  }, [latestMessage, myId, props, roomId]);

  // ?????????????????????
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
              onCompleted: (result) => {
                if (!result.createThoughtTalkRoomMessage) {
                  return;
                }

                const currentRooms = props.talkRoomsData.thoughtTalkRooms;
                const targetRoom = currentRooms.find((r) => r.id === roomId);

                if (!targetRoom) {
                  return;
                }

                const newMessageEdge = {
                  node: result.createThoughtTalkRoomMessage,
                  cursor: result.createThoughtTalkRoomMessage.id.toString(),
                };

                const newMessageConnection = {
                  ...targetRoom.messages,
                  edges: [newMessageEdge, ...targetRoom.messages.edges],
                  pageInfo: {
                    ...targetRoom.messages.pageInfo,
                    startCursor: newMessageEdge.node.id.toString(),
                  },
                };

                const newRoomData = {
                  ...targetRoom,
                  allMessageSeen: true,
                  messages: newMessageConnection,
                };

                const filteredRooms = currentRooms.filter(
                  (r) => r.id !== roomId
                );

                const newTalkRoomList = [newRoomData, ...filteredRooms];

                cache.writeQuery({
                  query: GetThoughtTalkRoomsDocument,
                  data: {
                    thoughtTalkRooms: newTalkRoomList,
                  },
                });
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
              onCompleted: (result) => {
                if (!result.createNewsTalkRoomMessage) {
                  return;
                }

                const currentRooms = props.talkRoomsData.newsTalkRooms;
                const targetRoom = currentRooms.find((r) => r.id === roomId);

                if (!targetRoom) {
                  return;
                }

                const newMessageEdge = {
                  node: result.createNewsTalkRoomMessage,
                  cursor: result.createNewsTalkRoomMessage.id.toString(),
                };

                const newMessageConnection = {
                  ...targetRoom.messages,
                  edges: [newMessageEdge, ...targetRoom.messages.edges],
                  pageInfo: {
                    ...targetRoom.messages.pageInfo,
                    startCursor: newMessageEdge.node.id.toString(),
                  },
                };

                const newRoomData = {
                  ...targetRoom,
                  allMessageSeen: true,
                  messages: newMessageConnection,
                };

                const filteredRooms = currentRooms.filter(
                  (r) => r.id !== roomId
                );

                const newTalkRoomList = [newRoomData, ...filteredRooms];

                cache.writeQuery({
                  query: GetNewsTalkRoomsDocument,
                  data: {
                    newsTalkRooms: newTalkRoomList,
                  },
                });
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
              onCompleted: (result) => {
                if (!result.createOneOnOneTalkRoomMessage) {
                  return;
                }

                const currentRooms = props.talkRoomsData.oneOnOneTalkRooms;
                const targetRoom = currentRooms.find((r) => r.id === roomId);

                if (!targetRoom) {
                  return;
                }

                const newMessageEdge = {
                  node: result.createOneOnOneTalkRoomMessage,
                  cursor: result.createOneOnOneTalkRoomMessage.id.toString(),
                };

                const newMessageConnection = {
                  ...targetRoom.messages,
                  edges: [newMessageEdge, ...targetRoom.messages.edges],
                  pageInfo: {
                    ...targetRoom.messages.pageInfo,
                    startCursor: newMessageEdge.node.id.toString(),
                  },
                };

                const newRoomData = {
                  ...targetRoom,
                  allMessageSeen: true,
                  messages: newMessageConnection,
                };

                const filteredRooms = currentRooms.filter(
                  (r) => r.id !== roomId
                );

                const newTalkRoomList = [newRoomData, ...filteredRooms];

                cache.writeQuery({
                  query: GetOneOnOneTalkRoomsDocument,
                  data: {
                    oneOnOneTalkRooms: newTalkRoomList,
                  },
                });
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

      // ?????????????????????????????????????????? or ?????????????????????????????????????????????????????????????????????????????????????????????
      if (
        error?.code === MessageSendError.NotFound ||
        MessageSendError.BlockingOrBlocked
      ) {
        Alert.alert('??????????????????????????????????????????', '', [
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
        if (user._id) {
          navigation.navigate('UserProfile', {
            id: user._id.toString(),
          });
        }
      }}
    />
  );
});
