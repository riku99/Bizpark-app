import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useGetNewsTalkRoomMembersQuery } from "src/generated/graphql";

type Props = RootNavigationScreenProp<"NewsTalkRoomMembers">;

export const NewsTalkRoomMembersScreen = ({ navigation, route }: Props) => {
  const { talkRoomId } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "メンバー",
    });
  }, [navigation]);

  const { data: membersData, fetchMore } = useGetNewsTalkRoomMembersQuery({
    variables: {
      talkRoomId,
    },
  });

  return <Box></Box>;
};
