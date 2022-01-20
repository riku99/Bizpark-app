import {
  useGetThoughtTalkRoomsQuery,
  useGetThoughtTalkRoomsLazyQuery,
  OnThoughtTalkRoomMessageCreatedDocument,
  OnThoughtTalkRoomMessageCreatedSubscription,
} from "src/generated/graphql";
import { useCallback, useEffect } from "react";
import { gotInitialDataVar } from "src/stores/initialData";
import { useReactiveVar, useApolloClient } from "@apollo/client";

export const useToughtTalkRoomsWithSubsciption = () => {
  // const { data, subscribeToMore } = useGetThoughtTalkRoomsQuery();
  const [query] = useGetThoughtTalkRoomsLazyQuery();
  const gotInitialData = useReactiveVar(gotInitialDataVar);
  useEffect(() => {
    console.log(gotInitialData);
  }, [gotInitialData]);
  // const [query] = useGetThoughtTalkRoomsLazyQuery();
  // const getThoughtTalkRoomsWithSubscription = useCallback(async () => {
  //   const { subscribeToMore } = await query();

  //   const unsubscribe = subscribeToMore<OnThoughtTalkRoomMessageCreatedSubscription>(
  //     {
  //       document: OnThoughtTalkRoomMessageCreatedDocument,
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData) {
  //           return prev;
  //         }

  //         const roomId =
  //           subscriptionData.data.thoughtTalkRoomMessageCreated.roomId;
  //         const rooms = prev.thoughtTalkRooms;
  //         const targetRoom = rooms.find((r) => r.id === roomId);

  //         if (!targetRoom) {
  //           return prev;
  //         }

  //         const newRoomData = {
  //           ...targetRoom,
  //           messages: [
  //             subscriptionData.data.thoughtTalkRoomMessageCreated,
  //             ...targetRoom.messages,
  //           ],
  //         };

  //         const filtered = rooms.filter((r) => r.id !== roomId);
  //         const newTalkListData = [newRoomData, ...filtered];

  //         return {
  //           thoughtTalkRooms: newTalkListData,
  //         };
  //       },
  //     }
  //   );
  // }, [query]);

  // return {
  //   getThoughtTalkRoomsWithSubscription,
  // };
};
