import React, { useLayoutEffect } from "react";
import { RootNavigationScreenProp } from "src/types";
import { HeaderBackButton } from "@react-navigation/elements";

type Props = RootNavigationScreenProp<"OneOnOneTalkRoomMain">;

export const OneOnOneTalkRoomScreen = ({ navigation, route }: Props) => {
  const talkRoomId = route.params.id;
  const { user } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerTitle: user.name,
    });
  }, [navigation]);

  return null;
};
