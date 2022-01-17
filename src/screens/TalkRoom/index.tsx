import React, { useLayoutEffect, useMemo, useEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useApolloClient } from "@apollo/client";
import {
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQueryResult,
  GetThoughtTalkRoomQuery,
  useGetThoughtTalkRoomQuery,
} from "src/generated/graphql";

type Props = RootNavigationScreenProp<"TalkRoom">;

export const TalkRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const client = useApolloClient();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, [navigation]);

  const { data } = useGetThoughtTalkRoomQuery({
    variables: {
      id,
    },
    fetchPolicy: "network-only",
  });

  const queryData = useMemo(() => {
    console.log("memo👀");
    const queryResult = client.cache.readQuery<
      GetThoughtTalkRoomsQueryResult["data"]
    >({
      query: GetThoughtTalkRoomsDocument,
    });

    return queryResult.thoughtTalkRooms.find((t) => t.id === id);
  }, [data]);

  useEffect(() => {
    console.log("🌙 list query data is");
    console.log(queryData.messages);
  }, [queryData]);

  return <Box></Box>;
};
