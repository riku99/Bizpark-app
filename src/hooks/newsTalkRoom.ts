import {
  useGetNewsTalkRoomsQuery,
  GetNewsTalkRoomsQuery,
  GetNewsTalkRoomsDocument,
  useGetNewsTalkRoomMessageQuery,
} from 'src/generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useMyId } from 'src/hooks/me';
import firestore from '@react-native-firebase/firestore';

export const useNewsTalkRoomsWithSusbscription = () => {
  const cache = useApolloClient();
  const myId = useMyId();
  const isOnActive = useRef(true);

  const { data: talkRoomsData } = useGetNewsTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const [isActive, setIsActive] = useState(true);
  const [subscribeMessageId, setSubscribeMessageId] = useState<number | null>(
    null
  );

  useGetNewsTalkRoomMessageQuery({
    skip: !subscribeMessageId,
    variables: {
      id: subscribeMessageId,
    },
    onCompleted: (queryData) => {
      setSubscribeMessageId(null);
      console.log('Completed💓');
      console.log(queryData.newsTalkRoomMessage);

      const currentRooms = talkRoomsData.newsTalkRooms;

      const targetTalkRoomId = queryData.newsTalkRoomMessage.roomId;

      const targetRoom = currentRooms.find((r) => r.id === targetTalkRoomId);

      if (
        !targetRoom ||
        targetRoom.messages.edges[0].node.id ===
          queryData.newsTalkRoomMessage.id
      ) {
        return;
      }

      const newMessageEdge = {
        node: queryData.newsTalkRoomMessage,
        cursor: queryData.newsTalkRoomMessage.id.toString(),
      };

      const newMessageConnection = {
        ...targetRoom.messages,
        edges: [newMessageEdge, ...targetRoom.messages.edges],
        pageInfo: {
          ...targetRoom.messages.pageInfo,
          startCursor: newMessageEdge.node.id.toString(),
        },
      };

      const isMySentData = queryData.newsTalkRoomMessage.sender.id === myId;

      const newRoomData = {
        ...targetRoom,
        allMessageSeen: isMySentData,
        messages: newMessageConnection,
      };

      const filteredRooms = currentRooms.filter(
        (r) => r.id !== targetTalkRoomId
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

  // アクティブ、非アクティブの処理
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

  // サブスクライブ
  useEffect(() => {
    if (isActive && myId) {
      console.log('🌙 subsucribe for NewsTalkRooms');

      const unsubscribe = firestore()
        .collection('newsTalkRoomMessages')
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
          console.log('案サブスク NewsTalkRoom');
          unsubscribe();
        }
      };
    }
  }, [isActive, myId]);
};

export const useDeleteNewsTalkRoomFromCache = () => {
  const { cache } = useApolloClient();

  const deleteNewsTalkRoom = useCallback(
    ({ talkRoomId }: { talkRoomId: number }) => {
      const queryResult = cache.readQuery<GetNewsTalkRoomsQuery>({
        query: GetNewsTalkRoomsDocument,
      });

      if (queryResult) {
        const filteredData = queryResult.newsTalkRooms.filter(
          (n) => n.id !== talkRoomId
        );

        cache.writeQuery({
          query: GetNewsTalkRoomsDocument,
          data: { newsTalkRooms: filteredData },
        });
      }
    },
    [cache]
  );

  return {
    deleteNewsTalkRoom,
  };
};

export const useFindNewsTalkRoomFromNewsId = () => {
  const { cache } = useApolloClient();

  const findNewsTalkRoom = useCallback(
    ({ newsId }: { newsId: number }) => {
      const result = cache.readQuery<GetNewsTalkRoomsQuery>({
        query: GetNewsTalkRoomsDocument,
      });

      if (result) {
        const targetRoom = result.newsTalkRooms.find(
          (n) => n.news.id === newsId
        );

        return targetRoom;
      }
    },
    [cache]
  );

  return {
    findNewsTalkRoom,
  };
};

export const useFindNewsTalkRoom = () => {
  const { data } = useGetNewsTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const findNewsTalkRoom = useCallback(
    ({ id }: { id: number }) => {
      if (!data.newsTalkRooms) {
        return null;
      }

      return data.newsTalkRooms.find((room) => room.id === id);
    },
    [data]
  );

  return {
    findNewsTalkRoom,
  };
};
