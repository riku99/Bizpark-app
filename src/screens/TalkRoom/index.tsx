import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";

type Props = RootNavigationScreenProp<"TalkRoom">;

export const TalkRoomScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, [navigation]);

  return <Box></Box>;
};
