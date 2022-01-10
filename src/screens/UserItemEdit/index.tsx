import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";

type Props = RootNavigationScreenProp<"UserItemEdit">;

export const UserItemEditScreen = ({ navigation, route }: Props) => {
  const { type, value, setValue } = route.params;
  let title = "";
  switch (type) {
    case "name":
      title = "名前";
      break;
    case "bio":
      title = "自己紹介";
      break;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation]);

  return <Box></Box>;
};
