import {
  useGetOneOnOneTalkRoomsQuery,
  OnOneOnOneTalkRoomMessageCreatedSubscription,
  OnOneOnOneTalkRoomMessageCreatedSubscriptionVariables,
  OnOneOnOneTalkRoomMessageCreatedDocument,
} from "src/generated/graphql";
import { meVar } from "src/stores/me";
import { useReactiveVar, useApolloClient } from "@apollo/client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useOneOnOneTalkRoomsWithSubscription = () => {
  const myId = useReactiveVar(meVar.id);

  const { subscribeToMore } = useGetOneOnOneTalkRoomsQuery({
    fetchPolicy: "cache-only",
  });

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const onChange = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    AppState.addEventListener("change", onChange);

    return () => {
      AppState.removeEventListener("change", onChange);
    };
  }, [setIsActive]);

  // サブスクライブ
  useEffect(() => {
    if (isActive && myId) {
      console.log("😆　subsucribe for OneOnOneTalkRooms");

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
            // そのルームをフェッチ
          }

          const newMessageEdge = {
            node: subscriptionData.data.oneOnOneTalkRoomMessageCreated,
            cursor: subscriptionData.data.oneOnOneTalkRoomMessageCreated.id.toString(),
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
          console.log("案サブスク OneOnOneTalkRooms");
          unsubscribe();
        }
      };
    }
  }, [isActive, myId, subscribeToMore]);
};
