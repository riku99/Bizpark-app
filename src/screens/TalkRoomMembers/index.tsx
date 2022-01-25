import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useGetThoughtTalkRoomMembersQuery } from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";

type Props = RootNavigationScreenProp<"TalkRoomMembers">;

export const TalkRoomMembersScreen = ({ navigation, route }: Props) => {
  const { talkRoomId } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "メンバー",
    });
  }, [navigation]);

  const { data, fetchMore } = useGetThoughtTalkRoomMembersQuery({
    variables: {
      talkRoomId,
    },
    fetchPolicy: "network-only",
  });

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  console.log(data.thoughtTalkRoom.members);

  return <Box></Box>;
};
