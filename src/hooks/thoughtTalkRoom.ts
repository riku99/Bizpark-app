import {
  useGetThoughtTalkRoomsLazyQuery,
  OnThoughtTalkRoomMessageCreatedDocument,
  OnThoughtTalkRoomMessageCreatedSubscription,
} from "src/generated/graphql";
import { useEffect } from "react";
import { gotInitialDataVar } from "src/stores/initialData";
import { useReactiveVar } from "@apollo/client";

export const useToughtTalkRoomsWithSubsciption = () => {
  const [query] = useGetThoughtTalkRoomsLazyQuery();
  const gotInitialData = useReactiveVar(gotInitialDataVar);
  useEffect(() => {
    (async function () {
      if (gotInitialData) {
        const { subscribeToMore } = await query();

        const unsubscribe = subscribeToMore<OnThoughtTalkRoomMessageCreatedSubscription>(
          {
            document: OnThoughtTalkRoomMessageCreatedDocument,
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData) {
                return prev;
              }

              console.log(subscriptionData);

              const roomId =
                subscriptionData.data.thoughtTalkRoomMessageCreated.roomId;
              const rooms = prev.thoughtTalkRooms;
              const targetRoom = rooms.find((r) => r.id === roomId);

              if (!targetRoom) {
                return prev;
              }

              const newRoomData = {
                ...targetRoom,
                messages: [
                  subscriptionData.data.thoughtTalkRoomMessageCreated,
                  ...targetRoom.messages,
                ],
              };

              // console.log(
              //   JSON.stringify(newRoomData.messages.slice(0, 2), null, 2)
              // );

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
  }, [gotInitialData]);
};
