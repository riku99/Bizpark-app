import {
  useGetOneOnOneTalkRoomsQuery,
  useGetOneOnOneTalkRoomLazyQuery,
  GetOneOnOneTalkRoomsQuery,
  GetOneOnOneTalkRoomsDocument,
  useGetOneOnOneTalkRoomMessageQuery,
} from 'src/generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useMyId } from 'src/hooks/me';
import firestore from '@react-native-firebase/firestore';

export const useOneOnOneTalkRoomsWithSubscription = () => {
  const myId = useMyId();
  const { cache } = useApolloClient();
  const isOnActive = useRef(true);

  const { data: talkRoomData } = useGetOneOnOneTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const [getOneOnOneTalkRoomQuery] = useGetOneOnOneTalkRoomLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [isActive, setIsActive] = useState(true);
  const [newTalkRoomId, setNewTalkRoomId] = useState<null | number>(null);
  const [subscribeMessageId, setSubscribeMessageId] = useState<number | null>(
    null
  );

  useGetOneOnOneTalkRoomMessageQuery({
    skip: subscribeMessageId == null,
    variables: {
      id: subscribeMessageId,
    },
    onCompleted: (queryData) => {
      setSubscribeMessageId(null);

      if (!queryData?.oneOnOneTalkRoomMessage) {
        return;
      }

      const currntRooms = talkRoomData.oneOnOneTalkRooms;

      const targetRoomId = queryData.oneOnOneTalkRoomMessage.roomId;

      const targetRoom = currntRooms.find((r) => r.id === targetRoomId);

      if (!targetRoom) {
        setNewTalkRoomId(targetRoomId);
        return;
      }

      if (
        targetRoom.messages.edges[0]?.node.id ===
        queryData.oneOnOneTalkRoomMessage.id
      ) {
        return;
      }

      const newMessageEdge = {
        node: queryData.oneOnOneTalkRoomMessage,
        cursor: queryData.oneOnOneTalkRoomMessage.id.toString(),
      };

      const newMessageConnection = {
        ...targetRoom.messages,
        edges: [newMessageEdge, ...targetRoom.messages.edges],
        pageInfo: {
          ...targetRoom.messages.pageInfo,
          startCursor: newMessageEdge.node.id.toString(),
        },
      };

      const isMySentData = queryData.oneOnOneTalkRoomMessage.sender.id === myId;

      const newRoomData = {
        ...targetRoom,
        allMessageSeen: isMySentData,
        messages: newMessageConnection,
      };

      const filteredRooms = currntRooms.filter(
        (room) => room.id !== targetRoom.id
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

  useEffect(() => {
    const onChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        isOnActive.current = true;
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    AppState.addEventListener('change', onChange);

    return () => {
      AppState.removeEventListener('change', onChange);
    };
  }, [setIsActive]);

  useEffect(() => {
    if (isActive && myId) {
      const unsubscribe = firestore()
        .collection('oneOnOneTalkRoomMessages')
        .where('members', 'array-contains', myId)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .onSnapshot((querySnapshot) => {
          if (isOnActive.current) {
            isOnActive.current = false;
          } else {
            if (querySnapshot && querySnapshot.docs.length) {
              setSubscribeMessageId(Number(querySnapshot.docs[0].id));
            }
          }
        });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [isActive, myId, setSubscribeMessageId]);

  //最初のメッセージ(まだトークルームを持っていない)メッセージが送られて来た場合はそのトークルームをフェッチ。cacheに手動で追加
  useEffect(() => {
    if (newTalkRoomId) {
      (async function () {
        setNewTalkRoomId(null);

        const { data } = await getOneOnOneTalkRoomQuery({
          variables: {
            id: newTalkRoomId,
          },
        });

        if (data) {
          const currentQueryData = cache.readQuery<GetOneOnOneTalkRoomsQuery>({
            query: GetOneOnOneTalkRoomsDocument,
          });

          if (currentQueryData) {
            const newTalkRooms = [
              data.oneOnOneTalkRoom,
              ...currentQueryData.oneOnOneTalkRooms,
            ];

            cache.writeQuery({
              query: GetOneOnOneTalkRoomsDocument,
              data: { oneOnOneTalkRooms: newTalkRooms },
            });
          }
        }
      })();
    }
  }, [newTalkRoomId, cache, getOneOnOneTalkRoomQuery]);
};

export const useFindOneOnOneTalkRoomFromUserId = () => {
  const { cache } = useApolloClient();

  const findOneOnOneTalkRoom = useCallback(
    ({ userId }: { userId: string }) => {
      const queryResult = cache.readQuery<GetOneOnOneTalkRoomsQuery>({
        query: GetOneOnOneTalkRoomsDocument,
      });

      if (queryResult) {
        const targetRoom = queryResult.oneOnOneTalkRooms.find(
          (room) => room.sender.id === userId || room.recipient.id === userId
        );

        return targetRoom;
      }
    },
    [cache]
  );

  return {
    findOneOnOneTalkRoom,
  };
};

export const useFindOneOnOneTalkRoom = () => {
  const { cache } = useApolloClient();

  const findOneOnOneTalkRoom = useCallback(
    ({ talkRoomId }: { talkRoomId: number }) => {
      const queryResult = cache.readQuery<GetOneOnOneTalkRoomsQuery>({
        query: GetOneOnOneTalkRoomsDocument,
      });

      if (queryResult) {
        const targetRoom = queryResult.oneOnOneTalkRooms.find(
          (room) => room.id === talkRoomId
        );

        return targetRoom;
      }
    },
    [cache]
  );

  return {
    findOneOnOneTalkRoom,
  };
};

export const useDeleteOneOnOneTalkRoomFromCache = () => {
  const { cache } = useApolloClient();

  const deleteOneOnOneTalkRoomFromCache = useCallback(
    ({ talkRoomId }: { talkRoomId: number }) => {
      const queryResult = cache.readQuery<GetOneOnOneTalkRoomsQuery>({
        query: GetOneOnOneTalkRoomsDocument,
      });

      if (queryResult) {
        const filteredData = queryResult.oneOnOneTalkRooms.filter(
          (room) => room.id !== talkRoomId
        );

        cache.writeQuery({
          query: GetOneOnOneTalkRoomsDocument,
          data: { oneOnOneTalkRooms: filteredData },
        });
      }
    },
    [cache]
  );

  return {
    deleteOneOnOneTalkRoomFromCache,
  };
};
