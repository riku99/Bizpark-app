import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";

type Props = RootNavigationScreenProp<"Settings">;

export const SettingsScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "設定",
    });
  }, [navigation]);

  return <Box flex={1}></Box>;
};
