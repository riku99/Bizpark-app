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

  const {
    data: talkRoomsData,
    subscribeToMore,
    refetch,
  } = useGetNewsTalkRoomsQuery({
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
          console.log(subscriptionData);

          return prev;
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
