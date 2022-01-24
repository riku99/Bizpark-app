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

export const useToughtTalkRoomsWithSubsciption = () => {
  const gotInitialData = useReactiveVar(gotInitialDataVar);
  const meId = useReactiveVar(meVar.id);
  const {
    data: talkRoomsData,
    subscribeToMore,
  } = useGetThoughtTalkRoomsQuery();

  const subscriptionVariables = useMemo(() => {
    if (!talkRoomsData?.thoughtTalkRooms.length) {
      return [];
    }

    return talkRoomsData.thoughtTalkRooms.map((t) => t.id);
  }, [talkRoomsData?.thoughtTalkRooms.length]);

  useEffect(() => {
    console.log("subscriptionVariablesが変更されました");
  }, [subscriptionVariables]);

  useEffect(() => {
    let unsubscribe: () => void;
    (async function () {
      if (gotInitialData && meId) {
        console.log("subscribe");
        unsubscribe = subscribeToMore<
          OnThoughtTalkRoomMessageCreatedSubscription,
          OnThoughtTalkRoomMessageCreatedSubscriptionVariables
        >({
          document: OnThoughtTalkRoomMessageCreatedDocument,
          variables: { roomIds: subscriptionVariables, userId: meId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData) {
              return prev;
            }

            const roomId =
              subscriptionData.data.thoughtTalkRoomMessageCreated.roomId;
            const rooms = prev.thoughtTalkRooms;
            const targetRoom = rooms.find((r) => r.id === roomId);

            if (!targetRoom) {
              return prev;
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
              meId;

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
  }, [gotInitialData, meId, subscriptionVariables]);
};

export const useThoughtTalkRoomReadFragment = ({ id }: { id: number }) => {
  const client = useApolloClient();
  return client.cache.readFragment<ThoughtTalkRoomPartsFragment>({
    id: client.cache.identify({
      __typename: "ThoughtTalkRoom",
      id,
    }),
    fragment: gql`
      fragment ThoughtTalkRoomMessage on ThoughtTalkRoom {
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
