import {
  OnThoughtTalkRoomMessageCreatedDocument,
  OnThoughtTalkRoomMessageCreatedSubscription,
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQuery,
  OnThoughtTalkRoomMessageCreatedSubscriptionVariables,
  useGetThoughtTalkRoomsQuery,
  useGetThoughtTalkRoomLazyQuery,
} from 'src/generated/graphql';
import { useEffect, useCallback, useMemo, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { AppState, AppStateStatus } from 'react-native';
import { useMyId, useLoggedIn } from 'src/hooks/me';

export const useToughtTalkRoomsWithSubsciption = () => {
  const { loggedIn } = useLoggedIn();

  const myId = useMyId();

  const { cache } = useApolloClient();

  const { data: talkRoomsData, subscribeToMore } = useGetThoughtTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const [isActive, setIsActive] = useState(true);

  const subscriptionVariables = useMemo(() => {
    if (!talkRoomsData?.thoughtTalkRooms.length) {
      return [];
    }

    return talkRoomsData.thoughtTalkRooms.map((t) => t.id);
  }, [talkRoomsData?.thoughtTalkRooms.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Active時、非アクティブ時の処理
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

  const [getThougtTalkRoomQuery] = useGetThoughtTalkRoomLazyQuery();

  const [newTalkRoomId, setNewTalkRoomId] = useState<number | null>(null);

  useEffect(() => {
    if (isActive && myId) {
      console.log('⚡️ subscribe for ThoughtTalkRooms');

      const _unsubscribe = subscribeToMore<
        OnThoughtTalkRoomMessageCreatedSubscription,
        OnThoughtTalkRoomMessageCreatedSubscriptionVariables
      >({
        document: OnThoughtTalkRoomMessageCreatedDocument,
        variables: { roomIds: subscriptionVariables, userId: myId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) {
            return prev;
          }

          const roomId =
            subscriptionData.data.thoughtTalkRoomMessageCreated.roomId;
          const rooms = prev.thoughtTalkRooms;
          const targetRoom = rooms.find((r) => r.id === roomId);
          const { contributor } =
            subscriptionData.data.thoughtTalkRoomMessageCreated.talkRoom
              .thought;

          if (!targetRoom) {
            if (contributor.id === myId) {
              setNewTalkRoomId(
                subscriptionData.data.thoughtTalkRoomMessageCreated.roomId
              );
              return;
            } else {
              return prev;
            }
          }

          const newEdge = {
            node: subscriptionData.data.thoughtTalkRoomMessageCreated,
            cursor:
              subscriptionData.data.thoughtTalkRoomMessageCreated.id.toString(),
          };

          const newConnection = {
            ...targetRoom.messages,
            edges: [newEdge, ...targetRoom.messages.edges],
            pageInfo: {
              ...targetRoom.messages.pageInfo,
              startCursor: newEdge.node.id.toString(),
            },
          };

          const isMySentData =
            subscriptionData.data.thoughtTalkRoomMessageCreated.sender.id ===
            myId;

          const newRoomData = {
            ...targetRoom,
            allMessageSeen: isMySentData,
            messages: newConnection,
          };

          const filtered = rooms.filter((r) => r.id !== roomId);
          const newTalkListData = [newRoomData, ...filtered];

          return {
            thoughtTalkRooms: newTalkListData,
          };
        },
      });

      // isActiveの変更によってここも実行される
      return () => {
        if (_unsubscribe) {
          console.log('案サブスク');
          _unsubscribe();
        }
      };
    }
  }, [isActive, myId, subscriptionVariables, subscribeToMore]);

  useEffect(() => {
    if (newTalkRoomId) {
      (async function () {
        setNewTalkRoomId(null);

        const { data } = await getThougtTalkRoomQuery({
          variables: {
            id: newTalkRoomId,
          },
        });

        if (data) {
          const currentQueryData = cache.readQuery<GetThoughtTalkRoomsQuery>({
            query: GetThoughtTalkRoomsDocument,
          });

          if (currentQueryData) {
            const newTalkRooms = [
              data.thoughtTalkRoom,
              ...currentQueryData.thoughtTalkRooms,
            ];

            cache.writeQuery({
              query: GetThoughtTalkRoomsDocument,
              data: { thoughtTalkRooms: newTalkRooms },
            });
          }
        }
      })();
    }
  }, [newTalkRoomId, cache, getThougtTalkRoomQuery]);
};

export const useFindThoughtTalkRoom = () => {
  const { data } = useGetThoughtTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const findThoughtTalkRoom = useCallback(
    ({ id }: { id: number }) => {
      if (!data.thoughtTalkRooms) {
        return null;
      }

      return data.thoughtTalkRooms.find((room) => room.id === id);
    },
    [data]
  );

  return {
    findThoughtTalkRoom,
  };
};

export const useFindThoughtTalkRoomsByThoughtId = ({
  thoughtId,
}: {
  thoughtId: string;
}) => {
  const client = useApolloClient();

  const result = client.cache.readQuery<GetThoughtTalkRoomsQuery>({
    query: GetThoughtTalkRoomsDocument,
  });

  if (result) {
    const targetData = result.thoughtTalkRooms.find(
      (t) => t.thought.id === thoughtId
    );

    return targetData;
  }
};

// ThougtTalkRoomsから特定のアイテムを消す
export const useDeleteThoughtTalkRoomsItemFromCache = () => {
  const { cache } = useApolloClient();

  const deleteThoghtTalkRoom = useCallback(
    ({ talkRoomId }: { talkRoomId: number }) => {
      const queryResult = cache.readQuery<GetThoughtTalkRoomsQuery>({
        query: GetThoughtTalkRoomsDocument,
      });

      if (queryResult) {
        const filteredData = queryResult.thoughtTalkRooms.filter(
          (t) => t.id !== talkRoomId
        );
        cache.writeQuery({
          query: GetThoughtTalkRoomsDocument,
          data: { thoughtTalkRooms: filteredData },
        });
      }
    },
    [cache]
  );

  return {
    deleteThoghtTalkRoom,
  };
};
