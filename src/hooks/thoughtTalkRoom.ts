import {
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQuery,
  useGetThoughtTalkRoomsQuery,
  useGetThoughtTalkRoomLazyQuery,
  useGetThoughtTalkRoomMessageQuery,
} from 'src/generated/graphql';
import { useEffect, useCallback, useState, useRef } from 'react';
import { useApolloClient } from '@apollo/client';
import { AppState, AppStateStatus } from 'react-native';
import { useMyId } from 'src/hooks/me';
import firestore from '@react-native-firebase/firestore';

export const useToughtTalkRoomsWithSubsciption = () => {
  const myId = useMyId();
  const { cache } = useApolloClient();
  const isOnActive = useRef(true);

  const { data: talkRoomsData } = useGetThoughtTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const [isActive, setIsActive] = useState(true);
  const [subsucribeMessageId, setSubscribeMessageId] = useState<number | null>(
    null
  );

  useGetThoughtTalkRoomMessageQuery({
    skip: !subsucribeMessageId,
    variables: {
      id: subsucribeMessageId,
    },
    onCompleted: (queryData) => {
      setSubscribeMessageId(null);

      if (!queryData?.thoughtTalkRoomMessage) {
        return;
      }

      const currentRooms = talkRoomsData.thoughtTalkRooms;

      const targetRoomId = queryData.thoughtTalkRoomMessage.roomId;

      const targetRoom = currentRooms.find((r) => r.id === targetRoomId);

      const contributor =
        queryData.thoughtTalkRoomMessage.talkRoom?.thought?.contributor;

      if (!targetRoom) {
        if (contributor && contributor.id === myId) {
          setNewTalkRoomId(queryData.thoughtTalkRoomMessage.roomId);
        }
        return;
      }

      if (
        targetRoom.messages.edges[0]?.node.id ===
        queryData.thoughtTalkRoomMessage.id
      ) {
        return;
      }

      const newMessageEdge = {
        node: queryData.thoughtTalkRoomMessage,
        cursor: queryData.thoughtTalkRoomMessage.id.toString(),
      };

      const newMessageConnection = {
        ...targetRoom.messages,
        edges: [newMessageEdge, ...targetRoom.messages.edges],
        pageInfo: {
          ...targetRoom.messages.pageInfo,
          startCursor: newMessageEdge.node.id.toString(),
        },
      };

      const isMySentData = queryData.thoughtTalkRoomMessage.sender.id === myId;

      const newRoomData = {
        ...targetRoom,
        allMessageSeen: isMySentData,
        messages: newMessageConnection,
      };

      const filteredRooms = currentRooms.filter((r) => r.id !== targetRoomId);

      const newTalkRoomList = [newRoomData, ...filteredRooms];

      cache.writeQuery({
        query: GetThoughtTalkRoomsDocument,
        data: {
          thoughtTalkRooms: newTalkRoomList,
        },
      });
    },
  });

  // Active時、非アクティブ時の処理
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

  const [getThougtTalkRoomQuery] = useGetThoughtTalkRoomLazyQuery();

  const [newTalkRoomId, setNewTalkRoomId] = useState<number | null>(null);

  useEffect(() => {
    if (isActive && myId) {
      const unsubscribe = firestore()
        .collection('thoughtTalkRoomMessages')
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
  }, [isActive, myId]);

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
