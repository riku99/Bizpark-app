import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";

type Props = RootNavigationScreenProp<"TalkRoomMembers">;

export const TalkRoomMembersScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "メンバー",
    });
  }, [navigation]);

  return <Box></Box>;
};
