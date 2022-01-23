import {
  useGetThoughtTalkRoomsLazyQuery,
  OnThoughtTalkRoomMessageCreatedDocument,
  OnThoughtTalkRoomMessageCreatedSubscription,
  ThoughtTalkRoomPartsFragment,
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQuery,
} from "src/generated/graphql";
import { useEffect, useCallback } from "react";
import { gotInitialDataVar } from "src/stores/initialData";
import { useReactiveVar, useApolloClient, gql } from "@apollo/client";
import { meVar } from "src/stores/me";

export const useToughtTalkRoomsWithSubsciption = () => {
  const [query] = useGetThoughtTalkRoomsLazyQuery();
  const gotInitialData = useReactiveVar(gotInitialDataVar);
  const meId = useReactiveVar(meVar.id);
  useEffect(() => {
    (async function () {
      if (gotInitialData && meId) {
        const { subscribeToMore } = await query();

        const unsubscribe = subscribeToMore<OnThoughtTalkRoomMessageCreatedSubscription>(
          {
            document: OnThoughtTalkRoomMessageCreatedDocument,
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
                subscriptionData.data.thoughtTalkRoomMessageCreated.sender
                  .id === meId;

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
          }
        );

        return () => {
          console.log("🍺 unsubscribe thoughtTalkRoomMessageSubscription");
          unsubscribe();
        };
      }
    })();
  }, [gotInitialData, meId]);
};

export const useThoughtTalkRoomReadFragment = ({ id }: { id: string }) => {
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
