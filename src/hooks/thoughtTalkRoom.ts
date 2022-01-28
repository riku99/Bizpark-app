import {
  OnThoughtTalkRoomMessageCreatedDocument,
  OnThoughtTalkRoomMessageCreatedSubscription,
  ThoughtTalkRoomPartsFragment,
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQuery,
  OnThoughtTalkRoomMessageCreatedSubscriptionVariables,
  useGetThoughtTalkRoomsQuery,
} from "src/generated/graphql";
import { useEffect, useCallback, useMemo } from "react";
import { gotInitialDataVar } from "src/stores/initialData";
import { useReactiveVar, useApolloClient, gql } from "@apollo/client";
import { meVar } from "src/stores/me";
import { logJson } from "src/utils";

export const useToughtTalkRoomsWithSubsciption = () => {
  const gotInitialData = useReactiveVar(gotInitialDataVar);
  const myId = useReactiveVar(meVar.id);
  const {
    data: talkRoomsData,
    subscribeToMore,
    refetch,
  } = useGetThoughtTalkRoomsQuery();

  const subscriptionVariables = useMemo(() => {
    if (!talkRoomsData?.thoughtTalkRooms.length) {
      return [];
    }

    return talkRoomsData.thoughtTalkRooms.map((t) => t.id);
  }, [talkRoomsData?.thoughtTalkRooms.length]);

  useEffect(() => {
    let unsubscribe: () => void;
    (async function () {
      if (gotInitialData && myId) {
        unsubscribe = subscribeToMore<
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
            const {
              contributor,
            } = subscriptionData.data.thoughtTalkRoomMessageCreated.talkRoom.thought;

            if (!targetRoom) {
              if (contributor.id === myId) {
                refetch();
                return;
              } else {
                return prev;
              }
            }

            const newEdge = {
              node: subscriptionData.data.thoughtTalkRoomMessageCreated,
              cursor: subscriptionData.data.thoughtTalkRoomMessageCreated.id.toString(),
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
              allMessageSeen: isMySentData ? true : false,
              messages: newConnection,
            };

            const filtered = rooms.filter((r) => r.id !== roomId);
            const newTalkListData = [newRoomData, ...filtered];

            return {
              thoughtTalkRooms: newTalkListData,
            };
          },
        });
      }
    })();

    if (unsubscribe) {
      return () => {
        console.log("🍺 unsubscribe thoughtTalkRoomMessageSubscription");
        unsubscribe();
      };
    }
  }, [gotInitialData, myId, subscriptionVariables]);
};

export const useThoughtTalkRoomReadFragment = ({ id }: { id: number }) => {
  const client = useApolloClient();
  return client.cache.readFragment<ThoughtTalkRoomPartsFragment>({
    id: client.cache.identify({
      __typename: "ThoughtTalkRoom",
      id,
    }),
    fragment: gql`
      fragment ThoughtTalkRoomF on ThoughtTalkRoom {
        id
        members {
          edges {
            node {
              id
              user {
                id
                name
                imageUrl
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
        messages(first: 20) {
          edges {
            node {
              id
              text
              createdAt
              sender {
                id
                name
                imageUrl
              }
              roomId
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
        thought {
          id
          contributor {
            id
          }
        }
      }
    `,
  });
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
    []
  );

  return {
    deleteThoghtTalkRoom,
  };
};
