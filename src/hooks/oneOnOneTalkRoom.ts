import {
  useGetOneOnOneTalkRoomsQuery,
  OnOneOnOneTalkRoomMessageCreatedSubscription,
  OnOneOnOneTalkRoomMessageCreatedSubscriptionVariables,
  OnOneOnOneTalkRoomMessageCreatedDocument,
  useGetOneOnOneTalkRoomLazyQuery,
  GetOneOnOneTalkRoomsQuery,
  GetOneOnOneTalkRoomsDocument,
} from 'src/generated/graphql';
import { meVar } from 'src/stores/me';
import { useReactiveVar, useApolloClient } from '@apollo/client';
import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useOneOnOneTalkRoomsWithSubscription = () => {
  const myId = useReactiveVar(meVar.id);

  const { cache } = useApolloClient();

  const { subscribeToMore } = useGetOneOnOneTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const [getOneOnOneTalkRoomQuery] = useGetOneOnOneTalkRoomLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [isActive, setIsActive] = useState(true);

  const [newTalkRoomId, setNewTalkRoomId] = useState<null | number>(null);

  useEffect(() => {
    const onChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
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

  // サブスクライブ
  useEffect(() => {
    if (isActive && myId) {
      console.log('😆　subsucribe for OneOnOneTalkRooms');

      const unsubscribe = subscribeToMore<
        OnOneOnOneTalkRoomMessageCreatedSubscription,
        OnOneOnOneTalkRoomMessageCreatedSubscriptionVariables
      >({
        document: OnOneOnOneTalkRoomMessageCreatedDocument,
        variables: { userId: myId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) {
            return prev;
          }

          const currentRooms = prev.oneOnOneTalkRooms;

          const targetTalkRoomId =
            subscriptionData.data.oneOnOneTalkRoomMessageCreated.roomId;

          const targetRoom = currentRooms.find(
            (room) => room.id === targetTalkRoomId
          );

          if (!targetRoom) {
            setNewTalkRoomId(
              subscriptionData.data.oneOnOneTalkRoomMessageCreated.roomId
            );
            return prev;
          }

          const newMessageEdge = {
            node: subscriptionData.data.oneOnOneTalkRoomMessageCreated,
            cursor:
              subscriptionData.data.oneOnOneTalkRoomMessageCreated.id.toString(),
          };

          const newMessagesConnection = {
            ...targetRoom.messages,
            edges: [newMessageEdge, ...targetRoom.messages.edges],
            pageInfo: {
              ...targetRoom.messages.pageInfo,
              startCursor: newMessageEdge.node.id.toString(),
            },
          };

          const isMySentData =
            subscriptionData.data.oneOnOneTalkRoomMessageCreated.sender.id ===
            myId;

          const newRoomData = {
            ...targetRoom,
            allMessageSeen: isMySentData,
            messages: newMessagesConnection,
          };

          const filteredRooms = currentRooms.filter(
            (room) => room.id !== targetRoom.id
          );

          const newTalkRoomList = [newRoomData, ...filteredRooms];

          return {
            oneOnOneTalkRooms: newTalkRoomList,
          };
        },
      });

      return () => {
        if (unsubscribe) {
          console.log('案サブスク OneOnOneTalkRooms');
          unsubscribe();
        }
      };
    }
  }, [isActive, myId, subscribeToMore, setNewTalkRoomId]);

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
  }, [newTalkRoomId, cache]);
};

export const useFindOneOnOneTalkRoomFromUserId = () => {
  const { cache } = useApolloClient();

  const findOneOnOneTalkRoom = useCallback(({ userId }: { userId: string }) => {
    const queryResult = cache.readQuery<GetOneOnOneTalkRoomsQuery>({
      query: GetOneOnOneTalkRoomsDocument,
    });

    if (queryResult) {
      const targetRoom = queryResult.oneOnOneTalkRooms.find(
        (room) => room.sender.id === userId || room.recipient.id === userId
      );

      return targetRoom;
    }
  }, []);

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
