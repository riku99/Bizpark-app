import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { SimpleListItem } from "src/components/SimpleListItem";

type Props = RootNavigationScreenProp<"UserSettings">;

export const UserSettingsScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "ユーザー",
    });
  }, [navigation]);

  const list = [
    {
      title: "ブロックしているユーザー",
      onPress: () => {
        navigation.navigate("BlockingUsers");
      },
    },
  ];

  return (
    <Box flex={1} px="4">
      {list.map((item, idx) => (
        <SimpleListItem key={idx} title={item.title} onPress={item.onPress} />
      ))}
    </Box>
  );
};
