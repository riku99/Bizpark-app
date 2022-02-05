import {
  useGetNewsTalkRoomsQuery,
  OnNewsTalkRoomMessageCreatedDocument,
  OnNewsTalkRoomMessageCreatedSubscription,
  OnNewsTalkRoomMessageCreatedSubscriptionVariables,
} from "src/generated/graphql";
import { meVar } from "src/stores/me";
import { useReactiveVar } from "@apollo/client";
import { useState, useMemo, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useNewsTalkRoomsWithSusbscription = () => {
  const myId = useReactiveVar(meVar.id);

  const { data: talkRoomsData, subscribeToMore } = useGetNewsTalkRoomsQuery({
    fetchPolicy: "cache-only",
  });

  const [isActive, setIsActive] = useState(true);

  const talkRoomIds = useMemo(() => {
    if (!talkRoomsData) {
      return [];
    }

    return talkRoomsData.newsTalkRooms.map((room) => room.id);
  }, [talkRoomsData?.newsTalkRooms.length]);

  // アクティブ、非アクティブの処理
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
      console.log("🌙 subsucribe for NewsTalkRooms");

      const unsubscribe = subscribeToMore<
        OnNewsTalkRoomMessageCreatedSubscription,
        OnNewsTalkRoomMessageCreatedSubscriptionVariables
      >({
        document: OnNewsTalkRoomMessageCreatedDocument,
        variables: { roomIds: talkRoomIds, userId: myId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) {
            return prev;
          }

          const currentRooms = prev.newsTalkRooms;

          const targetTalkRoomId =
            subscriptionData.data.newsTalkRoomMessageCreated.roomId;

          const targetRoom = currentRooms.find(
            (r) => r.id === targetTalkRoomId
          );

          if (!targetRoom) {
            return prev;
          }

          const newMessageEdge = {
            node: subscriptionData.data.newsTalkRoomMessageCreated,
            cursor: subscriptionData.data.newsTalkRoomMessageCreated.id.toString(),
          };

          const newMessageConnection = {
            ...targetRoom.messages,
            edges: [newMessageEdge, ...targetRoom.messages.edges],
            pageInfo: {
              ...targetRoom.messages.pageInfo,
              startCursor: newMessageEdge.node.id.toString(),
            },
          };

          const isMySentData =
            subscriptionData.data.newsTalkRoomMessageCreated.sender.id === myId;

          const newRoomData = {
            ...targetRoom,
            allMessageSeen: isMySentData,
            messages: newMessageConnection,
          };

          const filteredRooms = currentRooms.filter(
            (r) => r.id !== targetTalkRoomId
          );

          const newTalkRoomList = [newRoomData, ...filteredRooms];

          return {
            newsTalkRooms: newTalkRoomList,
          };
        },
      });

      return () => {
        if (unsubscribe) {
          console.log("案サブスク NewsTalkRoom");
          unsubscribe();
        }
      };
    }
  }, [isActive, myId, talkRoomIds, subscribeToMore]);
};
