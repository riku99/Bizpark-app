import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";

type Props = RootNavigationScreenProp<"BlockingUsers">;

export const BlockingUsersScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "ブロックリスト",
    });
  }, [navigation]);

  return <Box flex={1}></Box>;
};
